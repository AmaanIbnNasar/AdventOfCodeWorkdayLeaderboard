import UserRow, { User } from "@/presentation/components/UserRow";
import BasePage from "@/presentation/wrappers/BasePage";
import { GetServerSideProps, NextPage } from "next";
import { Label, Table } from "nhsuk-react-components";

interface HomeProps {
  users: User[];
}

const Home: NextPage<HomeProps> = ({ users }) => {
  return (
    <BasePage>
      <Label isPageHeading>Leaderboard</Label>
      <Table style={{ width: 500 }} responsive>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Username</Table.Cell>
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
    </BasePage>
  );
};

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  // Call your API here to fetch the array of users
  const response = await fetch(
    "https://b74pns5xevq4ccyjxnxqscozne0qkvfp.lambda-url.eu-west-2.on.aws/",
    {
      method: "GET",
      headers: new Headers([["x-test", "true"]]),
    }
  );
  const lambdaResponse: { members: User[] } = await response.json();
  console.log(lambdaResponse.members);
  return {
    props: {
      users: lambdaResponse.members,
    },
  };
};

export default Home;
