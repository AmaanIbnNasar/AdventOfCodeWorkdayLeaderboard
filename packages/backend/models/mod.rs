use std::collections::HashMap;

use serde::Deserialize;

#[derive(Debug, Deserialize, PartialEq)]
pub struct AOCResponse {
    pub event: String,
    pub owner_id: isize,
    pub members: Members
}

pub type Members = HashMap<String, Member>;

#[derive(Debug, Deserialize, PartialEq)]
pub struct Member {
    global_score: isize,
	stars: isize,
	id: isize,
	name: String,
	local_score: isize,
	last_star_ts: isize,
	completion_day_level: CompletionDayLevel
}

pub type CompletionDayLevel = HashMap<String, Day>;

pub type Day = HashMap<String, Completion>;

#[derive(Debug, Deserialize, PartialEq)]
pub struct Completion {
    star_index: isize,
    get_star_ts: isize,
}

#[cfg(test)]
mod test;