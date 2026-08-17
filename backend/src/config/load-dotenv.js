import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(configDirectory, "../../..");

// Root .env is canonical. backend/.env remains a local fallback for existing setups.
config({
  path: [path.join(repositoryRoot, ".env"), path.join(repositoryRoot, "backend", ".env")],
  override: false,
  quiet: true,
});
