import { buildApp } from "./app.ts";
import { config } from "./config.ts";

const app = buildApp();

app.listen({ port: config.port, host: config.host }).then(
  (address) => console.warn(`SecureChat server listening on ${address}`),
  (err: unknown) => {
    console.error(err);
    process.exit(1);
  },
);
