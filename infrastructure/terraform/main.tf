# Terraform Infrastructure Module Scaffolding
# Milestone M0: Engineering Foundation

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

# Object storage bucket for private capsule media originals and derivatives
# Bucket security: private by default, server-side encryption enabled
