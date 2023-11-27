resource "aws_iam_role" "eventbridge_role" {
  name = "aoc-leaderboard-cache-eventbridge_role"

  assume_role_policy = <<EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "events.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
  }
  EOF
}

resource "aws_iam_policy" "eventbridge_policy" {
  name = "aoc-leaderboard-cache-eventbridge-policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "${aws_lambda_function.cache_lambda.arn}",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "eventbridge_step_function_policy" {
  role       = aws_iam_role.eventbridge_role.name
  policy_arn = aws_iam_policy.eventbridge_policy.arn
}

resource "aws_cloudwatch_event_rule" "trigger_cache_schedule" {
  name                = "aoc-leaderboard-trigger-cache-schedule"
  description         = "Run the caching lambda on a schedule"
  role_arn            = aws_iam_role.eventbridge_role.arn
  schedule_expression = "cron(0/15 * * * ? *)"
}

resource "aws_cloudwatch_event_target" "trigger_cache_schedule_target" {
  rule      = aws_cloudwatch_event_rule.trigger_cache_schedule.name
  
  arn       = aws_lambda_function.cache_lambda.arn
}
