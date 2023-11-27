mod config;

use aws_sdk_s3::{primitives::ByteStream, Client};
use lambda_runtime::{run, service_fn, Error, LambdaEvent};

use reqwest::Url;
use serde::Serialize;
use serde_json::Value;

#[derive(Serialize)]
struct Response {
    message: String,
}

async fn function_handler(_: LambdaEvent<Value>) -> Result<Response, lambda_runtime::Error> {
    let vars = config::get_environment_variables();

    let response_body = get_aoc_response(&vars).await?;
    let response_body_bytes: ByteStream = ByteStream::from(response_body.as_bytes().to_vec());

    let cache_key = format!("{}:{}", vars.leaderboard, vars.year);

    let config = aws_config::from_env().region("eu-west-2").load().await;
    let client = Client::new(&config);

    let cache_update_response = client
        .put_object()
        .bucket(vars.bucket)
        .key(format!("{cache_key}/response.json"))
        .body(response_body_bytes)
        .send()
        .await;

    let response = match cache_update_response {
        Ok(_) => Response {
            message: "Successfully updated cache".to_string(),
        },
        Err(e) => Response {
            message: format!("Failed to update cache: {}", e),
        },
    };

    Ok(response)
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
