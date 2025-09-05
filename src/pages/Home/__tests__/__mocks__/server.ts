import { setupServer } from "msw/node";
import { fetch } from "cross-fetch";
import { bitcoinRequestHandler } from "./bitcoinRequestHandler";
import { betsRequestHandler } from "./betsRequestHandler";

export const server = setupServer(
  ...bitcoinRequestHandler,
  ...betsRequestHandler
);

// Mock fetch for Supabase in MSW
global.fetch = fetch;
