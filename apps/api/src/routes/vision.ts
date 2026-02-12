import { Router, type Request, type Response, type Router as RouterType } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pino from 'pino';
import { VisionInputSchema, type VisionOutput } from '../schemas/vision.js';
import { queryWorkIQ, isWorkIQAvailable } from '../mcp/workiqClient.js';
import { generateVisions } from '../llm/azureOpenAI.js';
import { buildWorkIQQuestions } from '../llm/prompts.js';

const logger = pino({ name: 'vision-route' });
const router: RouterType = Router();

// ── In-Memory Store ─────────────────────────────────────────────────────────────

const visionStore = new Map<string, { input: any; result: VisionOutput; createdAt: string }>();

// ── POST /api/vision/generate ───────────────────────────────────────────────────

router.post('/api/vision/generate', async (req: Request, res: Response) => {
  try {
    // Validate input
    const parseResult = VisionInputSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid input',
        details: parseResult.error.issues,
      });
      return;
    }

    const input = parseResult.data;
    logger.info({ industry: input.industry }, 'Vision generation started');

    // Step 1: Fetch org context from WorkIQ (if available)
    let orgContext = '';

    if (isWorkIQAvailable()) {
      logger.info('Fetching organizational context from WorkIQ');
      const questions = buildWorkIQQuestions(input);
      const results = await Promise.allSettled(
        questions.map((q) => queryWorkIQ(q)),
      );

      const contextParts: string[] = [];
      for (let i = 0; i < results.length; i++) {
        const result = results[i]!;
        if (result.status === 'fulfilled') {
          contextParts.push(`### Query: ${questions[i]}\n${result.value.answer}`);
        } else {
          logger.warn({ question: questions[i], error: result.reason }, 'WorkIQ query failed');
        }
      }
      orgContext = contextParts.join('\n\n---\n\n');
      logger.info({ signalCount: contextParts.length }, 'Org context collected');
    } else {
      logger.info('WorkIQ unavailable — proceeding without org context');
    }

    // Step 2: Call Azure OpenAI to generate visions
    const result = await generateVisions(input, orgContext);

    // Step 3: Store result
    const id = uuidv4();
    visionStore.set(id, {
      input,
      result,
      createdAt: new Date().toISOString(),
    });

    logger.info({ id }, 'Vision generation completed');

    res.json({ id, ...result });
  } catch (err: any) {
    logger.error({ err: err.message }, 'Vision generation failed');
    res.status(500).json({
      error: 'Vision generation failed',
      message: err.message,
    });
  }
});

// ── GET /api/vision/:id ─────────────────────────────────────────────────────────

router.get('/api/vision/:id', (req: Request, res: Response) => {
  const id = req.params.id as string;
  const entry = visionStore.get(id);

  if (!entry) {
    res.status(404).json({ error: 'Vision result not found' });
    return;
  }

  res.json({ id, ...entry.result, createdAt: entry.createdAt });
});

export default router;
