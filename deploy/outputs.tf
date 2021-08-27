output "alb" {
  description = "ALB endpoint"
  value       = aws_lb.sd_aws_intg_lb.dns_name
}