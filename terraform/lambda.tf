resource "aws_iam_role" "lambda_role" {
  name               = "advent_of_code_leaderboard_backend_lambda_role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "lambda_iam_policy" {
  name   = "advent_of_code_leaderboard_backend_lambda_iam_policy"
  path   = "/"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    },
    {
      "Action": [
        "s3:GetObject",
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::*"
      ],
      "Effect": "Allow"
    },
    {
      "Action": [
        "dynamodb:BatchGetItem",
                "dynamodb:GetItem",
                "dynamodb:Query",
                "dynamodb:Scan",
                "dynamodb:BatchWriteItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/solutions",
        "arn:aws:dynamodb:*:*:table/*"
      ],
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_iam_policy" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_iam_policy.arn
}


resource "aws_lambda_function" "backend_lambda" {
  filename      = "../package_backend.zip"
  function_name = "advent_of_code_leaderboard_backend_lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "bootstrap.main"

  source_code_hash = filebase64sha256("../package_cache.zip")

  architectures = ["arm64"]
  runtime       = "provided.al2"

  environment {
    variables = {
      AOC_COOKIE      = var.AOC_COOKIE
      AOC_LEADERBOARD = var.AOC_LEADERBOARD
      AOC_YEAR        = var.AOC_YEAR
      AOC_BUCKET      = var.AOC_BUCKET
    }
  }
}

resource "aws_lambda_function_url" "backend_invoke_url" {
  function_name      = aws_lambda_function.backend_lambda.function_name
  authorization_type = "NONE"
}

resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/advent_of_code_leaderboard_backend_lambda"
  retention_in_days = 14
}

resource "aws_lambda_function" "cache_lambda" {
  filename      = "../package_cache.zip"
  function_name = "advent_of_code_leaderboard_cache_lambda"
  role          = aws_iam_role.lambda_role.arn
  handler       = "bootstrap.main"

  source_code_hash = filebase64sha256("../package_cache.zip")

  architectures = ["arm64"]
  runtime       = "provided.al2"

  environment {
    variables = {
      AOC_COOKIE      = var.AOC_COOKIE
      AOC_LEADERBOARD = var.AOC_LEADERBOARD
      AOC_YEAR        = var.AOC_YEAR
      AOC_BUCKET      = var.AOC_BUCKET
    }
  }
}

resource "aws_lambda_function_url" "cache_invoke_url" {
  function_name      = aws_lambda_function.cache_lambda.function_name
  authorization_type = "NONE"
}

resource "aws_lambda_function" "solutions_uploader" {
  filename         = "../build/solutions_uploader.zip"
  function_name    = "advent_of_code_leaderboard_solutions_uploader"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.main"
  source_code_hash = filebase64sha256("../build/solutions_uploader.zip")

  runtime = "nodejs16.x"
}

resource "aws_cloudwatch_log_group" "solutions_uploader_lambda_log_group" {
  name              = "/aws/lambda/advent_of_code_leaderboard_solutions_uploader"
  retention_in_days = 14
}


resource "aws_lambda_function_url" "solutions_uploader_url" {
  function_name      = aws_lambda_function.solutions_uploader.function_name
  authorization_type = "NONE"
}
resource "aws_lambda_function" "solutions_retriever" {
  filename         = "../build/solutions_retriever.zip"
  function_name    = "advent_of_code_leaderboard_solutions_retriever"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.main"
  source_code_hash = filebase64sha256("../build/solutions_retriever.zip")

  runtime = "nodejs16.x"
}
resource "aws_cloudwatch_log_group" "solutions_retriever_lambda_log_group" {
  name              = "/aws/lambda/advent_of_code_leaderboard_solutions_retriever"
  retention_in_days = 14
}

resource "aws_lambda_function_url" "solutions_retriever" {
  function_name      = aws_lambda_function.solutions_retriever.function_name
  authorization_type = "NONE"
}
