import { AzureOpenAI } from 'openai';
import pino from 'pino';
import { VisionOutputSchema, type VisionInput, type VisionOutput } from '../schemas/vision.js';
import { VISION_SYSTEM_PROMPT, buildUserPrompt, REPAIR_PROMPT } from './prompts.js';

const logger = pino({ name: 'azure-openai' });

// ── Client Factory ──────────────────────────────────────────────────────────────

function getClient(): AzureOpenAI {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview';

  if (!endpoint || !apiKey) {
    throw new Error(
      'Missing Azure OpenAI configuration. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY in .env',
    );
  }

  return new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion,
  });
}

// ── Generate Visions ────────────────────────────────────────────────────────────

export async function generateVisions(
  input: VisionInput,
  orgContext: string,
): Promise<VisionOutput> {
  const client = getClient();
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o';
  const userPrompt = buildUserPrompt(input, orgContext);

  logger.info({ deployment, industry: input.industry }, 'Calling Azure OpenAI for vision generation');

  // First attempt
  let rawContent = await callChatCompletion(client, deployment, userPrompt);
  let parsed = tryParseVisionOutput(rawContent);

  if (parsed) {
    logger.info('Vision output parsed successfully on first attempt');
    return parsed;
  }

  // Retry with repair prompt
  logger.warn('First attempt produced invalid JSON — retrying with repair prompt');
  const repairUserPrompt = `${REPAIR_PROMPT}\n\nOriginal (invalid) response:\n${rawContent}`;
  rawContent = await callChatCompletion(client, deployment, repairUserPrompt);
  parsed = tryParseVisionOutput(rawContent);

  if (parsed) {
    logger.info('Vision output parsed successfully after repair');
    return parsed;
  }

  throw new Error(
    'Azure OpenAI returned invalid JSON after two attempts. Raw output logged for debugging.',
  );
}

// ── Chat Completion Call ────────────────────────────────────────────────────────

async function callChatCompletion(
  client: AzureOpenAI,
  deployment: string,
  userMessage: string,
): Promise<string> {
  const response = await client.chat.completions.create({
    model: deployment,
    messages: [
      { role: 'system', content: VISION_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 8000,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('Azure OpenAI returned an empty response');
  }

  return content;
}

// ── Parse & Validate ────────────────────────────────────────────────────────────

function tryParseVisionOutput(raw: string): VisionOutput | null {
  try {
    // Strip markdown code fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const parsed = JSON.parse(cleaned);
    const result = VisionOutputSchema.safeParse(parsed);

    if (result.success) {
      return result.data;
    }

    logger.warn({ errors: result.error.issues }, 'Zod validation failed for vision output');
    return null;
  } catch (err: any) {
    logger.warn({ err: err.message }, 'Failed to parse vision output JSON');
    return null;
  }
}
