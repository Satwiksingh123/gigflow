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

  /**
   * Graceful shutdown handler — ensures in-flight requests are completed
   * and the DB connection is cleanly closed before the process exits.
   * This prevents data corruption during container restarts / deployments.
   */
  async function shutdown(signal: string): Promise<void> {
    // eslint-disable-next-line no-console
    console.log(`\n[server] ${signal} received — shutting down gracefully`);
    server.close(async () => {
      try {
        await mongoose.connection.close();
        // eslint-disable-next-line no-console
        console.log("[db] connection closed");
        process.exit(0);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[db] error during shutdown", err);
        process.exit(1);
      }
    });
  }

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[fatal] failed to start server:", err);
  process.exit(1);
});