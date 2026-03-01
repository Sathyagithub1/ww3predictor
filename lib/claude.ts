import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface PredictionResult {
  score: number;
  reasoning: string;
  factors: string[];
}

export async function analyzeThreatLevel(
  headlines: string[]
): Promise<PredictionResult> {
  const headlineList = headlines
    .slice(0, 20)
    .map((h, i) => `${i + 1}. ${h}`)
    .join("\n");

  const prompt = `You are a geopolitical risk analyst. Based on the following current news headlines, assess the probability of a World War 3 scenario occurring within the next 12 months.

NEWS HEADLINES:
${headlineList}

Analyze these headlines considering:
- Military escalations and troop deployments
- Nuclear threats or tests
- Alliance breakdowns or formations
- Economic warfare and sanctions
- Territorial disputes and invasions
- Diplomatic failures

Respond with ONLY valid JSON in this exact format:
{
  "score": <integer 0-100>,
  "reasoning": "<2-3 sentence explanation of the overall threat assessment>",
  "factors": [
    "<key factor 1 driving the score>",
    "<key factor 2 driving the score>",
    "<key factor 3 driving the score>",
    "<key factor 4 driving the score>",
    "<key factor 5 driving the score>"
  ]
}

Score guidelines:
- 0-20: Low risk (normal international tensions)
- 21-40: Elevated (significant regional conflicts)
- 41-60: Moderate (multiple escalating conflicts)
- 61-80: High (active major power confrontations)
- 81-100: Critical (imminent risk of global conflict)`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type from Claude");
  }

  // Strip markdown code fences if present
  const jsonText = content.text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  const result = JSON.parse(jsonText) as PredictionResult;

  // Validate
  if (
    typeof result.score !== "number" ||
    result.score < 0 ||
    result.score > 100
  ) {
    throw new Error("Invalid score from Claude response");
  }

  return result;
}
