import Leaderboard, {
  LeaderboardProps,
} from "@/presentation/components/Leaderboard";
import Star from "@/presentation/components/Star";
import {
  INCOMPLETE_STAR_COLOUR,
  LATE_STAR_COLOUR,
  ON_TIME_STAR_COLOUR,
  User,
} from "@/presentation/components/UserRow";
import BasePage from "@/presentation/wrappers/BasePage";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { GetServerSideProps, NextPage } from "next";
import { Tooltip } from "react-tooltip";

export const API_URL =
  "https://vv4v4xxz79.execute-api.eu-west-2.amazonaws.com/default/";

const Home: NextPage<LeaderboardProps> = ({ users }) => {
  return (
    <BasePage>
      <div className="container mx-auto py-5">
        <h1 className="text-4xl font-bold">Leaderboard</h1>
        <div className="py-5 space-y-2">
          <a className="text-blue-700 text-xl" href="https://adventofcode.com/">
            Advent of Code Tasks
          </a>
          <p className="text-xl italic">
            This board only updates every 15 minutes due to api rate limiting
          </p>
          <p className="text-xl">Points are calculated as follows:</p>
          <div className="flex items-center space-x-2">
            <Star starIcon={faStar} colour={ON_TIME_STAR_COLOUR} />
            <p
              className="font-bold text-lg"
              style={{
                color: ON_TIME_STAR_COLOUR,
              }}
            >
              Task Completed On Time → 2
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Star starIcon={faStar} colour={LATE_STAR_COLOUR} />
            <p
              className="font-bold text-lg"
              style={{ color: LATE_STAR_COLOUR }}
            >
              Task Completed Late → 1
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Star starIcon={faStar} colour={INCOMPLETE_STAR_COLOUR} />
            <p
              className="font-bold text-lg"
              style={{ color: INCOMPLETE_STAR_COLOUR }}
            >
              Task Incomplete → 0
            </p>
          </div>
          <p className="text-lg">
            Weekend tasks will be counted as completed on time to encourage
            taking time off from coding.
          </p>
        </div>
      </div>
      <Leaderboard users={users} />
    </BasePage>
  );
};

export const getServerSideProps: GetServerSideProps<
  LeaderboardProps
> = async () => {
  // Call your API here to fetch the array of users
  const response = await fetch(
    "https://k6jzlmqsxn2bn4jh6ltkiw65ny0fqxmh.lambda-url.eu-west-2.on.aws/",
    {
      method: "GET",
      headers: new Headers([
        // ["x-test", "true"],
        ["x-leaderboard", "1599442"],
        ["x-year", "2024"],
      ]),
    }
  );
  const lambdaResponse: { members: User[] } = await response.json();
  console.log(lambdaResponse.members[0].day_statuses);
  return {
    props: {
      users: lambdaResponse.members,
    },
  };
};

export default Home;
