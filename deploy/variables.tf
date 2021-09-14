variable public_subnets {
    type = list(string)
    description = "List of public subnets"
    sensitive   = true
}

variable security_group_id {
    type = string
    description = "Security group for alb"
    sensitive   = true
}

variable "resource_prefix" {
   type = string
    description = "Name prefix for resource"
}

variable "executor" {
   type = string
}