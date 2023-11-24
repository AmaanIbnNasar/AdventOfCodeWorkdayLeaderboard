# AOC-2-Solutions-Upload

## Description

We want users to be able to upload their solutions to the leaderboard. We will implement this by using DynamoDB to store the solutions. A new lambda will need to be created to do this and the frontend will need to be modified to call this lambda.

## Tasks

- [ ] Create a new lambda to handle the solution upload
- [ ] Create a new DynamoDB table to store the solutions
  - [ ] The table should have a partition key of `day` and a sort key of `username`
  - [ ] The table should have attributes for the solution language and the solution code
- [ ] Modify the frontend to call the new lambda
  - [ ] The frontend should call the lambda when the user clicks the submit button
  - [ ] The frontend should pass the day, language, and code to the lambda
- [ ] Modify the frontend to display the solutions on the leaderboard
  - [ ] The frontend should display the solutions for each day on a `day` page
