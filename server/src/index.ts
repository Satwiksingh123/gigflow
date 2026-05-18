import mongoose from "mongoose";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";

async function bootstrap(): Promise<void> {
  await connectDB();
  const app = createApp();

  const server = app.listen(env.port, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`[server] listening on http://127.0.0.1:${env.port}`);
  });

  // Graceful shutdown will be added in a later commit
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[fatal] failed to start server:", err);
  process.exit(1);
});