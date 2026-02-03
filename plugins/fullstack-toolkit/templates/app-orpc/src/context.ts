import type { Context as HonoContext } from 'hono';

export interface AppContext {
  requestId: string;
  timestamp: Date;
}

export function createContext(c: HonoContext): AppContext {
  return {
    requestId: crypto.randomUUID(),
    timestamp: new Date(),
  };
}
