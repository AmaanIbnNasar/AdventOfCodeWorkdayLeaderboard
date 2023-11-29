import { User } from "@/presentation/components/UserRow";
import BasePage from "@/presentation/wrappers/BasePage";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { API_URL } from ".";

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
  const [submittingMessage, setSubmittingMessage] = useState("");
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
    fetch(`${API_URL}/upload`, {
      method: "POST",
      body: JSON.stringify({
        day,
        task,
        username,
        language,
        codeSnippet,
      }),
    });
  };
  const router = useRouter();
  return (
    <BasePage>
      <h1 className="text-2xl font-bold py-10">Upload Solution</h1>
      <div className="container max-w-fit mx-auto p-4 bg-white shadow-md rounded-md text-2xl">
        <form
          onSubmit={(event) => {
            setSubmittingMessage("Submitting...");
            handleSubmit(event);
            router.push("/solutions");
          }}
          className="space-y-5"
        >
          <div className="flex gap-10 items-center">
            <label htmlFor="day" className="italic">
              Day
            </label>
            <select
              className="border border-gray-300 rounded p-2"
              value={day}
              onChange={handleDayChange}
              id="day"
            >
              {Array.from({ length: 25 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <label htmlFor="task" className="italic">
              Task
            </label>
            <select
              className="border border-gray-300 rounded p-2"
              value={task}
              onChange={handleTaskChange}
              id="task"
            >
              {Array.from({ length: 2 }, (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-10 items-center">
            <label htmlFor="username" className="italic">
              Username
            </label>
            <select
              className="border border-gray-300 rounded p-2"
              value={username}
              onChange={handleUsernameChange}
              id="username"
            >
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
            <label htmlFor="language" className="italic">
              Language
            </label>
            <select
              className="border border-gray-300 rounded p-2"
              value={language}
              onChange={handleLanguageChange}
              id="language"
            >
              {LANGUAGES.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Please copy and paste your code here"
            rows={5}
            value={codeSnippet}
            onChange={handleCodeSnippetChange}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
      {submittingMessage !== "" && (
        <div className="bg-gray-100 p-2">
          <p>{submittingMessage}</p>
        </div>
      )}
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
