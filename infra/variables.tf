# ----- Thông tin xác thực Render (SENSITIVE) -----
variable "render_api_key" {
  description = "Render API key. Không commit; truyền qua TF_VAR_render_api_key hoặc terraform.tfvars (đã gitignore)."
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Render owner/team ID (usr-xxx hoặc tea-xxx). Lấy từ API /v1/owners."
  type        = string
  sensitive   = true
}

# ----- Cấu hình chung -----
variable "repo_url" {
  description = "URL Git repository trên GitHub (Render build trực tiếp từ repo này)."
  type        = string
  default     = "https://github.com/tnnhuaa/InterviewQuestionBank"
}

variable "branch" {
  description = "Branch Render build/deploy."
  type        = string
  default     = "main"
}

variable "region" {
  description = "Render region. Xem https://render.com/docs/regions"
  type        = string
  default     = "oregon"
  validation {
    condition     = contains(["frankfurt", "ohio", "oregon", "singapore", "virginia"], var.region)
    error_message = "Region phải là một trong: frankfurt, ohio, oregon, singapore, virginia."
  }
}

# LƯU Ý: Render Terraform provider enum plan chỉ ghi nhận starter/standard/pro.../custom.
# Service thật đang chạy plan "free" — mặc định dùng "free" cho khớp. Nếu provider báo lỗi
# enumeration thì trả về lỗi, sẽ đổi cách (giữ services quản lý tay hoặc qua custom plan).
variable "api_plan" {
  description = "Plan của web service API. Service hiện có đang 'free'."
  type        = string
  default     = "free"
}

# ----- Environment variables (SENSITIVE) -----
variable "env_database_url" {
  description = "Supabase DATABASE_URL (connection string, thường có ?sslmode=require). Dùng DB chung của nhóm."
  type        = string
  sensitive   = true
}

variable "env_session_secret" {
  description = "SESSION_SECRET — chuỗi ngẫu nhiên >= 32 ký tự để ký session cookie."
  type        = string
  sensitive   = true
}

variable "env_frontend_origin" {
  description = "FRONTEND_ORIGIN — URL frontend gọi API (CORS)."
  type        = string
  default     = "https://interviewquestionbank-fe.onrender.com"
}

variable "env_gemini_api_key" {
  description = "GEMINI_API_KEY — để trống nếu không bật AI."
  type        = string
  sensitive   = true
  default     = ""
}

variable "env_ai_enabled" {
  description = "AI_ENABLED — 'true'/'false'. Nếu 'true' thì bắt buộc có GEMINI_API_KEY."
  type        = string
  default     = "false"
}

variable "env_node_env" {
  description = "NODE_ENV."
  type        = string
  default     = "production"
}

variable "env_database_ssl" {
  description = "DATABASE_SSL — Supabase yêu cầu SSL."
  type        = string
  default     = "true"
}

variable "env_session_cookie_secure" {
  description = "SESSION_COOKIE_SECURE — nên 'true' ở production."
  type        = string
  default     = "true"
}
