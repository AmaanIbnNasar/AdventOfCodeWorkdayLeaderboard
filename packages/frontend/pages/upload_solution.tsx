import BasePage from "@/presentation/wrappers/BasePage";
import { GetServerSideProps, NextPage } from "next";
import { Button, Form, Label, Select, Textarea } from "nhsuk-react-components";
import { useState } from "react";

interface UploadSolutionProps {
  users: string[];
}

const UploadSolution: NextPage<UploadSolutionProps> = ({ users }) => {
  const LANGUAGES = [
    "bash",
    "c",
    "csharp",
    "fortran",
    "go",
    "haskell",
    "java",
    "javascript",
    "kotlin",
    "lisp",
    "lua",
    "matlab",
    "objectivec",
    "perl",
    "php",
    "powershell",
    "python",
    "r",
    "ruby",
    "rust",
    "scala",
    "swift",
    "typescript",
  ];
  const [day, setDay] = useState("");
  const [task, setTask] = useState("");
  const [username, setUsername] = useState("");
  const [language, setLanguage] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");

  const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDay(event.target.value);
  };

  const handleTaskChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTask(event.target.value);
  };

  const handleUsernameChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUsername(event.target.value);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  const handleCodeSnippetChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCodeSnippet(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
    console.log("SUBMITTED", day, task, username, language, codeSnippet);
  };

  return (
    <BasePage>
      <Label isPageHeading>Upload Solution</Label>
      <Form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "20px" }}>
          <Select label="Day" value={day} onChange={handleDayChange}>
            {Array.from({ length: 25 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </Select>
          <Select label="Task" value={task} onChange={handleTaskChange}>
            {Array.from({ length: 2 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </Select>
        </div>
        <Select
          label="Username"
          value={username}
          onChange={handleUsernameChange}
        >
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </Select>
        <Select
          label="Language"
          value={language}
          onChange={handleLanguageChange}
        >
          {LANGUAGES.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </Select>
        <Textarea
          label="Code Snippet"
          hint="Please copy and paste your code here"
          rows={5}
          value={codeSnippet}
          onChange={handleCodeSnippetChange}
        />
        <Button type="submit">Submit</Button>
      </Form>
    </BasePage>
  );
};

export const getServerSideProps: GetServerSideProps<
  UploadSolutionProps
> = async () => {
  const response = await fetch(
    "https://b74pns5xevq4ccyjxnxqscozne0qkvfp.lambda-url.eu-west-2.on.aws/",
    {
      method: "GET",
      headers: new Headers([["x-test", "true"]]),
    }
  );
  const fakeUsers = ["user1", "user2", "user3"];
  return {
    props: {
      users: fakeUsers,
    },
  };
};

export default UploadSolution;
