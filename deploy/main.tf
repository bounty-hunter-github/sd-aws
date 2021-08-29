module "lambda_function" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "sd-aws-intg-fn"
  description   = "Screwdriver AWS Integration Demo"
  handler       = "index.handler"
  runtime       = "nodejs12.x"
  create_package = false
  local_existing_package = "../lambda/build.zip"
  source_path = "../lambda/"

  tags = {
    Name = "sd-aws-intg-fn"
  }
}

resource "aws_lambda_permission" "with_lb" {
  depends_on = [module.lambda_function]
  statement_id  = "AllowExecutionFromlb"
  action        = "lambda:InvokeFunction"
  function_name = "sd-aws-intg-fn"
  principal     = "elasticloadbalancing.amazonaws.com"
  source_arn    = aws_lb_target_group.sd_aws_intg_tg.arn
}

resource "aws_lb_target_group" "sd_aws_intg_tg" {
  depends_on = [module.lambda_function]
  name        = "sd-aws-intg-tg"
  target_type = "lambda"
}

resource "aws_lb_target_group_attachment" "sd_aws_intg_tgat" {
  target_group_arn = aws_lb_target_group.sd_aws_intg_tg.arn
  target_id        = module.lambda_function.lambda_function_arn
  depends_on       = [aws_lambda_permission.with_lb]
}

resource "aws_lb" "sd_aws_intg_lb" {
  depends_on = [module.lambda_function]
  name               = "sd-aws-intg-lb"
  internal           = false
  load_balancer_type = "application"
  subnets            = var.public_subnets
  security_groups    = ["${var.security_group_id}"]
  enable_deletion_protection = true

  tags = {
    Name = "sd-aws-intg-alb"
  }
}

resource "aws_lb_listener" "sd_aws_intg_lb_list" {
  load_balancer_arn = aws_lb.sd_aws_intg_lb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.sd_aws_intg_tg.arn
  }
}