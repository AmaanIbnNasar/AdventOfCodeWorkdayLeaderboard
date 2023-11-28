use std::{env, str::FromStr};

use aws_lambda_events::http::HeaderValue;
use lambda_http::Request;

pub(crate) struct EnvironmentVariables {
    pub(crate) leaderboard: String,
    pub(crate) year: String,
    pub(crate) test: bool,
    pub(crate) bucket: String,
}

pub(crate) fn get_environment_variables(request: Request) -> Result<EnvironmentVariables, String> {
    let leaderboard = get_header::<usize>(&request, "x-leaderboard")?.to_string();
    let year = get_header::<usize>(&request, "x-year")?.to_string();
    let test = get_optional_header::<bool>(&request, "x-test", false)?;
    let bucket = env::var("AOC_BUCKET").map_err(|_| "AOC_BUCKET environment variable missing")?;
    Ok(EnvironmentVariables {
        leaderboard,
        year,
        test,
        bucket,
    })
}

fn get_header<T: FromStr>(request: &Request, header: &str) -> Result<T, String> {
    request
        .headers()
        .get(header)
        .ok_or(format!("{} header missing", header))
        .and_then(|value| parse_header_value(value, header))
}

fn get_optional_header<T: FromStr>(
    request: &Request,
    header: &str,
    default: T,
) -> Result<T, String> {
    request
        .headers()
        .get(header)
        .map(|value| parse_header_value(value, header))
        .unwrap_or(Ok(default))
}

fn parse_header_value<T: FromStr>(header_value: &HeaderValue, header: &str) -> Result<T, String> {
    header_value
        .to_str()
        .map_err(|_| format!("{} header not valid UTF-8", header))
        .and_then(|value| {
            value.parse::<T>().map_err(|_| {
                format!(
                    "{} header cannot be parsed to type {}",
                    header,
                    std::any::type_name::<T>()
                )
            })
        })
}
