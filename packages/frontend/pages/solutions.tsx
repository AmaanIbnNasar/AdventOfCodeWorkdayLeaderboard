import BasePage from "@/presentation/wrappers/BasePage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NextPage } from "next";
import React from "react";
import Modal from "react-modal";
import SyntaxHighlighter from "react-syntax-highlighter";
import { LANGUAGE_ICONS_BY_NAME } from "./upload_solution";

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
      <h2 className="font-bold">{solution.author}</h2>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Open Solution
      </button>
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
        <div className="space-y-5">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
          <div className="flex space-x-20">
            <p className="font-bold">{solution.author}</p>
            <div className="flex space-x-5 items-center">
              <p className="font-bold italic">{solution.language}</p>
              <FontAwesomeIcon
                icon={LANGUAGE_ICONS_BY_NAME[solution.language]}
              />
            </div>
          </div>
          <SyntaxHighlighter
            key={key}
            language={solution.language}
            showLineNumbers={true}
          >
            {solution.codeSnippet}
          </SyntaxHighlighter>
        </div>
      </Modal>
    </div>
  );
};

const renderSolutionDetails = (day: string, task: string, solutions: any[]) => {
  return (
    <details key={`${day}${task}`} className="border p-4 mb-4 space-y-2">
      <summary className="font-bold">Task {task}</summary>
      <div className="space-y-2">
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
      </div>
    </details>
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
    <div key={day} className="border p-4 mb-4">
      <details>
        <summary className="font-bold">Day {day}</summary>
        {task1SolutionsExist || task2SolutionsExist ? (
          <div className="space-y-2">
            {task1SolutionsExist && renderSolutionDetails(day, "1", solutions)}
            {task2SolutionsExist && renderSolutionDetails(day, "2", solutions)}
          </div>
        ) : (
          <p>No solutions yet</p>
        )}
      </details>
    </div>
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
      <div id="modalRoot" className="py-10 space-y-5">
        <h1 className="text-4xl font-bold">Solutions</h1>
        {noSolutions && <p className="text-3xl italic">No solutions yet</p>}
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
