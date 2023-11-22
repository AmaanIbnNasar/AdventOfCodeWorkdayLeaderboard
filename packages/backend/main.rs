pub mod models;

use chrono::{DateTime, Datelike, TimeZone, Utc};
use lambda_http::{run, service_fn, Body, Error, Response};
use models::{AOCMember, AOCResponse, TaskCompletion};
use reqwest::{Client, Url};
use serde::Serialize;
use std::{collections::HashMap, env};

#[derive(Debug, Serialize)]
struct LambdaResponse {
    message: String,
    members: Vec<Member>,
}

async fn function_handler(request: lambda_http::Request) -> Result<Response<Body>, Error> {
    let is_test = request
        .headers()
        .get("x-test")
        .map(|value| value.to_str().unwrap().parse::<bool>().unwrap())
        .unwrap_or(false);

    let leaderboard = get_aoc_leaderboard(is_test).await?;

    let year = leaderboard.event.parse::<i32>().unwrap();
    let response_members = leaderboard.members;
    let owner_id = leaderboard.owner_id;

    let members: Vec<Member> = response_members
        .into_iter()
        .map(|(id, member)| parse_member(member, year, id, owner_id))
        .collect();

    let num_members = members.len();

    let response = LambdaResponse {
        message: format!(
            "Fetched leaderboard for Advent of Code {year} with {num_members} participants."
        ),
        members,
    };
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
    let is_owner = match id == owner_id.to_string() {
        true => Some(true),
        false => None,
    };
    let points = calculate_points(&day_statuses, year);
    Member {
        name: member.name,
        stars: member.stars,
        day_statuses,
        is_owner,
        points,
    }
}

fn calculate_points(day_statuses: &[DayStatus], year: i32) -> usize {
    day_statuses
        .iter()
        .enumerate()
        .filter(|(day_index, _)| filter_weekend(day_index + 1, year))
        .map(|(_, day_status)| day_status)
        .map(|day_status| {
            let task_1_points = match day_status.task_1 {
                TaskStatus::OnTime => 2,
                TaskStatus::Late => 1,
                TaskStatus::Incomplete => 0,
            };
            let task_2_points = match day_status.task_2 {
                TaskStatus::OnTime => 2,
                TaskStatus::Late => 1,
                TaskStatus::Incomplete => 0,
            };
            task_1_points + task_2_points
        })
        .sum()
}

fn filter_weekend(day: usize, year: i32) -> bool {
    // This function filters out the weekends assuming all days are in december
    let date = Utc.with_ymd_and_hms(year, 12, day as u32, 0, 0, 0).unwrap();
    let weekday = date.weekday();
    weekday != chrono::Weekday::Sat && weekday != chrono::Weekday::Sun
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

async fn get_aoc_leaderboard(is_test: bool) -> Result<AOCResponse, Error> {
    let cookie = env::var("AOC_COOKIE").expect("AOC_COOKIE environment variable not set");
    let leaderboard =
        env::var("AOC_LEADERBOARD").expect("AOC_LEADERBOARD environment variable not set");
    let year = env::var("AOC_YEAR").expect("AOC_YEAR environment variable not set");
    
    let response;
    if is_test {
        let response_body = std::fs::read_to_string("./AOC_response.json").unwrap();
        response = serde_json::from_str::<AOCResponse>(&response_body)?;
    } else {
        let url =
            format!("https://adventofcode.com/{year}/leaderboard/private/view/{leaderboard}.json");
        let client = Client::new();
        let request = client
            .get(Url::parse(&url).unwrap())
            .header("Content-Type", "application/json;charset=utf-8")
            .header("Cookie", cookie);
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

#[derive(Debug, Serialize)]
struct Member {
    name: String,
    stars: isize,
    day_statuses: Vec<DayStatus>,
    #[serde(skip_serializing_if = "Option::is_none")]
    is_owner: Option<bool>,
    points: usize,
}

#[derive(Debug, Serialize, Clone, Copy)]
struct DayStatus {
    task_1: TaskStatus,
    task_2: TaskStatus,
}

impl Default for DayStatus {
    fn default() -> Self {
        Self {
            task_1: TaskStatus::Incomplete,
            task_2: TaskStatus::Incomplete,
        }
    }
}

#[derive(Debug, Serialize, Clone, Copy)]
enum TaskStatus {
    OnTime,
    Late,
    Incomplete,
}
