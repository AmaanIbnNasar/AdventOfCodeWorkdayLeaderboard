use std::collections::HashMap;

use chrono::{DateTime, Datelike, Utc};
use serde::Serialize;

use super::aocresponse::TaskCompletion;

#[derive(Debug, Serialize)]
pub struct Member {
    pub name: String,
    pub stars: isize,
    pub day_statuses: Vec<DayStatus>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_owner: Option<bool>,
    pub points: usize,
}

#[derive(Debug, Serialize, Clone, Copy)]
pub struct DayStatus {
    pub task_1: TaskStatus,
    pub task_2: TaskStatus,
}

impl Default for DayStatus {
    fn default() -> Self {
        Self {
            task_1: TaskStatus::Incomplete,
            task_2: TaskStatus::Incomplete,
        }
    }
}

#[derive(Debug, Serialize, Clone, Copy)]
pub enum TaskStatus {
    OnTime,
    Late,
    Incomplete,
}

pub fn get_day_status(day: u32, year: i32, tasks: &HashMap<String, TaskCompletion>) -> DayStatus {
    let task_1 = get_task_status(tasks.get("1"), day, year);

    let task_2 = get_task_status(tasks.get("2"), day, year);

    DayStatus { task_1, task_2 }
}

pub fn get_task_status(task: Option<&TaskCompletion>, day: u32, year: i32) -> TaskStatus {
    task.map(|task| task.get_star_ts as i64)
        .map(|time| DateTime::from_timestamp(time, 0).unwrap())
        .map(|time| is_on_time(time, day, year))
        .unwrap_or(TaskStatus::Incomplete)
}

pub fn is_on_time(time: DateTime<Utc>, day: u32, year: i32) -> TaskStatus {
    if time.year() == year && time.month() == 12 && time.day() == day {
        TaskStatus::OnTime
    } else {
        TaskStatus::Late
    }
}