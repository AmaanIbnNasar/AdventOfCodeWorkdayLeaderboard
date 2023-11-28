resource "aws_apigatewayv2_api" "aoc_backend" {
  name          = "aoc_leaderboard_api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["*"]
    allow_headers = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token", "x-amz-user-agent"]
  }
}

resource "aws_apigatewayv2_integration" "upload_solutions_lambda_integration" {
  api_id           = aws_apigatewayv2_api.aoc_backend.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.solutions_uploader.invoke_arn
}
resource "aws_apigatewayv2_route" "solutions_uploader_route" {
  api_id    = aws_apigatewayv2_api.aoc_backend.id
  route_key = "POST /upload"
  target    = "integrations/${aws_apigatewayv2_integration.upload_solutions_lambda_integration.id}"
}
resource "aws_apigatewayv2_integration" "get_solutions_lambda_integration" {
  api_id           = aws_apigatewayv2_api.aoc_backend.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.solutions_retriever.invoke_arn
  response_parameters {
    status_code = 200
    mappings = {

    }
  }
}
resource "aws_apigatewayv2_route" "get_uploader_route" {
  api_id    = aws_apigatewayv2_api.aoc_backend.id
  route_key = "GET /solutions"
  target    = "integrations/${aws_apigatewayv2_integration.get_solutions_lambda_integration.id}"
}
resource "aws_apigatewayv2_integration" "get_leaderboard_lambda_integration" {
  api_id           = aws_apigatewayv2_api.aoc_backend.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.solutions_uploader.invoke_arn
}
resource "aws_apigatewayv2_route" "get_leaderboard_route" {
  api_id    = aws_apigatewayv2_api.aoc_backend.id
  route_key = "GET /"
  target    = "integrations/${aws_apigatewayv2_integration.get_leaderboard_lambda_integration.id}"
}


resource "aws_lambda_permission" "apigw_get_leaderboard_lambda_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.backend_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.aoc_backend.execution_arn}/*"
}
resource "aws_lambda_permission" "apigw_get_solutions_lambda_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.solutions_retriever.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.aoc_backend.execution_arn}/*"
}
resource "aws_lambda_permission" "apigw_lambda_permission" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.solutions_uploader.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.aoc_backend.execution_arn}/*"
}

resource "aws_apigatewayv2_stage" "get_method_api_stage" {
  api_id      = aws_apigatewayv2_api.aoc_backend.id
  name        = "default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_access_logs.arn
    format          = "$context.identity.sourceIp - - [$context.requestTime] \"$context.httpMethod $context.routeKey $context.protocol\" $context.status $context.responseLength $context.requestId \"$context.identity.userAgent\" \"$context.identity.caller\" \"$context.identity.user\" $context.integrationStatus"
  }
}

resource "aws_cloudwatch_log_group" "api_gateway_access_logs" {
  name              = "aoc_leaderboard_api_api_gateway_access_logs"
  retention_in_days = 30
}

