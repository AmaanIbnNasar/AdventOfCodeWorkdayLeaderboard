import BasePage from "@/presentation/wrappers/BasePage";
import { NextPage } from "next";
import { Label } from "nhsuk-react-components";
import React from "react";
import Modal from "react-modal";
import SyntaxHighlighter from "react-syntax-highlighter";

const codeSnippet = `const a = 1;
const b = 2
const c = a + b;
console.log(c)`;

const Solutions: NextPage = () => {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const solutions = [
    {
      author: "Amaan",
      code: codeSnippet,
      language: "javascript",
      task: "1",
    },
  ];
  return (
    <BasePage>
      <div id="modalRoot">
        <Label isPageHeading>Solutions</Label>
        <button onClick={() => setIsOpen(true)}>Open Modal</button>
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
          <SyntaxHighlighter language="javascript" showLineNumbers={true}>
            {solutions[0].code}
          </SyntaxHighlighter>
        </Modal>
      </div>
    </BasePage>
  );
};

export default Solutions;
