import React from "react";
import UserRow, { User } from "./UserRow";

export interface LeaderboardProps {
  users: User[];
}

export const WEEKENDS = [2, 3, 9, 10, 16, 17, 23, 24, 30, 31];

const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  return (
    <table className="table-auto w-full">
      <thead style={{ position: "sticky", top: 64, background: "white" }}>
        <tr>
          <th className="text-left">Username</th>
          <th>Points</th>
          {Array.from({ length: 25 }, (_, index) => (
            <th key={index + 1}>
              <div
                style={{
                  background: WEEKENDS.includes(index + 1)
                    ? "rgba(22, 101, 52, 0.3)"
                    : "white",
                }}
              >
                <p>
                  {["Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu"][index % 7]}
                </p>
                <a
                  className="text-center"
                  href={`https://adventofcode.com/2023/day/${index + 1}`}
                >{`${index + 1}`}</a>
              </div>
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
