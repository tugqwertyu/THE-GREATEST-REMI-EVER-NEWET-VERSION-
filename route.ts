import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildPrompt } from "@/lib/buildPrompt";
import { parseUploadedFiles } from "@/lib/fileParser";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.CEREBRAS_API_KEY,
  baseURL: "https://api.cerebras.ai/v1",
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const topic = String(formData.get("topic") || "");
    const level = String(formData.get("level") || "High School");
    const subject = String(formData.get("subject") || "General");
    const mode = String(formData.get("mode") || "Understand a topic");

    const files = formData
      .getAll("files")
      .filter((item): item is File => item instanceof File);

    if (!topic.trim() && files.length === 0) {
      return NextResponse.json(
        { error: "Please enter a topic or upload a file." },
        { status: 400 }
      );
    }

    const fileContext = await parseUploadedFiles(files);
    const systemPrompt = buildPrompt({ level, subject, mode, fileContext });

    const userPrompt = topic.trim()
      ? topic
      : "Please help me understand the uploaded file(s).";

    const completion = await client.chat.completions.create({
      model: "llama3.1-8b",
      temperature: 0.3,
      max_tokens: 900,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content || "";

    const parsed = splitResponse(raw);

    return NextResponse.json({
      explanation: parsed.explanation,
      diagram: parsed.diagram,
      practice: parsed.practice,
      raw,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate a tutor response." },
      { status: 500 }
    );
  }
}

function splitResponse(raw: string) {
  const explanation = extractSection(raw, "EXPLANATION");
  const diagram = extractSection(raw, "DIAGRAM");
  const practice = extractSection(raw, "PRACTICE");

  return {
    explanation: explanation || raw,
    diagram: diagram || "No diagram was returned.",
    practice: practice || "No practice question was returned.",
  };
}

function extractSection(text: string, sectionName: string) {
  const regex = new RegExp(
    `${sectionName}:([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`,
    "i"
  );
  const match = text.match(regex);
  return match?.[1]?.trim() || "";
}
