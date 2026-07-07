import { Router } from "express";
import Groq from "groq-sdk";
import { GenerateContentBody } from "@workspace/api-zod";

const router = Router();

function getClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured");
  return new Groq({ apiKey });
}

function buildPrompt(taskType: string, fields: Record<string, string>): string {
  switch (taskType) {
    case "social_media":
      return `You are a professional social media copywriter. Write an engaging ${fields.platform || "social media"} post for the following:
Product/Topic: ${fields.productName || ""}
Target Audience: ${fields.targetAudience || ""}
Tone: ${fields.tone || "professional"}

Write a compelling post with relevant hashtags. Be concise and impactful.`;

    case "email":
      return `You are a professional business email writer. Write a polished email for the following:
Recipient: ${fields.recipient || ""}
Purpose: ${fields.purpose || ""}
Tone: ${fields.tone || "professional"}

Include a subject line (prefixed with "Subject:"), greeting, body, and professional sign-off.`;

    case "summarize":
      return `You are an expert summarizer. Provide a clear, concise summary of the following text, capturing the key points and main ideas:

${fields.text || ""}

Keep the summary well-structured and easy to read.`;

    case "product_description":
      return `You are a professional product copywriter. Write a compelling product description for:
Product Name: ${fields.productName || ""}
Key Features: ${fields.features || ""}
Target Customers: ${fields.targetCustomers || ""}

Make it persuasive, benefit-focused, and ready for an e-commerce listing.`;

    case "customer_query":
      return `You are a professional, empathetic customer support agent. Answer the following customer question clearly and helpfully:

Question: ${fields.question || ""}

Be friendly, thorough, and solution-oriented.`;

    default:
      return `Please help with the following task: ${JSON.stringify(fields)}`;
  }
}

router.post("/generate", async (req, res) => {
  const parsed = GenerateContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { taskType, fields } = parsed.data;
  const f = fields as Record<string, string>;
  const prompt = f.modifier && f.previousOutput
    ? `You are an expert text editor. Below is a piece of content:\n\n---\n${f.previousOutput}\n---\n\nYour task: ${f.modifier}\n\nReturn ONLY the modified text. Do not add any explanation, commentary, or preamble — just the revised content.`
    : buildPrompt(taskType, f);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  try {
    const groq = getClient();
    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.end();
  }
});

export default router;
