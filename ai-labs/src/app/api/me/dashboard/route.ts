import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(_: NextRequest) {
  try {
    const user = getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const [analyses, subs] = await Promise.all([
      prisma.analysis.findMany({ where: { userId: user.userId }, orderBy: { createdAt: "desc" }, take: 10, include: { measurements: true } }),
      prisma.subscription.findMany({ where: { userId: user.userId }, include: { plan: true } }),
    ]);

    return NextResponse.json({ ok: true, analyses, subscriptions: subs });
  } catch (e) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}