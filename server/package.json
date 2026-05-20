import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import routes from "./routes";
import { errorHandler, notFound } from "./middleware/error";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: [
        env.clientOrigin,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://gigfloww-git-main-satwik-singhs-projects-ecd891d6.vercel.app",
        "https://gigfloww-cyan.vercel.app",
      ],
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  if (env.nodeEnv !== "test") app.use(morgan("dev"));

  app.use("/api", routes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
