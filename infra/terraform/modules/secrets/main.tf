resource "aws_secretsmanager_secret" "api" {
  name        = "${var.app_name}/${var.environment}/api"
  description = "API service secrets (JWT, DB, etc.)"

  recovery_window_in_days = var.environment == "prod" ? 30 : 0

  tags = {
    Name = "${var.app_name}-${var.environment}-api-secret"
  }
}

resource "aws_secretsmanager_secret_version" "api_placeholder" {
  secret_id = aws_secretsmanager_secret.api.id
  secret_string = jsonencode({
    JWT_SECRET    = "REPLACE_WITH_REAL_VALUE"
    DATABASE_URL  = "REPLACE_WITH_REAL_VALUE"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}
