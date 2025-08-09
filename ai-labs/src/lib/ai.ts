import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY || "";
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export type AnalysisInput = {
  type: "blood" | "urine" | "image" | "other";
  text?: string;
  vitals?: Record<string, string | number>;
  images?: string[];
};

export type AiResult = {
  summary: string;
  findings: Record<string, unknown>;
};

export async function analyzeWithAi(input: AnalysisInput): Promise<AiResult> {
  const prompt = `Ты — врач-ассистент. По предоставленным данным пациента и результатам анализов дай краткое резюме и список ключевых показателей с нормами и отклонениями. Ответ верни в двух частях: \n1) Короткое резюме 2-4 предложения.\n2) JSON с полями: measurements (массив объектов {name, value, unit, referenceLow, referenceHigh, status}), advice (массив строк).\n\nТип: ${input.type}\nТекст: ${input.text ?? "-"}\nДоп.данные: ${JSON.stringify(input.vitals ?? {})}`;

  if (!openai) {
    return {
      summary: "AI недоступен. Возвращаем примерный шаблон резюме на основе введённых данных.",
      findings: {
        measurements: [],
        advice: ["Проверьте корректность введённых данных", "Обратитесь к врачу при ухудшении самочувствия"],
      },
    };
  }

  // Build multimodal message if images are provided
  const userContent: any = input.images && input.images.length > 0
    ? [
        { type: "input_text", text: prompt },
        ...input.images.map((url) => ({ type: "input_image", image_url: url })),
      ]
    : prompt;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Ты помогаешь с медицинской интерпретацией. Не давай диагнозы, а давай подсказки и ориентиры." },
      { role: "user", content: userContent },
    ],
    temperature: 0.2,
  });

  const content = completion.choices[0]?.message?.content || "";
  const [summary, jsonPart] = (() => {
    const parts = content.split(/\n\s*2\)/);
    const first = parts[0]?.replace(/^1\)\s*/, "").trim() || content.trim();
    const second = parts[1]?.trim() || "{}";
    return [first, second];
  })();

  let findings: Record<string, unknown> = {};
  try {
    findings = JSON.parse(jsonPart);
  } catch {
    findings = { raw: content };
  }

  return { summary, findings };
}