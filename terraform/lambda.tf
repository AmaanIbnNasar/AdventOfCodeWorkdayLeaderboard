data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_lambda_function" "backend_lambda" {
  filename      = "package.zip"
  function_name = "advent_of_code_leaderboard_backend_lambda"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "bootstrap.main"

  source_code_hash = filebase64sha256("package.zip")

  architectures = ["arm64"]
  runtime       = "provided.al2"

  environment {
    variables = {
      AOC_COOKIE      = data.external.env.result["AOC_COOKIE"]
      AOC_LEADERBOARD = data.external.env.result["AOC_LEADERBOARD"]
    }
  }
}
