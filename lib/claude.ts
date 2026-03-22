type RequestParams = {
  name: string;
  peopleCount: string;
  duration: string;
  whoFor: string;
  whoForOther: string;
  amount: string;
  urgency: string;
  situation: string;
};

const PEOPLE_LABELS: Record<string, string> = {
  "just-me": "1 person",
  "2-3": "2–3 people",
  "4-5": "4–5 people",
  "6+": "6 or more people",
};

const DURATION_LABELS: Record<string, string> = {
  "1w": "1 week",
  "2w": "2 weeks",
  "3-4w": "3–4 weeks",
  "1m": "about a month",
};

const WHO_LABELS: Record<string, string> = {
  myself: "myself",
  children: "my children",
  family: "my whole family",
  elderly: "an elderly relative",
};

const URGENCY_LABELS: Record<string, string> = {
  critical: "critical — needed within 1–2 days",
  urgent: "urgent — needed this week",
  soon: "soon — within the month",
  flexible: "flexible",
};

export async function generateRequestDetails(params: RequestParams) {
  const whoLabel =
    params.whoFor === "other"
      ? params.whoForOther || "others"
      : WHO_LABELS[params.whoFor] ?? params.whoFor;

  const prompt = `You help people in need write dignified, compassionate food assistance requests for a donation platform.

Here is the information about this person's situation:
- Name: ${params.name}
- Feeding: ${PEOPLE_LABELS[params.peopleCount] ?? params.peopleCount}
- Who for: ${whoLabel}
- Duration needed: ${DURATION_LABELS[params.duration] ?? params.duration}
- Amount requested: $${params.amount}
- Urgency: ${URGENCY_LABELS[params.urgency] ?? params.urgency}
- Their situation in their own words: "${params.situation}"

Write a short, clear title (max 10 words) and a one-sentence description for their food request. The description must be written in first person as if the person is speaking directly (e.g. "I'm a single mom feeding three kids and we've run out of groceries."). Keep it warm, honest, and concise.

Return JSON only: { "title": "...", "description": "..." }`;

  const res = await fetch("https://api.featherless.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.FEATHERLESS_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Featherless API error: ${res.status}`);
  }

  const data = await res.json();
  const text = data.choices[0].message.content.trim();
  const json = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  return JSON.parse(json) as { title: string; description: string };
}
