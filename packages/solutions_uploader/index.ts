import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

interface SolutionsUploadRequest {
  username: String;
  day: String;
  task: 1 | 2;
  codeSnippet: String;
  language: String;
}

export const main = async (event: any, _context: any) => {
  const body: SolutionsUploadRequest = JSON.parse(event.body);
  await uploadDataToDynamoDB(convertEventToDynamoDBPutRequest(body));
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Uploaded Successfully",
    }),
  };
};

const convertEventToDynamoDBPutRequest = (event: SolutionsUploadRequest) => {
  return {
    TableName: "solutions",
    Item: {
      taskusername: { S: `${event.task}#${event.username}` },
      aoc_day: { S: event.day },
      codeSnippet: { S: event.codeSnippet },
      language: { S: event.language },
    },
  };
};

const uploadDataToDynamoDB = async (putRequest: any) => {
  console.log(putRequest);
  const client = new DynamoDBClient({ region: "eu-west-2" });
  try {
    const command = new PutItemCommand(putRequest);
    console.log(command);
    await client.send(command);
    console.log("Data uploaded successfully to DynamoDB table: solutions");
  } catch (error) {
    console.error("Error uploading data to DynamoDB table:", error);
  }
};
