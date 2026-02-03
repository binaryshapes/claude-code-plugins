import { os } from '@orpc/server';
import { health } from './procedures/health';

// Create the base oRPC instance
const o = os;

// Define your router
export const router = o.router({
  health,

  // Example procedure
  hello: o
    .input((input: { name?: string }) => input)
    .handler(({ input }) => {
      return {
        message: `Hello, ${input.name ?? 'World'}!`,
        timestamp: new Date().toISOString(),
      };
    }),
});

// Export the router type for client usage
export type AppRouter = typeof router;
