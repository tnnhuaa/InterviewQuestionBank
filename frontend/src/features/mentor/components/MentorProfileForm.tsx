import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mentorsApi, questionsApi, type Mentor } from "@/shared/api/resources";
import ErrorPanel from "@/shared/components/ErrorPanel";

function toggleId(current: string[], id: string, checked: boolean) {
  return checked ? [...current, id] : current.filter((value) => value !== id);
}

export default function MentorProfileForm({ initial }: { initial?: Mentor }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const taxonomy = useQuery({ queryKey: ["taxonomy"], queryFn: questionsApi.taxonomy });
  const [headline, setHeadline] = useState(initial?.headline ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [timezone, setTimezone] = useState(initial?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [topicIds, setTopicIds] = useState<string[]>(initial?.topicIds ?? []);
  const [positionIds, setPositionIds] = useState<string[]>(initial?.positionIds ?? []);
  const mutation = useMutation({
    mutationFn: () => mentorsApi.saveProfile({ headline, bio, timezone, topicIds, positionIds }),
    onSuccess: (profile) => {
      queryClient.setQueryData(["mentor-profile"], profile);
      navigate("/mentor/verification");
    },
  });

  return (
    <form onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }} className="space-y-5 rounded-xl border border-edge bg-panel p-6">
      {mutation.error ? <ErrorPanel error={mutation.error} /> : null}
      <label className="block text-xs font-semibold text-ink-secondary">
        Headline
        <input required minLength={5} maxLength={180} value={headline} onChange={(event) => setHeadline(event.target.value)} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-4 py-2.5 text-sm" />
      </label>
      <label className="block text-xs font-semibold text-ink-secondary">
        Giới thiệu
        <textarea required minLength={20} maxLength={4000} rows={7} value={bio} onChange={(event) => setBio(event.target.value)} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas p-4 text-sm" />
      </label>
      <label className="block text-xs font-semibold text-ink-secondary">
        Múi giờ
        <input required value={timezone} onChange={(event) => setTimezone(event.target.value)} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-4 py-2.5 text-sm" />
      </label>
      <fieldset>
        <legend className="text-xs font-semibold text-ink-secondary">Chuyên môn kỹ thuật</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {taxonomy.data?.topics.map((topic) => (
            <label key={topic.id} className="flex items-center gap-2 rounded-md border border-edge p-3 text-sm text-ink-secondary">
              <input type="checkbox" checked={topicIds.includes(topic.id)} onChange={(event) => setTopicIds((current) => toggleId(current, topic.id, event.target.checked))} className="accent-primary" />
              {topic.name}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-xs font-semibold text-ink-secondary">Vị trí có thể phỏng vấn</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {taxonomy.data?.positions.map((position) => (
            <label key={position.id} className="flex items-center gap-2 rounded-md border border-edge p-3 text-sm text-ink-secondary">
              <input type="checkbox" checked={positionIds.includes(position.id)} onChange={(event) => setPositionIds((current) => toggleId(current, position.id, event.target.checked))} className="accent-primary" />
              {position.name}
            </label>
          ))}
        </div>
      </fieldset>
      <button disabled={mutation.isPending || topicIds.length === 0 || positionIds.length === 0} className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">
        Lưu hồ sơ
      </button>
    </form>
  );
}
