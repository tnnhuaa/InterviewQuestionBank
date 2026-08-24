# ============================================================================
# PrepVI Infrastructure (IaaC với Terraform + Render)
# Mô tả hai dịch vụ Render đang chạy (git-native, plan free). Terraform plan
# phải được review vì provider có thể đề xuất thay đổi in-place; không tuyên bố
# cấu hình khớp 100% khi plan chưa ở trạng thái no-op:
#   1. render_web_service  — API backend (rootDir=backend, Node, free)
#   2. render_static_site  — Frontend SPA (build workspace frontend)
# Không có background worker (chưa deploy). Không dùng Docker Hub.
# Database vẫn là Supabase managed (không do Terraform quản lý).
# ============================================================================

# ---------------------------------------------------------------------------
# 1) WEB SERVICE — API backend (Express; build & chạy bằng Git từ repo)
# ---------------------------------------------------------------------------
resource "render_web_service" "api" {
  name          = "InterviewQuestionBank"
  plan          = var.api_plan
  region        = var.region

  # Giữ service trong cùng project environment như thực tế (evm-d3l8b6c9c44c739641s0)
  environment_id = "evm-d3l8b6c9c44c739641s0"

  # Render chạy mọi lệnh trong thư mục backend/ (monorepo)
  root_directory = "backend"

  # Path trả 200 OK để Render health-check và zero-downtime deploy.
  health_check_path = "/api/v1/health"

  runtime_source = {
    native_runtime = {
      auto_deploy   = true
      branch        = var.branch
      build_command = "npm ci; npm run build"
      repo_url      = var.repo_url
      runtime       = "node"
    }
  }

  # startCommand khi native runtime: Render dùng cấu hình này để khởi động.
  start_command = "npm start"

  env_vars = {
    NODE_ENV               = { value = var.env_node_env }
    DATABASE_URL           = { value = var.env_database_url }
    DATABASE_SSL           = { value = var.env_database_ssl }
    SESSION_SECRET         = { value = var.env_session_secret }
    SESSION_COOKIE_SECURE  = { value = var.env_session_cookie_secure }
    FRONTEND_ORIGIN        = { value = var.env_frontend_origin }
    AI_ENABLED             = { value = var.env_ai_enabled }
    GEMINI_API_KEY         = { value = var.env_gemini_api_key }
  }
}

# ---------------------------------------------------------------------------
# 2) STATIC SITE — Frontend SPA (Vite build ở workspace frontend)
# ---------------------------------------------------------------------------
resource "render_static_site" "frontend" {
  name           = "InterviewQuestionBank-fe"
  repo_url       = var.repo_url
  branch         = var.branch

  root_directory = ""
  build_command  = "npm ci; npm run build --workspace frontend"
  publish_path   = "frontend/dist"
  auto_deploy    = true

  # Giữ service trong đúng project environment như thực tế
  environment_id = "evm-d3l8b6c9c44c739641s0"

  # Custom domain đang chạy (KHÔNG được xóa khi apply)
  custom_domains = [
    { name = "prepvi.tinthanh.id.vn" },
  ]

  # Rewrite đang có trên static site:
  #  - "/api/*" -> backend (frontend gọi API cùng đường dẫn, like same-origin)
  #  - "/*"    -> /index.html (SPA fallback cho react-router)
  routes = [
    {
      source      = "/api/*"
      destination = "https://interviewquestionbank.onrender.com/api/*"
      type        = "rewrite"
    },
    {
      source      = "/*"
      destination = "/index.html"
      type        = "rewrite"
    },
  ]
}
