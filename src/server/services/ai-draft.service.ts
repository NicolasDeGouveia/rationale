import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { AIDraft } from "@/types";

const SYSTEM_PROMPT = `You are a decision-writing assistant for Rationale, a decision memory tool for teams.
Given raw notes about a decision, produce a structured JSON decision record.
Return ONLY valid JSON matching this exact shape (no markdown, no explanation):
{
  "title": "Short, specific decision title (max 80 chars)",
  "summary": "One-sentence summary of what was decided",
  "rationale": "2–4 sentence explanation of why this decision was made",
  "assumptions": ["Assumption 1", "Assumption 2"],
  "risks": ["Risk 1", "Risk 2"]
}`;

export async function generateDecisionDraft(notes: string): Promise<AIDraft> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here are the notes about a decision our team made:\n\n${notes}\n\nPlease structure this into a decision record.`,
      },
    ],
  });

  const text = response.content.find((b) => b.type === "text")?.text ?? "";

  let parsed: unknown;
  try {
    parsed = JSON.parse(text.trim());
  } catch {
    // Try to extract JSON from the response if wrapped in markdown
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      parsed = JSON.parse(match[1].trim());
    } else {
      throw new Error("AI returned malformed JSON");
    }
  }

  const draft = parsed as AIDraft;
  if (!draft.title || !draft.rationale) {
    throw new Error("AI response missing required fields");
  }

  return {
    title: String(draft.title).slice(0, 80),
    summary: String(draft.summary ?? ""),
    rationale: String(draft.rationale),
    assumptions: Array.isArray(draft.assumptions) ? draft.assumptions.map(String) : [],
    risks: Array.isArray(draft.risks) ? draft.risks.map(String) : [],
  };
}
