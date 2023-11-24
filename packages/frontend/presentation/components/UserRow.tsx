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

const COMPLETED_STATUSES = ["OnTime", "Late"];

const createStar = (task_1: TaskStatus, task_2: TaskStatus) => {
  if (task_1 == "OnTime" && task_2 == "OnTime") {
    return (
      <FontAwesomeIcon
        icon={faStar}
        style={{
          color: "orange",
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
          color: "green",
        }}
      />
    );
  }
  if (COMPLETED_STATUSES.includes(task_1) && task_2 == "Incomplete") {
    return (
      <FontAwesomeIcon
        icon={faStarHalfAlt}
        style={{
          color: "orange",
        }}
      />
    );
  }
  if (task_1 == "Incomplete" && COMPLETED_STATUSES.includes(task_2)) {
    return (
      <FontAwesomeIcon
        icon={faStarHalfAlt}
        style={{
          color: "orange",
        }}
        flip="horizontal"
      />
    );
  }
  if (task_1 == "Incomplete" && task_2 == "Incomplete") {
    return (
      <FontAwesomeIcon
        icon={faStar}
        style={{
          color: "grey",
        }}
      />
    );
  }
};

const UserRow: React.FC<UserRowProps> = ({ user }) => {
  return (
    <Table.Row>
      <Table.Cell>{user.name}</Table.Cell>
      {user.day_statuses.map((day_statuses) => (
        <Table.Cell key={user.name}>
          {createStar(day_statuses.task_1, day_statuses.task_2)}
        </Table.Cell>
      ))}
    </Table.Row>
  );
};

export default UserRow;
