pub mod models;

mod config;

use chrono::{Datelike, TimeZone, Utc};
use lambda_http::{run, service_fn, Body, Error, Response};
use models::{
    aocresponse::{AOCMember, AOCResponse},
    lambdaresponse::{get_day_status, DayStatus, Member, TaskStatus},
};
use reqwest::{Client, Url};
use serde::Serialize;

#[derive(Debug, Serialize)]
struct LambdaResponse {
    message: String,
    members: Vec<Member>,
}

async fn function_handler(request: lambda_http::Request) -> Result<Response<Body>, Error> {
    let vars = config::get_environment_variables(request);

    let leaderboard = get_aoc_leaderboard(&vars).await?;

    let year = leaderboard.event.parse::<i32>().unwrap();
    let response_members = leaderboard.members;
    let owner_id = leaderboard.owner_id;

    let parse_member_map = |(id, member)| parse_member(member, year, id, owner_id);

    let members: Vec<Member> = response_members.into_iter().map(parse_member_map).collect();

    let num_members = members.len();
    let message = match vars.test {
        false => format!(
            "Fetched leaderboard for Advent of Code {year} with {num_members} participants."
        ),
        true => format!("Using test leaderboard."),
    };
    let response = LambdaResponse { message, members };
    let response_string = serde_json::to_string(&response).unwrap();
    let resp = Response::builder()
        .status(200)
        .header("content-type", "application/json")
        .body(response_string.into())
        .map_err(Box::new)?;
    Ok(resp)
}

fn parse_member(member: AOCMember, year: i32, id: String, owner_id: isize) -> Member {
    let mut day_statuses: Vec<DayStatus> = [DayStatus::default(); 25].to_vec();

    member
        .completion_day_level
        .iter()
        .map(|(day, day_status)| (day.parse::<u32>().unwrap(), day_status))
        .for_each(|(day, tasks)| {
            day_statuses[day as usize - 1] = get_day_status(day, year, tasks);
        });
    let is_owner = is_owner(id, owner_id);
    let points = calculate_points(&day_statuses, year);
    Member {
        name: member.name,
        stars: member.stars,
        day_statuses,
        is_owner,
        points,
    }
}

fn is_owner(id: String, owner_id: isize) -> Option<bool> {
    match id == owner_id.to_string() {
        true => Some(true),
        false => None,
    }
}

fn calculate_points(day_statuses: &[DayStatus], year: i32) -> usize {
    day_statuses
        .iter()
        .enumerate()
        .filter(|(day_index, _)| filter_weekend(day_index + 1, year))
        .fold(0, |acc, (_, day_status)| {
            let task_1_points = get_task_points(day_status.task_1);
            let task_2_points = get_task_points(day_status.task_2);
            acc + task_1_points + task_2_points
        })
}

fn get_task_points(task_status: TaskStatus) -> usize {
    match task_status {
        TaskStatus::OnTime => 2,
        TaskStatus::Late => 1,
        TaskStatus::Incomplete => 0,
    }
}

fn filter_weekend(day: usize, year: i32) -> bool {
    // This function filters out the weekends assuming all days are in december
    let date = Utc.with_ymd_and_hms(year, 12, day as u32, 0, 0, 0).unwrap();
    let weekday = date.weekday();
    weekday != chrono::Weekday::Sat && weekday != chrono::Weekday::Sun
}

async fn get_aoc_leaderboard(vars: &config::EnvironmentVariables) -> Result<AOCResponse, Error> {
    let response;
    if vars.test {
        let response_body = std::fs::read_to_string("./AOC_response.json").unwrap();
        response = serde_json::from_str::<AOCResponse>(&response_body)?;
    } else {
        let url = format!(
            "https://adventofcode.com/{}/leaderboard/private/view/{}.json",
            vars.year, vars.leaderboard
        );
        let client = Client::new();
        let request = client
            .get(Url::parse(&url).unwrap())
            .header("Content-Type", "application/json;charset=utf-8")
            .header("Cookie", vars.cookie.clone());
        let response_body = request.send().await?.text().await?;
        response = serde_json::from_str::<AOCResponse>(&response_body)?;
    }
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
