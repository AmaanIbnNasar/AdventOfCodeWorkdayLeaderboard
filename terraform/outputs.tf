output "lambda_invoke_url" {
  value = aws_lambda_function_url.backend_invoke_url.function_url
}

output "upload_lambda_invoke_url" {
  value = aws_lambda_function_url.solutions_uploader_url.function_url
}

output "cache_invoke_url" {
  value = aws_lambda_function_url.cache_invoke_url.function_url
}