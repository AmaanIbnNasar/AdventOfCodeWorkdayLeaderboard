# AdventOfCodeWorkdayLeaderboard
An Advent of Code leaderboard with a scoring system more appropriate for the workday.

## Scoring

- Weekends are scored as on time regardless of completion time
- A task completed on the day it is set is worth 2 points
- A task completed after the day it is set is worth 1 point

## Restrictions

- The Advent of Code API limits a user to 1 request per 15 minutes, so our cache will only update every 15 minutes.
