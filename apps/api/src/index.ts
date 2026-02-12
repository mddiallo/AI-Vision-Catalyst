import 'dotenv/config';
import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import pinoHttp from 'pino-http';
import pino from 'pino';

import healthRoutes from './routes/health.js';
import workiqRoutes from './routes/workiq.js';
import visionRoutes from './routes/vision.js';
import { connectWorkIQ } from './mcp/workiqClient.js';

const logger = pino({ name: 'api-server' });
const app: Express = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// ── Middleware ───────────────────────────────────────────────────────────────────

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));

// ── Routes ──────────────────────────────────────────────────────────────────────

app.use(healthRoutes);
app.use(workiqRoutes);
app.use(visionRoutes);

// ── Start Server ────────────────────────────────────────────────────────────────

async function start() {
  // Conditionally connect to WorkIQ MCP
  const workiqEnabled = process.env.WORKIQ_ENABLED !== 'false';
  if (workiqEnabled) {
    try {
      await connectWorkIQ();
    } catch (err: any) {
      logger.warn({ err: err.message }, 'WorkIQ MCP initialization failed — continuing without it');
    }
  } else {
    logger.info('WorkIQ MCP is disabled via WORKIQ_ENABLED=false');
  }

  app.listen(PORT, () => {
    logger.info({ port: PORT }, `API server running at http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});

export default app;
