#![feature(file_create_new)]

pub mod models;

use chrono::{DateTime, Datelike, Utc};
use lambda_http::{run, service_fn, Body, Error, Response};
use models::AOCResponse;
use reqwest::{Client, Url};
use serde::Serialize;
use serde_json::json;
use std::{env, str::FromStr};

async fn function_handler(_: lambda_http::Request) -> Result<Response<Body>, Error> {
    let leaderboard = get_aoc_leaderboard().await?;

    let year = leaderboard.event.parse::<i32>().unwrap();

    let response_members = leaderboard.members;
    let owner_id = leaderboard.owner_id;

    let mut members: Vec<Member> = Vec::with_capacity(response_members.len());
    for (id, member) in response_members.into_iter() {
        let mut days_ontime: [(bool, bool); 25] = [(false, false); 25];
        let mut point: usize = 0;

        member
            .completion_day_level
            .iter()
            .for_each(|(day, completion)| {
                let day = day.parse::<u32>().unwrap();

                let mut day_tasks_on_time = (false, false);

                day_tasks_on_time.0 = completion
                    .get("1")
                    .map(|day_completion| day_completion.get_star_ts as i64)
                    .map(|time| DateTime::from_timestamp(time, 0).unwrap())
                    .map(|time| is_on_time(time, year, day))
                    .unwrap_or(false);

                day_tasks_on_time.1 = completion
                    .get("2")
                    .map(|day_completion| day_completion.get_star_ts as i64)
                    .map(|time| DateTime::from_timestamp(time, 0).unwrap())
                    .map(|time| is_on_time(time, year, day))
                    .unwrap_or(false);

                days_ontime[day as usize - 1] = day_tasks_on_time;
            });

        members.push(Member {
            name: member.name,
            stars: member.stars,
            completed_tasks_on_time: days_ontime.to_vec(),
            is_owner: id == owner_id.to_string(),
        });
    }
    let members_string = serde_json::to_string(&members).unwrap();
    let message =
        format!("Fetched leaderboard for Advent of Code {year}. Members:\n{members_string:?}");
    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .body(message.into())
        .map_err(Box::new)?;
    Ok(resp)
}

fn is_on_time(time: DateTime<Utc>, year: i32, day: u32) -> bool {
    time.year() == year && time.month() == 12 && time.day() == day
}

async fn get_aoc_leaderboard() -> Result<AOCResponse, Error> {
    let cookie = env::var("AOC_COOKIE").expect("AOC_COOKIE environment variable not set");
    let leaderboard =
        env::var("AOC_LEADERBOARD").expect("AOC_LEADERBOARD environment variable not set");
    let year = env::var("AOC_YEAR").expect("AOC_YEAR environment variable not set");
    let url =
        format!("https://adventofcode.com/{year}/leaderboard/private/view/{leaderboard}.json");
    let client = Client::new();
    let request = client
        .get(Url::parse(&url).unwrap())
        .header("Content-Type", "application/json;charset=utf-8")
        .header("Cookie", cookie);
    let response_body = request.send().await?.text().await?;
    let response = serde_json::from_str::<AOCResponse>(&response_body)?;
    Ok(response)
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}

#[derive(Debug, Serialize)]
struct Member {
    name: String,
    stars: isize,
    completed_tasks_on_time: Vec<(bool, bool)>,
    is_owner: bool,
    // points: usize,
}

enum TaskStatus {
    OnTime,
    Late,
    Incomplete,
}

struct DayTasksOnTime {
    task_1: TaskStatus,
    task_2: TaskStatus,
}
