import { User } from "@/presentation/components/UserRow";
import BasePage from "@/presentation/wrappers/BasePage";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/navigation";
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
  const [day, setDay] = useState("1");
  const [task, setTask] = useState("1");
  const [username, setUsername] = useState(users[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
    console.log(event);
    console.log("SUBMITTED", day, task, username, language, codeSnippet);
  };
  const router = useRouter();
  return (
    <BasePage>
      <Label isPageHeading>Upload Solution</Label>
      <Form
        onSubmit={(event) => {
          handleSubmit(event);
          router.push("/solutions");
        }}
      >
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
  console.log("LAMBDA RESPONSE", lambdaResponse.members);
  return {
    props: {
      users: lambdaResponse.members.map((user) => user.name),
    },
  };
};

export default UploadSolution;
