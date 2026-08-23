output "api_service_url" {
  description = "Public URL của API web service (Render tự cấp *.onrender.com)."
  value       = render_web_service.api.url
}

output "api_service_id" {
  description = "ID của web service (dùng cho terraform import / debug)."
  value       = render_web_service.api.id
}

output "frontend_service_url" {
  description = "Public URL của frontend static site."
  value       = render_static_site.frontend.url
}

output "frontend_service_id" {
  description = "ID của static site."
  value       = render_static_site.frontend.id
}
