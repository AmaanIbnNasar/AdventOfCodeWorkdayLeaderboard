import Leaderboard, {
  LeaderboardProps,
} from "@/presentation/components/Leaderboard";
import {
  INCOMPLETE_STAR_COLOUR,
  LATE_STAR_COLOUR,
  ON_TIME_STAR_COLOUR,
  User,
} from "@/presentation/components/UserRow";
import BasePage from "@/presentation/wrappers/BasePage";
import { GetServerSideProps, NextPage } from "next";
import { Label } from "nhsuk-react-components";

export const API_URL =
  "https://vv4v4xxz79.execute-api.eu-west-2.amazonaws.com/default/";

const Home: NextPage<LeaderboardProps> = ({ users }) => {
  return (
    <BasePage>
      <Label isPageHeading>Leaderboard</Label>
      <div>
        <p style={{ marginBottom: "5px" }}>Points are calculated as follows:</p>
        <p
          style={{
            marginBottom: "5px",
            color: ON_TIME_STAR_COLOUR,
          }}
        >
          Task Completed On Time → 2
        </p>
        <p style={{ marginBottom: "5px", color: LATE_STAR_COLOUR }}>
          Task Completed Late → 1
        </p>
        <p style={{ marginBottom: "0", color: INCOMPLETE_STAR_COLOUR }}>
          Task Incomplete → 0
        </p>
        <p>
          Weekend tasks will be counted as completed on time to encourage taking
          time off from coding.
        </p>
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
        ["x-year", "2023"],
      ]),
    }
  );
  const lambdaResponse: { members: User[] } = await response.json();
  console.log(lambdaResponse);
  return {
    props: {
      users: lambdaResponse.members,
    },
  };
};

export default Home;
