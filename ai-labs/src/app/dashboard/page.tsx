"use client";
import useSWR from "swr";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { data, error } = useSWR("/api/me/dashboard", fetcher);

  if (error) return <div className="text-sm text-red-600">Ошибка загрузки</div>;
  if (!data) return <div className="text-sm">Загрузка...</div>;
  if (data.error) return <div className="text-sm">{data.error}. Войдите или зарегистрируйтесь.</div>;

  const analyses = data.analyses as any[];

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Личный кабинет</h1>
      <section className="border border-black rounded p-6 bg-white text-black">
        <h2 className="font-medium">Последние анализы</h2>
        <div className="mt-3 grid gap-2">
          {analyses.length === 0 && <div className="text-sm text-black/60">Пока пусто</div>}
          {analyses.map((a) => (
            <Link key={a.id} href={`/result/${a.id}`} className="text-sm underline">
              {a.title || a.type} · {new Date(a.createdAt).toLocaleString()}
            </Link>
          ))}
        </div>
      </section>

      <section className="border border-black rounded p-6 bg-white text-black">
        <h2 className="font-medium">Динамика показателей</h2>
        <div className="text-sm text-black/60 mt-2">Графики и сравнение по ключевым показателям — скоро</div>
      </section>
    </div>
  );
}