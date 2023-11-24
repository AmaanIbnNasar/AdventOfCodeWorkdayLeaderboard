import { Table } from "nhsuk-react-components";
import UserRow, { User } from "./UserRow";

export interface LeaderboardProps {
  users: User[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  return (
    <Table style={{ width: 500 }} responsive>
      <Table.Head>
        <Table.Row>
          <Table.Cell>Username</Table.Cell>
          <Table.Cell>Points</Table.Cell>
          {Array.from({ length: 25 }, (_, index) => (
            <Table.Cell key={index + 1}>{`${index + 1}`}</Table.Cell>
          ))}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {users
          .sort((a, b) => b.points - a.points)
          .map((user) => (
            <UserRow key={user.name} user={user} />
          ))}
      </Table.Body>
    </Table>
  );
};

export default Leaderboard;
