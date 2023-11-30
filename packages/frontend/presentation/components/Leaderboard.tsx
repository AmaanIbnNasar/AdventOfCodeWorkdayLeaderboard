import React from "react";
import UserRow, { User } from "./UserRow";

export interface LeaderboardProps {
  users: User[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th>Username</th>
          <th>Points</th>
          {Array.from({ length: 25 }, (_, index) => (
            <th key={index + 1}>
              <a href={`https://adventofcode.com/2023/day/${index + 1}`}>{`${
                index + 1
              }`}</a>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {users
          .sort((a, b) => {
            if (a.points == b.points) {
              return a.name.localeCompare(b.name);
            }
            return b.points - a.points;
          })
          .map((user) => (
            <UserRow key={user.name} user={user} />
          ))}
      </tbody>
    </table>
  );
};

export default Leaderboard;
