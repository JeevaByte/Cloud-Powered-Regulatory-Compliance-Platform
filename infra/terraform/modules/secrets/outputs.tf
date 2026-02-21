output "api_secret_arn" {
  value     = aws_secretsmanager_secret.api.arn
  sensitive = true
}
