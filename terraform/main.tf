terraform {
  required_version = "1.6.3"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.38"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "eu-west-2"

  default_tags {
    tags = {
      project = "advent-of-code-leaderboard"
    }
  }
}