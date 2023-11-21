pub mod models;

use chrono::{DateTime, Datelike, Utc};
use lambda_http::{run, service_fn, Body, Error, Response};
use models::{AOCResponse, TaskCompletion};
use reqwest::{Client, Url};
use serde::Serialize;
use std::{collections::HashMap, env};

async fn function_handler(_: lambda_http::Request) -> Result<Response<Body>, Error> {
    let leaderboard = get_aoc_leaderboard().await?;

    let year = leaderboard.event.parse::<i32>().unwrap();

    let response_members = leaderboard.members;
    let owner_id = leaderboard.owner_id;

    let mut members: Vec<Member> = Vec::with_capacity(response_members.len());
    for (id, member) in response_members.into_iter() {
        let mut day_statuses: Vec<DayStatus> = Vec::with_capacity(25);
        let points: usize = 0;

        member
            .completion_day_level
            .iter()
            .map(|(day, day_status)| (day.parse::<u32>().unwrap(), day_status))
            .for_each(|(day, tasks)| {
                day_statuses[day as usize - 1] = get_day_status(day, year, tasks);
            });

        let is_owner = match id == owner_id.to_string() {
            true => Some(true),
            false => None,
        };

        members.push(Member {
            name: member.name,
            stars: member.stars,
            day_statuses,
            is_owner,
            points,
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

fn get_day_status(day: u32, year: i32, tasks: &HashMap<String, TaskCompletion>) -> DayStatus {
    let task_1 = get_task_status(tasks.get("1"), day, year);

    let task_2 = get_task_status(tasks.get("2"), day, year);

    DayStatus { task_1, task_2 }
}

fn get_task_status(task: Option<&TaskCompletion>, day: u32, year: i32) -> TaskStatus {
    task.map(|task| task.get_star_ts as i64)
        .map(|time| DateTime::from_timestamp(time, 0).unwrap())
        .map(|time| is_on_time(time, day, year))
        .unwrap_or(TaskStatus::Incomplete)
}

fn is_on_time(time: DateTime<Utc>, day: u32, year: i32) -> TaskStatus {
    if time.year() == year && time.month() == 12 && time.day() == day {
        TaskStatus::OnTime
    } else {
        TaskStatus::Late
    }
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
    day_statuses: Vec<DayStatus>,
    is_owner: Option<bool>,
    points: usize,
}

#[derive(Debug, Serialize)]
struct DayStatus {
    task_1: TaskStatus,
    task_2: TaskStatus,
}

#[derive(Debug, Serialize)]
enum TaskStatus {
    OnTime,
    Late,
    Incomplete,
}
