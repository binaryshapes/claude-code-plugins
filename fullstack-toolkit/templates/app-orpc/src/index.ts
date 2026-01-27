import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { RPCHandler } from '@orpc/server/fetch';
import { router } from './router';
import { createContext } from './context';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// oRPC handler
const handler = new RPCHandler(router);

app.use('/rpc/*', async (c) => {
  const context = createContext(c);
  const response = await handler.handle(c.req.raw, {
    prefix: '/rpc',
    context,
  });
  return response ?? new Response('Not Found', { status: 404 });
});

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Root route
app.get('/', (c) => {
  return c.json({
    name: '{{name}}',
    version: '0.0.0',
    endpoints: {
      rpc: '/rpc',
      health: '/health',
    },
  });
});

const port = Number(process.env.PORT) || {{port}};

console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
export type { AppRouter } from './router';
