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

const renderSolutionDetails = (day: string, task: string, solutions: any[]) => {
  return (
    <Details key={`${day}${task}`}>
      <Details.Summary>Task {task}</Details.Summary>
      <Details.Text>
        {solutions
          .filter((solution: any) => solution.task === task)
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
  );
};

const SolutionDetails: React.FC<{ day: any; solutions: any }> = ({
  day,
  solutions,
}) => {
  console.log(solutions);
  const task1SolutionsExist = solutions.some(
    (solution: any) => solution.task == "1"
  );
  const task2SolutionsExist = solutions.some(
    (solution: any) => solution.task == "2"
  );
  return (
    <Details key={day}>
      <Details.Summary>Day {day}</Details.Summary>
      {task1SolutionsExist || task2SolutionsExist ? (
        <Details.Text>
          {task1SolutionsExist && renderSolutionDetails(day, "1", solutions)}
          {task2SolutionsExist && renderSolutionDetails(day, "2", solutions)}
        </Details.Text>
      ) : (
        <Details.Text>No solutions yet</Details.Text>
      )}
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
  const noSolutions = Object.values(props).every(
    (solutions) => solutions.length === 0
  );
  return (
    <BasePage>
      <div id="modalRoot">
        <Label isPageHeading>Solutions</Label>
        {noSolutions && <p>No solutions yet</p>}
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
