import { createCsrfMiddleware, createStart } from "@tanstack/react-start";

// Server functions are same-origin RPC; reject cross-site requests to them.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

// Every route renders on the server unless it opts out with its own `ssr` option.
export const startInstance = createStart(() => ({
  defaultSsr: true,
  requestMiddleware: [csrfMiddleware],
}));
