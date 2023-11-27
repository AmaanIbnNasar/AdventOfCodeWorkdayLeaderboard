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

resource "aws_lambda_permission" "allow_eventbridge" {
    statement_id = "AllowExecutionFromEventBridge"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.cache_lambda.function_name
    principal = "events.amazonaws.com"
    source_arn = aws_cloudwatch_event_rule.trigger_cache_schedule.arn
}

resource "aws_cloudwatch_event_rule" "trigger_cache_schedule" {
  name                = "aoc-leaderboard-trigger-cache-schedule"
  description         = "Run the caching lambda on a schedule"
  role_arn            = aws_iam_role.eventbridge_role.arn
  schedule_expression = "rate(15 minutes)"
}

resource "aws_cloudwatch_event_target" "trigger_cache_schedule_target" {
  rule      = aws_cloudwatch_event_rule.trigger_cache_schedule.name
  
  arn       = aws_lambda_function.cache_lambda.arn
}
