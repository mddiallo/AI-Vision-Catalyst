import { Router, type Request, type Response, type Router as RouterType } from 'express';
import { WorkIQQuerySchema } from '../schemas/vision.js';
import { queryWorkIQ, isWorkIQAvailable } from '../mcp/workiqClient.js';

const router: RouterType = Router();

router.post('/api/workiq/query', async (req: Request, res: Response) => {
  try {
    // Validate input
    const parseResult = WorkIQQuerySchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid input',
        details: parseResult.error.issues,
      });
      return;
    }

    if (!isWorkIQAvailable()) {
      res.status(503).json({
        error: 'WorkIQ MCP is not available',
        hint: 'Ensure WorkIQ is configured. Run: pnpm --filter api workiq:eula',
      });
      return;
    }

    const { question } = parseResult.data;
    const result = await queryWorkIQ(question);

    res.json(result);
  } catch (err: any) {
    res.status(500).json({
      error: 'WorkIQ query failed',
      message: err.message,
    });
  }
});

export default router;
