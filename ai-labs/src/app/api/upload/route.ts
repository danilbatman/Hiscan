import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { headers } from "next/headers";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const files = form.getAll("file");
    if (!files || files.length === 0) return NextResponse.json({ error: "Нет файлов" }, { status: 400 });

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const saved: { filename: string; url: string; size: number; type: string }[] = [];

    for (const f of files) {
      if (typeof f === "string") continue;
      const file = f as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
      const filePath = path.join(uploadDir, safeName);
      await fs.writeFile(filePath, buffer);
      const host = headers().get("host");
      const protocol = process.env.VERCEL ? "https" : "http";
      const url = `${protocol}://${host}/uploads/${safeName}`;
      saved.push({ filename: safeName, url, size: buffer.length, type: file.type });
    }

    return NextResponse.json({ ok: true, files: saved });
  } catch (e) {
    return NextResponse.json({ error: "Ошибка загрузки" }, { status: 500 });
  }
}