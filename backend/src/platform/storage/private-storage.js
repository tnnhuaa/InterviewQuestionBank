import { DeleteObjectCommand, GetObjectCommand, HeadBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

function localStorage(config) {
  const root = path.resolve(config.localPath);
  return {
    async healthCheck() {
      await fs.mkdir(root, { recursive: true });
      await fs.access(root, fsConstants.R_OK | fsConstants.W_OK);
      return true;
    },
    async put(buffer) {
      await fs.mkdir(root, { recursive: true });
      const key = randomUUID();
      await fs.writeFile(path.join(root, key), buffer, { flag: "wx" });
      return key;
    },
    async get(key) {
      if (!/^[0-9a-f-]{36}$/i.test(key)) throw new Error("Invalid private object key");
      return fs.readFile(path.join(root, key));
    },
    async delete(key) {
      if (!/^[0-9a-f-]{36}$/i.test(key)) return;
      await fs.rm(path.join(root, key), { force: true });
    },
  };
}

function s3Storage(config) {
  if (!config.s3Bucket || !config.s3AccessKeyId || !config.s3SecretAccessKey) {
    throw new Error("S3 private storage configuration is incomplete");
  }
  const client = new S3Client({
    endpoint: config.s3Endpoint,
    region: config.s3Region,
    credentials: {
      accessKeyId: config.s3AccessKeyId,
      secretAccessKey: config.s3SecretAccessKey,
    },
    forcePathStyle: Boolean(config.s3Endpoint),
  });
  return {
    async healthCheck() {
      await client.send(new HeadBucketCommand({ Bucket: config.s3Bucket }));
      return true;
    },
    async put(buffer, metadata = {}) {
      const key = randomUUID();
      await client.send(new PutObjectCommand({
        Bucket: config.s3Bucket,
        Key: key,
        Body: buffer,
        ContentType: metadata.contentType,
        Metadata: { classification: metadata.classification ?? "private" },
      }));
      return key;
    },
    async get(key) {
      const result = await client.send(new GetObjectCommand({ Bucket: config.s3Bucket, Key: key }));
      return Buffer.from(await result.Body.transformToByteArray());
    },
    async delete(key) {
      await client.send(new DeleteObjectCommand({ Bucket: config.s3Bucket, Key: key }));
    },
  };
}

export function createPrivateStorage(config) {
  if (config.driver === "s3") return s3Storage(config);
  if (config.driver === "local") return localStorage(config);
  throw new Error(`Unsupported STORAGE_DRIVER: ${config.driver}`);
}
