# Remote state – update bucket name before first init
# terraform {
#   backend "s3" {
#     bucket         = "your-tfstate-bucket"
#     key            = "compliance-platform/terraform.tfstate"
#     region         = "us-east-1"
#     encrypt        = true
#     dynamodb_table = "terraform-state-lock"
#   }
# }
