import { headers } from "next/headers";

async function loadPlans() {
  const hdrs = headers();
  const host = hdrs.get("host");
  const protocol = process.env.VERCEL ? "https" : "http";
  const base = `${protocol}://${host}`;
  let res = await fetch(`${base}/api/plans`, { cache: "no-store" });
  if (!res.ok) return [];
  let data = await res.json();
  if (Array.isArray(data.plans) && data.plans.length > 0) return data.plans as any[];
  // seed if empty
  await fetch(`${base}/api/plans`, { method: "POST" });
  res = await fetch(`${base}/api/plans`, { cache: "no-store" });
  if (!res.ok) return [];
  data = await res.json();
  return data.plans as any[];
}

export default async function PricingPage() {
  const plans = await loadPlans();
  return (
    <div className="grid gap-6">
      <h1 className="text-xl font-semibold">Тарифы</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="border border-black rounded p-6 bg-white text-black">
            <div className="font-medium">{p.name}</div>
            <div className="text-2xl mt-2">{p.priceCents === 0 ? "Бесплатно" : `${(p.priceCents/100).toFixed(0)} ₽/мес`}</div>
            <button className="mt-4 px-4 py-2 rounded bg-black text-white border border-black hover:bg-white hover:text-black">Выбрать</button>
          </div>
        ))}
      </div>
    </div>
  );
}