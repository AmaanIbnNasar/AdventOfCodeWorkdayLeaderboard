# Advent of Code Leaderboard

## Goals

- Leaderboard that accounts for limited time during the work day
- (Optionally) Ignores weekends

## Scoring Ideas

- Number of stars
	- Optionally: 1 point on the day, 1/2 point if late
- Sandbox benchmarking

## API

`https://adventofcode.com/2022/leaderboard/private/view/1599442.json` returns results data

```json
{
    "members": {
        "2388937": {
            "name": "john-kieran-robson",
            "id": 2388937,
            "local_score": 18,
            "last_star_ts": 1670427732,
            "completion_day_level": {
                "1": {
                    "2": {
                        "star_index": 90973,
                        "get_star_ts": 1669911672
                    },
                    "1": {
                        "star_index": 89302,
                        "get_star_ts": 1669911189
                    }
                }
            },
            "global_score": 0,
            "stars": 4
        },
        "2380866": {
            "global_score": 0,
            "stars": 33,
            "id": 2380866,
            "name": "JackSpagnoli",
            "local_score": 422,
            "last_star_ts": 1671835603,
            "completion_day_level": {
                "3": {
                    "2": {
                        "get_star_ts": 1670065607,
                        "star_index": 608140
                    },
                    "1": {
                        "star_index": 602743,
                        "get_star_ts": 1670064301
                    }
                },
                "16": {
                    "1": {
                        "get_star_ts": 1671190701,
                        "star_index": 3135956
                    }
                }
            }
        },
        "owner_id": 1599442,
        "event": "2022"
    }
}
```

### Response

```rust
struct Response {
	event: String,
	owner_id: Number,
	members: Dict<Member> // Indexed by member id
}

struct Member {
	global_score: Number,
	stars: Number,
	id: Number,
	name: String,
	local_score: Number,
	last_star_ts: Number,
	completion_day_level: Dict<Day> // Indexed by day
}

type Day = Dict<Completion> // 1 and/or 2

struct Completion {
	star_index = Number,
	get_star_ts = Number
}
```
