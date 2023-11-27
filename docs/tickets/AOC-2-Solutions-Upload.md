# AOC-2-Solutions-Upload

## Description

We want users to be able to upload their solutions to the leaderboard. We will implement this by using DynamoDB to store the solutions. A new lambda will need to be created to do this and the frontend will need to be modified to call this lambda.

## Tasks

- [x] Create a new lambda to handle the solution upload
- [x] Create a new DynamoDB table to store the solutions
  - [x] The table should have a partition key of `day` and a sort key of `username`
  - [x] The table should have attributes for the solution language and the solution code
- [x] Modify the frontend to call the new lambda
  - [x] The frontend should call the lambda when the user clicks the submit button
  - [x] The frontend should pass the day, language, and code to the lambda
- [x] Modify the frontend to display the solutions on the leaderboard
  - [x] The frontend should display the solutions for each day on a `day` page
