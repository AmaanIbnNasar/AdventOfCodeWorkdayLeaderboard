use std::collections::HashMap;

use serde::Deserialize;

#[derive(Debug, Deserialize, PartialEq)]
pub struct AOCResponse {
    pub event: String,
    pub owner_id: isize,
    pub members: ResponseMembers
}

pub type ResponseMembers = HashMap<String, Member>;

#[derive(Debug, Deserialize, PartialEq)]
pub struct Member {
    pub global_score: isize,
	pub stars: isize,
	pub id: isize,
	pub name: String,
	pub local_score: isize,
	pub last_star_ts: isize,
	pub completion_day_level: CompletionDayLevel
}

pub type CompletionDayLevel = HashMap<String, Day>;

pub type Day = HashMap<String, Completion>;

#[derive(Debug, Deserialize, PartialEq)]
pub struct Completion {
    pub star_index: isize,
    pub get_star_ts: isize,
}

#[cfg(test)]
mod test;