use backend::models::AOCResponse;
use lambda_http::{run, service_fn, Body, Error, Response};
use reqwest::{Client, Url};
use std::env;

async fn function_handler(_: lambda_http::Request) -> Result<Response<Body>, Error> {
    let leaderboard = get_aoc_leaderboard().await?;

    let year = leaderboard.event;

    let message = format!("Fetched leaderboard for Advent of Code {year}");
    let resp = Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .body(message.into())
        .map_err(Box::new)?;
    Ok(resp)
}

async fn get_aoc_leaderboard() -> Result<AOCResponse, Error> {
    let cookie = env::var("AOC_COOKIE").expect("AOC_COOKIE environment variable not set");
    let leaderboard =
        env::var("AOC_LEADERBOARD").expect("AOC_LEADERBOARD environment variable not set");
    let url = format!("https://adventofcode.com/2022/leaderboard/private/view/{leaderboard}.json");
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
