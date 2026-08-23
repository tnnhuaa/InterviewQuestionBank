terraform {
  required_version = ">= 1.5.0"

  required_providers {
    render = {
      # Provider chính chủ của Render trên Terraform Registry
      source = "registry.terraform.io/render-oss/render"
    }
  }
}

provider "render" {
  # Không hardcode secret. Truyền qua TF_VAR_* hoặc terraform.tfvars (đã gitignore).
  api_key  = var.render_api_key
  owner_id = var.render_owner_id
}
