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

resource "aws_iam_role" "iam_for_backend_lambda" {
  name               = "iam_for_backend_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_role" "iam_for_cache_lambda" {
  name               = "iam_for_cache_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_lambda_function" "backend_lambda" {
  filename      = "../package_backend.zip"
  function_name = "advent_of_code_leaderboard_backend_lambda"
  role          = aws_iam_role.iam_for_backend_lambda.arn
  handler       = "bootstrap.main"

  source_code_hash = filebase64sha256("../package_backend.zip")

  architectures = ["arm64"]
  runtime       = "provided.al2"

  environment {
    variables = {
      AOC_BUCKET      = var.AOC_BUCKET
    }
  }
}

resource "aws_lambda_function" "cache_lambda" {
  filename      = "../package_cache.zip"
  function_name = "advent_of_code_leaderboard_cache_lambda"
  role          = aws_iam_role.iam_for_cache_lambda.arn
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

resource "aws_lambda_function_url" "cache_invoke_url" {
  function_name      = aws_lambda_function.cache_lambda.function_name
  authorization_type = "NONE"
}

resource "aws_iam_policy" "s3_put_object_policy" {
  name        = "s3_put_object_policy"
  description = "Allows cache lambda to put objects to S3 bucket"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject"
      ],
      "Resource": [
        "arn:aws:s3:::jackspagnoli-aoc-cache/*"
      ]
    },
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "s3_put_access_attachment" {
  role       = aws_iam_role.iam_for_cache_lambda.name
  policy_arn = aws_iam_policy.s3_put_object_policy.arn
}

resource "aws_iam_policy" "s3_get_object_policy" {
  name        = "s3_get_object_policy"
  description = "Allows backend lambda to get objects from S3 bucket"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::jackspagnoli-aoc-cache/*"
      ]
    },
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "s3_get_access_attachment" {
  role       = aws_iam_role.iam_for_backend_lambda.name
  policy_arn = aws_iam_policy.s3_get_object_policy.arn
}
