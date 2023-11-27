use std::collections::HashMap;

use serde::Deserialize;

#[derive(Debug, Deserialize, PartialEq)]
pub struct AOCResponse {
    pub event: String,
    pub owner_id: isize,
    pub members: ResponseMembers
}

pub type MemberId = String;

pub type ResponseMembers = HashMap<MemberId, AOCMember>;

#[derive(Debug, Deserialize, PartialEq)]
pub struct AOCMember {
    pub global_score: isize,
	    pub stars: isize,
	    pub id: isize,
	    pub name: String,
	    pub local_score: isize,
	    pub last_star_ts: isize,
	    pub completion_day_level: DaysCompleted
}

pub type DayId = String;

pub type DaysCompleted = HashMap<DayId, Day>;

pub type TaskStatus = String;

pub type Day = HashMap<TaskStatus, TaskCompletion>;

#[derive(Debug, Deserialize, PartialEq)]
pub struct TaskCompletion {
    pub star_index: isize,
    pub get_star_ts: isize,
}

#[cfg(test)]
pub(crate) mod test;
