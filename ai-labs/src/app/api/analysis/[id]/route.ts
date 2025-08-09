import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const analysis = await prisma.analysis.findUnique({
      where: { id: params.id },
      include: { measurements: true },
    });
    if (!analysis) {
      return NextResponse.json({ error: "Не найдено" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, analysis });
  } catch (e) {
    return NextResponse.json({ error: "Ошибка" }, { status: 500 });
  }
}