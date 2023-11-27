mod config;

use aws_sdk_dynamodb::{types::AttributeValue, Client};
use lambda_http::{run, service_fn, Body, Response};
use reqwest::Url;

async fn function_handler(_: lambda_http::Request) -> Result<Response<Body>, lambda_http::Error> {
    let vars = config::get_environment_variables();

    let response_body = get_aoc_response(&vars).await?;

    let config = aws_config::from_env().region("eu-west-2").load().await;
    let client = Client::new(&config);

    let response = Response::builder().header("content-type", "application/json");

    let cache_update_response = client
        .update_item()
        .table_name("AOC_Cache")
        .key(
            format!("{}:{}", vars.leaderboard, vars.year),
            AttributeValue::S(response_body),
        )
        .send()
        .await;

    let response = match cache_update_response {
        Ok(_) => response
            .status(200)
            .body("Successfully updated cache".into()),
        Err(e) => response
            .status(500)
            .body(format!("Error updating cache\n{e:?}").into()),
    };

    Ok(response.map_err(Box::new)?)
}

async fn get_aoc_response(vars: &config::EnvironmentVariables) -> Result<String, reqwest::Error> {
    let url = format!(
        "https://adventofcode.com/{}/leaderboard/private/view/{}.json",
        vars.year, vars.leaderboard
    );
    let client = reqwest::Client::new();
    let request = client
        .get(Url::parse(&url).unwrap())
        .header("Content-Type", "application/json;charset=utf-8")
        .header("Cookie", vars.cookie.clone());
    request.send().await?.text().await
}

#[tokio::main]
async fn main() -> Result<(), lambda_http::Error> {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::INFO)
        // disable printing the name of the module in every log line.
        .with_target(false)
        // disabling time is handy because CloudWatch will add the ingestion time.
        .without_time()
        .init();

    run(service_fn(function_handler)).await
}
