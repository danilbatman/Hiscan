import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const plans = await prisma.subscriptionPlan.findMany({ where: { active: true }, orderBy: { priceCents: "asc" } });
    return NextResponse.json({ ok: true, plans });
  } catch (e) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}

export async function POST(_: NextRequest) {
  try {
    const count = await prisma.subscriptionPlan.count();
    if (count > 0) return NextResponse.json({ ok: true });
    await prisma.subscriptionPlan.createMany({
      data: [
        { name: "Базовый", slug: "basic", priceCents: 0, features: { ai: "ограниченно" } as any },
        { name: "Стандарт", slug: "standard", priceCents: 49900, features: { ai: "стандарт" } as any },
        { name: "Премиум", slug: "premium", priceCents: 99900, features: { ai: "расширенно" } as any },
      ],
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}