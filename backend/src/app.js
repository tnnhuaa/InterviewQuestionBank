import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { getEnvironment } from "./config/environment.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { createStatusRouter } from "./modules/system/status.routes.js";

const disconnectedCheck = async () => false;

export function createApp({
  checkDatabase = disconnectedCheck,
  environment = getEnvironment(),
} = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: environment.frontendOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use("/api/v1", createStatusRouter({ checkDatabase }));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
