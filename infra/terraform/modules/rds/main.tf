resource "aws_db_subnet_group" "this" {
  name       = "${var.app_name}-${var.environment}-db-subnet"
  subnet_ids = [] # TODO: pass VPC subnet IDs

  tags = {
    Name = "${var.app_name}-${var.environment}-db-subnet"
  }
}

resource "aws_db_instance" "postgres" {
  identifier        = "${var.app_name}-${var.environment}-postgres"
  engine            = "postgres"
  engine_version    = "16.3"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_encrypted = true

  db_name  = "compliance"
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.this.name
  vpc_security_group_ids = [] # TODO: add security group IDs
  publicly_accessible    = false

  backup_retention_period = 7
  deletion_protection     = var.environment == "prod" ? true : false
  skip_final_snapshot     = var.environment != "prod"

  tags = {
    Name = "${var.app_name}-${var.environment}-postgres"
  }
}
