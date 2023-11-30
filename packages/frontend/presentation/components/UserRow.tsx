import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WEEKENDS } from "./Leaderboard";

type TaskStatus = "OnTime" | "Late" | "Incomplete";

type DayStatus = {
  task_1: TaskStatus;
  task_2: TaskStatus;
};

export type User = {
  name: string;
  stars: number;
  day_statuses: DayStatus[];
  points: number;
};

type UserRowProps = {
  user: User;
};

export const ON_TIME_STAR_COLOUR = "orange";
// const LATE_STAR_COLOUR = "#16a6ce";
export const LATE_STAR_COLOUR = "#8C8CBC";
export const INCOMPLETE_STAR_COLOUR = "grey";

const createStar = (task_1: TaskStatus, task_2: TaskStatus) => {
  if (task_1 == "OnTime" && task_2 == "OnTime") {
    return (
      <FontAwesomeIcon
        icon={faStar}
        style={{
          color: ON_TIME_STAR_COLOUR,
        }}
      />
    );
  }
  if (
    (task_1 == "Late" && task_2 == "Late") ||
    (task_1 == "OnTime" && task_2 == "Late") ||
    (task_1 == "Late" && task_2 == "OnTime")
  ) {
    return (
      <FontAwesomeIcon
        icon={faStar}
        style={{
          color: LATE_STAR_COLOUR,
        }}
      />
    );
  }
  if (task_1 == "OnTime" && task_2 == "Incomplete") {
    return (
      <FontAwesomeIcon
        icon={faStarHalfAlt}
        style={{
          color: ON_TIME_STAR_COLOUR,
        }}
      />
    );
  }
  if (task_1 == "Late" && task_2 == "Incomplete") {
    return (
      <FontAwesomeIcon
        icon={faStarHalfAlt}
        style={{
          color: LATE_STAR_COLOUR,
        }}
      />
    );
  }
  if (task_1 == "Incomplete" && task_2 == "Incomplete") {
    return (
      <FontAwesomeIcon
        icon={faStar}
        style={{
          color: INCOMPLETE_STAR_COLOUR,
        }}
      />
    );
  }
};

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  const truncatedName =
    user.name.length > 13 ? user.name.substring(0, 13) + "..." : user.name;
  return (
    <tr>
      <td>{truncatedName}</td>
      <td className="text-center">{user.points}</td>
      {user.day_statuses.map((day_statuses, i) => (
        <td key={user.name} className="text-center">
          <div
            style={{
              background: WEEKENDS.includes(i + 1)
                ? "rgba(22, 101, 52, 0.3)"
                : "white",
            }}
          >
            {createStar(day_statuses.task_1, day_statuses.task_2)}
          </div>
        </td>
      ))}
    </tr>
  );
};

export default UserRow;
