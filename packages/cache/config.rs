use std::env;

use lambda_http::Request;

pub(crate) struct EnvironmentVariables {
    pub(crate) cookie: String,
    pub(crate) leaderboard: String,
    pub(crate) year: String,
}

pub(crate) fn get_environment_variables() -> EnvironmentVariables {
    EnvironmentVariables {
        cookie: env::var("AOC_COOKIE").expect("AOC_COOKIE environment variable not set"),
        leaderboard: env::var("AOC_LEADERBOARD")
            .expect("AOC_LEADERBOARD environment variable not set"),
        year: env::var("AOC_YEAR").expect("AOC_YEAR environment variable not set"),
    }
}
