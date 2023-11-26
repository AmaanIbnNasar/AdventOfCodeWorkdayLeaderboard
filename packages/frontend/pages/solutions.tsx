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
  const [modalIsOpen, setIsOpen] = React.useState(false);
  return (
    <div
      key={solution.task}
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
          key={solution.author}
          language={solution.language}
          showLineNumbers={true}
        >
          {solution.code}
        </SyntaxHighlighter>
      </Modal>
    </div>
  );
};

const SolutionDetails: React.FC<{ day: any; solutions: any }> = ({
  day,
  solutions,
}) => {
  return (
    <Details key={day}>
      <Details.Summary>Day {day}</Details.Summary>
      <Details.Text>
        {solutions.map((solution: any) => {
          console.log(solution);
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

const Solutions: NextPage = () => {
  const solutionsByDay = {
    1: [
      {
        author: "Amaan",
        code: `const a = 1;
const b = 2
const c = a + b;
console.log(c)`,
        language: "javascript",
        task: "1",
      },
      {
        author: "Jack",
        code: `#[derive(Debug, Serialize, Clone, Copy)]
        struct DayStatus {
  task_1: TaskStatus,
  task_2: TaskStatus,
}`,
        language: "rust",
        task: "1",
      },
    ],
    2: [
      {
        author: "Amaan",
        code: `const a = 1;
const b = 2
const c = a + b;
console.log(c)`,
        language: "javascript",
        task: "1",
      },
      {
        author: "Jack",
        code: `#[derive(Debug, Serialize, Clone, Copy)]
        struct DayStatus {
  task_1: TaskStatus,
  task_2: TaskStatus,
}`,
        language: "rust",
        task: "1",
      },
    ],
  };
  return (
    <BasePage>
      <div id="modalRoot">
        <Label isPageHeading>Solutions</Label>
        {Object.entries(solutionsByDay).map(([day, solutions]) => {
          return <SolutionDetails day={day} solutions={solutions} key={day} />;
        })}
      </div>
    </BasePage>
  );
};

export default Solutions;
