data "external" "env" {
  program = ["${path.module}/env.sh"]
}

output "env" {
  value = data.external.env.result
}
