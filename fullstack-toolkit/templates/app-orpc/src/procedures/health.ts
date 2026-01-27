import { os } from '@orpc/server';

const o = os;

export const health = o.router({
  check: o.handler(() => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }),

  ready: o.handler(() => {
    // Add readiness checks here
    return {
      status: 'ready',
      checks: {
        database: 'ok',
        cache: 'ok',
      },
    };
  }),
});
