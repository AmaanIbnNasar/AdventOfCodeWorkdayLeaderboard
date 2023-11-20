import BasePage from "@/presentation/wrappers/BasePage";
import { faStar, faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import { Label, Table } from "nhsuk-react-components";

const Home: NextPage = () => {
  return (
    <BasePage>
      <Label isPageHeading>Leaderboard</Label>
      <Table responsive>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Username</Table.Cell>
            <Table.Cell> </Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>JackSpagnoli-NHS</Table.Cell>
            <Table.Cell>
              <FontAwesomeIcon
                icon={faStar}
                style={{
                  color: "green",
                }}
                beat
              />
              <FontAwesomeIcon
                icon={faStarHalf}
                style={{
                  color: "grey",
                }}
              />
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>SomeoneElse-NHS</Table.Cell>
            <Table.Cell>
              <FontAwesomeIcon
                icon={faStar}
                style={{
                  color: "grey",
                }}
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </BasePage>
  );
};

export default Home;
