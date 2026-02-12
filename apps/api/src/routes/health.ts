import { Router, type Request, type Response, type Router as RouterType } from 'express';
import { isWorkIQAvailable } from '../mcp/workiqClient.js';

const router: RouterType = Router();

router.get('/healthz', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    workiq: isWorkIQAvailable(),
    azure: !!(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY),
  });
});

export default router;
