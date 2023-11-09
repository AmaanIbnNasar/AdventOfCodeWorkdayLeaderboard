output "lambda_invoke_url" {
    value=aws_lambda_function_url.backend_invoke_url.function_url
}