pub mod models;

mod config;

use std::time::SystemTime;

use chrono::{Datelike, TimeZone, Utc};
use lambda_http::{run, service_fn, Body, Error, Response};
use models::{
    aocresponse::{AOCMember, AOCResponse},
    lambdaresponse::{get_day_status, DayStatus, Member, TaskStatus},
};

use serde::Serialize;

use aws_sdk_s3::primitives::DateTime;
#[derive(Debug, Serialize)]
struct LambdaResponse {
    message: String,
    cache_last_updated: i64,
    members: Vec<Member>,
}

#[derive(Debug, Serialize)]
struct ErrorResponse {
    message: String,
}

async fn function_handler(request: lambda_http::Request) -> Result<Response<Body>, Error> {
    let response_builder = Response::builder()
        .header("content-type", "application/json")
        .header("Access-Control-Allow-Origin", "*")
        .header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept",
        );
    let response_builder = match get_response(request).await {
        Ok(response) => {
            let response_string = serde_json::to_string(&response).unwrap();
            response_builder.status(200).body(response_string.into())
        }
        Err(e) => {
            let response_string = serde_json::to_string(&ErrorResponse { message: e }).unwrap();
            response_builder.status(500).body(response_string.into())
        }
    };
    Ok(response_builder.unwrap())
}

async fn get_response(request: lambda_http::Request) -> Result<LambdaResponse, String> {
    let vars = config::get_environment_variables(request)?;

    let cache_response = get_aoc_leaderboard(&vars).await?;
    let leaderboard = cache_response.leaderboard;

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
    let cache_last_updated = cache_response.last_updated.secs();
    Ok(LambdaResponse {
        message,
        members,
        cache_last_updated,
    })
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
        name: member.name.unwrap_or("Anonymous".to_string()),
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
        .map(|(day_index, day_status)| (day_index, day_status, is_weekend(day_index + 1, year)))
        .fold(0, |acc, (_, day_status, is_weekend)| {
            let task_1_points = get_task_points(day_status.task_1, is_weekend);
            let task_2_points = get_task_points(day_status.task_2, is_weekend);
            acc + task_1_points + task_2_points
        })
}

fn get_task_points(task_status: TaskStatus, is_weekend: bool) -> usize {
    match (is_weekend, task_status) {
        (true, TaskStatus::OnTime) | (true, TaskStatus::Late) => 2,
        (false, TaskStatus::OnTime) => 2,
        (false, TaskStatus::Late) => 1,
        (_, TaskStatus::Incomplete) => 0,
    }
}

fn is_weekend(day: usize, year: i32) -> bool {
    // This function filters out the weekends assuming all days are in december
    let date = Utc.with_ymd_and_hms(year, 12, day as u32, 0, 0, 0).unwrap();
    let weekday = date.weekday();
    weekday != chrono::Weekday::Sat && weekday != chrono::Weekday::Sun
}

struct CacheResponse {
    last_updated: DateTime,
    leaderboard: AOCResponse,
}
async fn get_aoc_leaderboard(vars: &config::EnvironmentVariables) -> Result<CacheResponse, String> {
    let response_body: String;
    let last_updated: DateTime;
    if vars.test {
        response_body = std::fs::read_to_string("./AOC_response.json")
            .map_err(|_| "Error accessing test data".to_string())?;
        last_updated = DateTime::from(SystemTime::now());
    } else {
        (response_body, last_updated) = fetch_from_s3(vars).await?;
    }

    let leaderboard = serde_json::from_str::<AOCResponse>(&response_body)
        .map_err(|_| "Error parsing AOC response".to_string())?;

    Ok(CacheResponse {
        last_updated,
        leaderboard,
    })
}

type S3Response = (String, DateTime);
async fn fetch_from_s3(vars: &config::EnvironmentVariables) -> Result<S3Response, String> {
    let cache_key = format!("{}:{}", vars.leaderboard, vars.year);

    let config = aws_config::from_env().region("eu-west-2").load().await;
    let client = aws_sdk_s3::Client::new(&config);

    let bucket_response = client
        .get_object()
        .bucket(vars.bucket.clone())
        .key(format!("{cache_key}/response.json"))
        .send()
        .await
        .map_err(|_| "Unable to fetch S3 cache")?;

    let response_bytes = bucket_response
        .body
        .collect()
        .await
        .map_err(|_| "Error parsing S3 cache")?
        .to_vec();
    let response_body: String = String::from_utf8(response_bytes).unwrap();

    let last_updated = bucket_response.last_modified.unwrap();

    Ok((response_body, last_updated))
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
