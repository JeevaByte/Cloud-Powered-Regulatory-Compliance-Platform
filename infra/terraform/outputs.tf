output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = module.rds.endpoint
  sensitive   = true
}

output "evidence_bucket_name" {
  description = "S3 bucket name for evidence files"
  value       = module.s3.evidence_bucket_name
}

output "api_secret_arn" {
  description = "ARN of the API secrets in Secrets Manager"
  value       = module.secrets.api_secret_arn
  sensitive   = true
}
