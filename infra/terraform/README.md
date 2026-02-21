# Infrastructure – Terraform

This directory contains the Terraform infrastructure-as-code for the Cloud-Powered Regulatory Compliance Platform deployed on AWS.

## Prerequisites

- Terraform >= 1.9
- AWS CLI configured (`aws configure`)
- S3 bucket for remote state (update `backend.tf`)

## Structure

infra/terraform/
├── modules/
│ ├── rds/ # RDS PostgreSQL
│ ├── s3/ # S3 buckets (evidence, reports)
│ ├── secrets/ # AWS Secrets Manager
│ └── ecs/ # ECS Fargate services
├── main.tf # Root module
├── variables.tf # Input variables
├── outputs.tf # Output values
├── providers.tf # Provider configuration
└── backend.tf # Remote state configuration

## Usage

cd infra/terraform
cp terraform.tfvars.example terraform.tfvars # fill in values
terraform init
terraform plan
terraform apply

## ⚠️ Phase 0 Note

This is a skeleton. Resources are defined but NOT deployed. Review and customize before applying to any environment.
