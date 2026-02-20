output "cluster_name" {
  value = aws_ecs_cluster.this.name
}

output "api_task_definition_arn" {
  value = aws_ecs_task_definition.api.arn
}
