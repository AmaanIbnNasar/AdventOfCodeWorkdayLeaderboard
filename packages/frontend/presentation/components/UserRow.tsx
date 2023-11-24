import { faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "nhsuk-react-components";

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
  return (
    <Table.Row>
      <Table.Cell>{user.name}</Table.Cell>
      <Table.Cell>{user.points}</Table.Cell>
      {user.day_statuses.map((day_statuses) => (
        <Table.Cell key={user.name}>
          {createStar(day_statuses.task_1, day_statuses.task_2)}
        </Table.Cell>
      ))}
    </Table.Row>
  );
};

export default UserRow;
