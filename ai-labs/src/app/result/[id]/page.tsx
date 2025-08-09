import { notFound } from "next/navigation";
import { headers } from "next/headers";

async function getAnalysis(id: string) {
  const hdrs = headers();
  const host = hdrs.get("host");
  const protocol = process.env.VERCEL ? "https" : "http";
  const base = `${protocol}://${host}`;
  const res = await fetch(`${base}/api/analysis/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.analysis as any;
}

export default async function ResultPage({ params }: { params: { id: string } }) {
  const analysis = await getAnalysis(params.id);
  if (!analysis) return notFound();

  const findings = (analysis.aiFindings ?? {}) as any;
  const measurements = Array.isArray(findings.measurements) ? findings.measurements : analysis.measurements ?? [];
  const advice = Array.isArray(findings.advice) ? findings.advice : [];

  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Результат</h1>
      <section className="border border-black rounded p-6 bg-white text-black">
        <h2 className="font-medium">Краткое резюме</h2>
        <p className="text-sm text-black/80 mt-2 whitespace-pre-line">{analysis.aiSummary}</p>
      </section>

      <section className="border border-black rounded p-6 bg-white text-black">
        <h2 className="font-medium">Показатели</h2>
        <div className="mt-3 grid md:grid-cols-2 gap-3">
          {measurements.length === 0 && <div className="text-sm text-black/60">Нет распознанных показателей</div>}
          {measurements.map((m: any, idx: number) => (
            <div key={idx} className="border border-black rounded p-3">
              <div className="text-sm font-medium">{m.name}</div>
              <div className="text-sm">Значение: {m.value} {m.unit ?? ""}</div>
              {(m.referenceLow || m.referenceHigh) && (
                <div className="text-xs text-black/60">Норма: {m.referenceLow ?? "?"}–{m.referenceHigh ?? "?"}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {advice.length > 0 && (
        <section className="border border-black rounded p-6 bg-white text-black">
          <h2 className="font-medium">Рекомендации</h2>
          <ul className="list-disc pl-5 mt-2 text-sm">
            {advice.map((a: string, i: number) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
}