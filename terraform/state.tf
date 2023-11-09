terraform {
  backend "s3" {
    region  = "eu-west-2"
    encrypt = true
  }
}