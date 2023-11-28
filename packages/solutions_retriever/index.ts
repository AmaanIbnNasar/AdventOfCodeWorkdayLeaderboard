import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const getDataFromDynamoDB = async () => {
  const client = new DynamoDBClient({ region: "eu-west-2" });
  try {
    const scan = new ScanCommand({
      TableName: "solutions",
      AttributesToGet: ["taskusername", "codeSnippet", "language", "aoc_day"],
    });
    const scanResponse = await client.send(scan);
    console.log("scan", scanResponse);
    return scanResponse;
  } catch (error) {
    console.error("Error retrieving data from DynamoDB table:", error);
  }
};

const buildResponse = (data: any) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
    body: JSON.stringify({ data }),
  };
};
const convertItemsForResponse = (items: any) => {
  const response: { [day: string]: any[] } = {};
  console.log(items);
  items.forEach((item: any) => {
    const day = item.aoc_day.S;
    const task = item.taskusername.S.split("#")[0];
    const author = item.taskusername.S.split("#")[1];
    const codeSnippet = item.codeSnippet.S;
    const language = item.language.S;

    if (!response[day]) {
      response[day] = [];
    }

    response[day].push({ day, task, author, codeSnippet, language });
  });

  return response;
};

export const main = async (event: any, _context: any) => {
  const data = await getDataFromDynamoDB();
  return buildResponse(convertItemsForResponse(data?.Items));
};
