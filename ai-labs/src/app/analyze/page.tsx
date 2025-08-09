"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const router = useRouter();
  const [type, setType] = useState<string>("blood");
  const [title, setTitle] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [vitals, setVitals] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function uploadSelected(filesToUpload: File[]) {
    if (filesToUpload.length === 0) return [] as any[];
    const form = new FormData();
    for (const f of filesToUpload) form.append("file", f);
    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Ошибка загрузки файлов");
    return data.files as any[];
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const uploaded = await uploadSelected(files);
      const imageUrls = uploaded.filter((f) => f.type.startsWith("image/")).map((f) => f.url);
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, text, vitals, title, images: imageUrls, uploaded }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      router.push(`/result/${data.analysis.id}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function handleVitalChange(key: string, value: string) {
    setVitals((prev) => ({ ...prev, [key]: value }));
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files ? Array.from(e.target.files) : [];
    setFiles(list);
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Новый анализ</h1>
      <form onSubmit={onSubmit} className="grid gap-4">
        <Card>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">Тип анализа</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-black rounded px-3 py-2 mt-1 bg-white">
                <option value="blood">Кровь</option>
                <option value="urine">Моча</option>
                <option value="image">Снимок</option>
                <option value="other">Другое</option>
              </select>
            </div>
            <div>
              <label className="text-sm">Название (опционально)</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-black rounded px-3 py-2 mt-1 bg-white" placeholder="Например: Общий анализ крови" />
            </div>
          </div>
        </Card>

        <Card>
          <label className="text-sm">Текст/результаты</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full border border-black rounded px-3 py-2 mt-1 bg-white min-h-32" placeholder="Вставьте результаты анализов или описание"></textarea>
        </Card>

        <Card>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm">Рост (см)</label>
              <input onChange={(e) => handleVitalChange("height_cm", e.target.value)} className="w-full border border-black rounded px-3 py-2 mt-1 bg-white" />
            </div>
            <div>
              <label className="text-sm">Вес (кг)</label>
              <input onChange={(e) => handleVitalChange("weight_kg", e.target.value)} className="w-full border border-black rounded px-3 py-2 mt-1 bg-white" />
            </div>
            <div>
              <label className="text-sm">Возраст</label>
              <input onChange={(e) => handleVitalChange("age", e.target.value)} className="w-full border border-black rounded px-3 py-2 mt-1 bg-white" />
            </div>
          </div>
        </Card>

        <Card>
          <label className="text-sm">Файлы (фото, PDF)</label>
          <input type="file" multiple onChange={onFileChange} className="mt-2" />
          {files.length > 0 && (
            <div className="text-xs text-black/70 mt-2">Выбрано файлов: {files.length}</div>
          )}
        </Card>

        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>{loading ? "Обработка..." : "Получить результат"}</Button>
          <Button type="button" variant="white" onClick={() => router.push("/")}>Отмена</Button>
        </div>
      </form>
    </div>
  );
}