import BasePage from "@/presentation/wrappers/BasePage";
import { NextPage } from "next";
import { Button, Details, Label } from "nhsuk-react-components";
import React from "react";
import Modal from "react-modal";
import SyntaxHighlighter from "react-syntax-highlighter";

const SolutionModal: React.FC<{ day: any; solution: any }> = ({
  day,
  solution,
}) => {
  console.log(solution);
  const key = `${solution.author}${solution.task}`;
  const [modalIsOpen, setIsOpen] = React.useState(false);
  return (
    <div
      key={key}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h2>{solution.author}</h2>
      <Button onClick={() => setIsOpen(true)}>Open Solution</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsOpen(false)}
        parentSelector={() => document.querySelector("#modalRoot")!}
        style={{
          content: {
            height: "80%",
            width: "80%",
            margin: "auto",
          },
        }}
      >
        <button onClick={() => setIsOpen(false)}>Close</button>
        <p>{solution.author}</p>
        <SyntaxHighlighter
          key={key}
          language={solution.language}
          showLineNumbers={true}
        >
          {solution.codeSnippet}
        </SyntaxHighlighter>
      </Modal>
    </div>
  );
};

const SolutionDetails: React.FC<{ day: any; solutions: any }> = ({
  day,
  solutions,
}) => {
  console.log(solutions);
  return (
    <Details key={day}>
      <Details.Summary>Day {day}</Details.Summary>
      <Details.Text>
        <Details key={`${day}1`}>
          <Details.Summary>Task 1</Details.Summary>
          <Details.Text>
            {solutions
              .filter((solution: any) => solution.task == "1")
              .map((solution: any) => {
                return (
                  <SolutionModal
                    day={day}
                    solution={solution}
                    key={solution.author}
                  />
                );
              })}
          </Details.Text>
        </Details>
        <Details key={`${day}2`}>
          <Details.Summary>Task 2</Details.Summary>
          <Details.Text>
            {solutions
              .filter((solution: any) => solution.task == "2")
              .map((solution: any) => {
                return (
                  <SolutionModal
                    day={day}
                    solution={solution}
                    key={solution.author}
                  />
                );
              })}
          </Details.Text>
        </Details>
      </Details.Text>
    </Details>
  );
};

type Solution = {
  author: string;
  code: string;
  language: string;
  task: string;
};

type SolutionsByDay = {
  [day: number]: Solution[];
};
const Solutions: NextPage<SolutionsByDay> = (props) => {
  return (
    <BasePage>
      <div id="modalRoot">
        <Label isPageHeading>Solutions</Label>
        {Object.entries(props).map(([day, solutions]) => {
          return <SolutionDetails day={day} solutions={solutions} key={day} />;
        })}
      </div>
    </BasePage>
  );
};

export const getServerSideProps = async () => {
  const response = await fetch(
    "https://vv4v4xxz79.execute-api.eu-west-2.amazonaws.com/default/solutions?day=1"
  );
  console.log(response);
  const data = await response.json();
  console.log(data);
  return {
    props: data.data,
  };
};

export default Solutions;
