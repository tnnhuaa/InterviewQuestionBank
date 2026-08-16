import { useQuery } from "@tanstack/react-query";
import { mentorsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import MentorProfileForm from "../components/MentorProfileForm";
export default function MentorProfileEdit() { const profile = useQuery({ queryKey: ["mentor-profile"], queryFn: mentorsApi.ownProfile, retry: false }); return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[760px] px-6 py-8"><h1 className="text-[22px] font-semibold text-ink">Hồ sơ Mentor</h1><div className="mt-6">{profile.isLoading ? <p className="text-sm text-ink-muted">Đang tải hồ sơ…</p> : profile.error ? <ErrorPanel error={profile.error} /> : profile.data && <MentorProfileForm key={profile.data.version} initial={profile.data} />}</div></main></div>; }
