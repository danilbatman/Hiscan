import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeWithAi } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest();
    const { type, text, vitals, title, images, uploaded } = await req.json();

    const ai = await analyzeWithAi({ type: type ?? "other", text, vitals, images });

    const created = await prisma.analysis.create({
      data: {
        userId: user?.userId ?? null,
        type: type ?? "other",
        title: title ?? null,
        rawText: text ?? null,
        aiSummary: ai.summary,
        aiFindings: ai.findings as any,
      },
    });

    const measurements = Array.isArray((ai.findings as any)?.measurements)
      ? (ai.findings as any).measurements
      : [];

    if (measurements.length) {
      await prisma.measurement.createMany({
        data: measurements.map((m: any) => ({
          analysisId: created.id,
          name: String(m.name ?? ""),
          value: typeof m.value === "number" ? m.value : parseFloat(String(m.value ?? 0)),
          unit: m.unit ? String(m.unit) : null,
          referenceLow: typeof m.referenceLow === "number" ? m.referenceLow : null,
          referenceHigh: typeof m.referenceHigh === "number" ? m.referenceHigh : null,
        })),
      });
    }

    if (Array.isArray(uploaded) && uploaded.length > 0) {
      await prisma.uploadedFile.createMany({
        data: uploaded.map((f: any) => ({
          analysisId: created.id,
          filename: String(f.filename ?? "file"),
          mimeType: String(f.type ?? "application/octet-stream"),
          sizeBytes: Number(f.size ?? 0),
          path: String(f.url ?? ""),
        })),
      });
    }

    const result = await prisma.analysis.findUnique({
      where: { id: created.id },
      include: { measurements: true, files: true },
    });

    return NextResponse.json({ ok: true, analysis: result });
  } catch (e) {
    return NextResponse.json({ error: "Ошибка обработки анализа" }, { status: 500 });
  }
}