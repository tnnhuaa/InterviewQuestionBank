import AuthNavbar from "@/shared/components/AuthNavbar";
import MentorProfileForm from "../components/MentorProfileForm";
export default function MentorOnboarding() { return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[760px] px-6 py-8"><h1 className="text-[22px] font-semibold text-ink">Đăng ký trở thành Mentor</h1><p className="mb-6 mt-1 text-sm text-ink-secondary">Bạn có thể hoàn thiện hồ sơ trước khi được duyệt; hồ sơ và slot chỉ công khai sau approval.</p><MentorProfileForm /></main></div>; }
