
resource "aws_dynamodb_table" "solutions" {
  name         = "solutions"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "aoc_day"
  range_key    = "taskusername"

  attribute {
    name = "aoc_day"
    type = "S"
  }

  attribute {
    name = "taskusername"
    type = "S"
  }
}
