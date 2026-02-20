module "rds" {
  source      = "./modules/rds"
  app_name    = var.app_name
  environment = var.environment
  db_username = var.db_username
  db_password = var.db_password
}

module "s3" {
  source      = "./modules/s3"
  app_name    = var.app_name
  environment = var.environment
}

module "secrets" {
  source      = "./modules/secrets"
  app_name    = var.app_name
  environment = var.environment
}

module "ecs" {
  source         = "./modules/ecs"
  app_name       = var.app_name
  environment    = var.environment
  api_secret_arn = module.secrets.api_secret_arn
}
