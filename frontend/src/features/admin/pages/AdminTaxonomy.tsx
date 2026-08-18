import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminApi, type TaxonomyAdmin, type TaxonomyAdminItem } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

function TaxonomyItemRow({ kind, item }: { kind: "topic" | "position"; item: TaxonomyAdminItem }) {
  const queryClient = useQueryClient();
  const [name, setName] = useState(item.name);
  const [priority, setPriority] = useState(item.priority);
  const [reason, setReason] = useState("Update taxonomy item");
  const update = useMutation({
    mutationFn: (status: TaxonomyAdminItem["status"]) => {
      const input = { name, priority, status, version: item.version, reason };
      return kind === "topic" ? adminApi.updateTopic(item.id, input) : adminApi.updatePosition(item.id, input);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-taxonomy"] }),
  });

  return <div className="grid gap-2 rounded-lg border border-edge p-3 sm:grid-cols-[1fr_90px_1fr_auto_auto]">
    <input aria-label={`Tên ${kind}`} value={name} onChange={(event) => setName(event.target.value)} className="rounded-md border border-edge px-3 py-2 text-sm" />
    <input aria-label="Priority" type="number" min={0} value={priority} onChange={(event) => setPriority(Number(event.target.value))} className="rounded-md border border-edge px-3 py-2 text-sm" />
    <input aria-label="Lý do thay đổi" value={reason} onChange={(event) => setReason(event.target.value)} className="rounded-md border border-edge px-3 py-2 text-xs" />
    <button disabled={update.isPending || name.trim().length < 2 || reason.trim().length < 3} onClick={() => update.mutate(item.status)} className="rounded-md border border-edge px-3 py-2 text-xs font-medium text-ink-secondary">Lưu</button>
    <button disabled={update.isPending || reason.trim().length < 3} onClick={() => update.mutate(item.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE")} className="rounded-md border border-edge px-3 py-2 text-xs font-medium text-ink-secondary">{item.status === "ACTIVE" ? "Archive" : "Activate"}</button>
    {update.error ? <div className="sm:col-span-5"><ErrorPanel error={update.error} /></div> : null}
  </div>;
}

function VersionRow({ version }: { version: TaxonomyAdmin["versions"][number] }) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("Update taxonomy version lifecycle");
  const [description, setDescription] = useState(version.description ?? "");
  const update = useMutation({
    mutationFn: (status: "DRAFT" | "ACTIVE" | "ARCHIVED") => adminApi.updateTaxonomyVersion(version.id, { status, description: description || null, version: version.version, reason }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-taxonomy"] }),
  });
  return <div className="rounded-lg border border-edge p-3">
    <div className="flex items-center justify-between gap-3"><span className="text-sm font-medium text-ink">{version.name}</span><span className="text-xs font-medium text-primary">{version.status} · v{version.version}</span></div>
    <textarea aria-label="Mô tả taxonomy version" value={description} onChange={(event) => setDescription(event.target.value)} rows={2} className="mt-3 w-full rounded-md border border-edge p-2 text-xs" />
    <div className="mt-2 flex flex-wrap gap-2"><input aria-label="Lý do thay đổi version" value={reason} onChange={(event) => setReason(event.target.value)} className="min-w-56 flex-1 rounded-md border border-edge px-3 py-2 text-xs" /><button disabled={update.isPending || reason.trim().length < 3} onClick={() => update.mutate(version.status)} className="rounded-md border border-edge px-3 py-2 text-xs">Lưu mô tả</button>{version.status !== "ACTIVE" ? <button disabled={update.isPending || reason.trim().length < 3} onClick={() => update.mutate("ACTIVE")} className="rounded-md bg-primary px-3 py-2 text-xs text-on-primary">Activate</button> : <button disabled={update.isPending || reason.trim().length < 3} onClick={() => update.mutate("ARCHIVED")} className="rounded-md border border-edge px-3 py-2 text-xs">Archive</button>}</div>
    {update.error ? <div className="mt-3"><ErrorPanel error={update.error} /></div> : null}
  </div>;
}

function AliasRow({ item }: { item: TaxonomyAdmin["aliases"][number] }) {
  const queryClient = useQueryClient();
  const remove = useMutation({ mutationFn: () => adminApi.deleteTopicAlias(item.id, "Remove obsolete topic alias"), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-taxonomy"] }) });
  return <span className="inline-flex items-center gap-2 rounded-full border border-edge px-3 py-1.5 text-xs text-ink-secondary">{item.alias} → {item.topicName}<button aria-label={`Xóa alias ${item.alias}`} disabled={remove.isPending} onClick={() => remove.mutate()} className="font-semibold text-danger">×</button>{remove.error ? <span className="text-danger">Không xóa được</span> : null}</span>;
}

export default function AdminTaxonomy() {
  const queryClient = useQueryClient();
  const taxonomy = useQuery({ queryKey: ["admin-taxonomy"], queryFn: adminApi.taxonomy });
  const [kind, setKind] = useState<"topic" | "position">("topic");
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [versionName, setVersionName] = useState("");
  const [alias, setAlias] = useState("");
  const [aliasTopicId, setAliasTopicId] = useState("");
  const createItem = useMutation({
    mutationFn: () => kind === "topic" ? adminApi.createTopic({ slug, name, priority: 100 }) : adminApi.createPosition({ slug, name, priority: 100 }),
    onSuccess: () => { setSlug(""); setName(""); queryClient.invalidateQueries({ queryKey: ["admin-taxonomy"] }); },
  });
  const createVersion = useMutation({
    mutationFn: () => adminApi.createTaxonomyVersion({ name: versionName, status: "DRAFT", description: "Created from Admin taxonomy UI" }),
    onSuccess: () => { setVersionName(""); queryClient.invalidateQueries({ queryKey: ["admin-taxonomy"] }); },
  });
  const createAlias = useMutation({
    mutationFn: () => adminApi.createTopicAlias({ taxonomyVersionId: taxonomy.data!.versions.find((item) => item.status === "ACTIVE")!.id, topicId: aliasTopicId, alias }),
    onSuccess: () => { setAlias(""); queryClient.invalidateQueries({ queryKey: ["admin-taxonomy"] }); },
  });

  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[1100px] px-6 py-8">
    <h1 className="text-[22px] font-semibold text-ink">Taxonomy governance</h1><p className="mt-1 text-sm text-ink-secondary">Position, topic, aliases và version được quản lý riêng; import không tự tạo taxonomy.</p>
    {taxonomy.error ? <div className="mt-5"><ErrorPanel error={taxonomy.error} /></div> : null}
    {taxonomy.data ? <div className="mt-6 grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border border-edge bg-panel p-5"><h2 className="text-sm font-semibold text-ink">Versions</h2><div className="mt-3 space-y-2">{taxonomy.data.versions.map((version) => <VersionRow key={`${version.id}:${version.version}`} version={version} />)}</div><div className="mt-4 flex gap-2"><input value={versionName} onChange={(event) => setVersionName(event.target.value)} placeholder="frontend-v2" className="min-w-0 flex-1 rounded-md border border-edge px-3 py-2 text-sm" /><button disabled={versionName.trim().length < 1 || createVersion.isPending} onClick={() => createVersion.mutate()} className="rounded-md bg-primary px-4 py-2 text-xs text-on-primary">Tạo DRAFT</button></div>{createVersion.error ? <div className="mt-3"><ErrorPanel error={createVersion.error} /></div> : null}</section>
      <section className="rounded-xl border border-edge bg-panel p-5"><h2 className="text-sm font-semibold text-ink">Tạo taxonomy item</h2><div className="mt-3 grid gap-2 sm:grid-cols-[120px_1fr_1fr_auto]"><select value={kind} onChange={(event) => setKind(event.target.value as "topic" | "position")} className="rounded-md border border-edge px-3 py-2 text-sm"><option value="topic">Topic</option><option value="position">Position</option></select><input value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="slug" className="rounded-md border border-edge px-3 py-2 text-sm" /><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Tên" className="rounded-md border border-edge px-3 py-2 text-sm" /><button disabled={!/^[a-z0-9-]+$/.test(slug) || name.trim().length < 2 || createItem.isPending} onClick={() => createItem.mutate()} className="rounded-md bg-primary px-4 py-2 text-xs text-on-primary">Tạo</button></div>{createItem.error ? <div className="mt-3"><ErrorPanel error={createItem.error} /></div> : null}</section>
      <section className="rounded-xl border border-edge bg-panel p-5"><h2 className="text-sm font-semibold text-ink">Topics</h2><div className="mt-3 space-y-2">{taxonomy.data.topics.map((item) => <TaxonomyItemRow key={`${item.id}:${item.version}`} kind="topic" item={item} />)}</div></section>
      <section className="rounded-xl border border-edge bg-panel p-5"><h2 className="text-sm font-semibold text-ink">Positions</h2><div className="mt-3 space-y-2">{taxonomy.data.positions.map((item) => <TaxonomyItemRow key={`${item.id}:${item.version}`} kind="position" item={item} />)}</div></section>
      <section className="rounded-xl border border-edge bg-panel p-5 lg:col-span-2"><h2 className="text-sm font-semibold text-ink">Topic aliases</h2><div className="mt-3 flex flex-wrap gap-2">{taxonomy.data.aliases.map((item) => <AliasRow key={item.id} item={item} />)}</div><div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]"><select value={aliasTopicId} onChange={(event) => setAliasTopicId(event.target.value)} className="rounded-md border border-edge px-3 py-2 text-sm"><option value="">Chọn topic</option>{taxonomy.data.topics.filter((item) => item.status === "ACTIVE").map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><input value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="Alias mới" className="rounded-md border border-edge px-3 py-2 text-sm" /><button disabled={!aliasTopicId || !alias.trim() || createAlias.isPending || !taxonomy.data.versions.some((item) => item.status === "ACTIVE")} onClick={() => createAlias.mutate()} className="rounded-md bg-primary px-4 py-2 text-xs text-on-primary">Thêm alias</button></div>{createAlias.error ? <div className="mt-3"><ErrorPanel error={createAlias.error} /></div> : null}</section>
    </div> : <p className="mt-6 text-sm text-ink-muted">Đang tải taxonomy…</p>}
  </main></div>;
}
