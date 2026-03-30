import pdfParse from "pdf-parse";

export async function parseUploadedFiles(files: File[]) {
  if (!files.length) return "";

  const chunks: string[] = [];

  for (const file of files) {
    const lower = file.name.toLowerCase();

    if (lower.endsWith(".txt") || lower.endsWith(".md")) {
      const text = await file.text();
      chunks.push(`FILE: ${file.name}\n${truncate(text, 12000)}`);
      continue;
    }

    if (lower.endsWith(".pdf")) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const parsed = await pdfParse(buffer);
      chunks.push(`FILE: ${file.name}\n${truncate(parsed.text, 12000)}`);
      continue;
    }

    if (
      lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".webp")
    ) {
      chunks.push(
        `FILE: ${file.name}\nImage uploaded. The tutor should acknowledge the image and explain based on the student's question, but this version does not extract image text automatically.`
      );
      continue;
    }

    chunks.push(`FILE: ${file.name}\nUnsupported file type.`);
  }

  return chunks.join("\n\n---\n\n");
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max) + "\n...[truncated]";
}
