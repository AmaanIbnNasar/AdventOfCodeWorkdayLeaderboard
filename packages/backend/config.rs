use std::env;

use lambda_http::Request;

pub(crate) struct EnvironmentVariables {
    pub(crate) leaderboard: String,
    pub(crate) year: String,
    pub(crate) test: bool,
    pub(crate) bucket: String,
}

pub(crate) fn get_environment_variables(request: Request) -> EnvironmentVariables {
    EnvironmentVariables {
        leaderboard: env::var("AOC_LEADERBOARD")
            .expect("AOC_LEADERBOARD environment variable not set"),
        year: env::var("AOC_YEAR").expect("AOC_YEAR environment variable not set"),
        test: request
            .headers()
            .get("x-test")
            .map(|value| value.to_str().unwrap().parse::<bool>().unwrap())
            .unwrap_or(false),
        bucket: env::var("AOC_BUCKET").expect("AOC_BUCKET environment variable not set"),
    }
}