import { createHash } from "node:crypto";
import { GoogleGenAI } from "@google/genai";

export class AiProviderError extends Error {
  constructor(code, { retryable = false, retryAfterSeconds = null, cause } = {}) {
    super(code, { cause });
    this.name = "AiProviderError";
    this.code = code;
    this.retryable = retryable;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export function hashAiValue(value) {
  return createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
}

function providerError(error) {
  if (error?.name === "AbortError") return new AiProviderError("AI_TIMEOUT", { retryable: true, cause: error });
  const status = Number(error?.status ?? error?.code);
  if (status === 429) return new AiProviderError("AI_QUOTA_EXCEEDED", { retryable: true, retryAfterSeconds: 60, cause: error });
  if ([500, 502, 503, 504].includes(status)) return new AiProviderError("AI_PROVIDER_FAILURE", { retryable: true, cause: error });
  return new AiProviderError("AI_PROVIDER_FAILURE", { retryable: false, cause: error });
}

export function createAiProvider(environment) {
  const settings = environment.ai;
  let client = null;
  let consecutiveFailures = 0;
  let openUntil = 0;

  function available() {
    return Boolean(settings.enabled && settings.apiKey && Date.now() >= openUntil);
  }

  async function generateStructured({ prompt, systemInstruction, schema, temperature = settings.temperature }) {
    if (!settings.enabled || !settings.apiKey) throw new AiProviderError("AI_DISABLED");
    if (Date.now() < openUntil) {
      throw new AiProviderError("AI_CIRCUIT_OPEN", {
        retryable: true,
        retryAfterSeconds: Math.max(1, Math.ceil((openUntil - Date.now()) / 1000)),
      });
    }
    client ??= new GoogleGenAI({
      apiKey: settings.apiKey,
      httpOptions: { apiVersion: settings.apiVersion },
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), settings.timeoutMs);
    const startedAt = performance.now();
    try {
      const response = await client.models.generateContent({
        model: settings.model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseJsonSchema: schema,
          temperature,
          maxOutputTokens: settings.maxOutputTokens,
          abortSignal: controller.signal,
        },
      });
      if (!response.text) throw new AiProviderError("AI_EMPTY_OUTPUT", { retryable: true });
      let value;
      try {
        value = JSON.parse(response.text);
      } catch (error) {
        throw new AiProviderError("AI_INVALID_OUTPUT", { retryable: true, cause: error });
      }
      consecutiveFailures = 0;
      return {
        value,
        metadata: {
          provider: settings.provider,
          model: settings.model,
          latencyMs: Math.round(performance.now() - startedAt),
          inputTokens: response.usageMetadata?.promptTokenCount ?? null,
          outputTokens: response.usageMetadata?.candidatesTokenCount ?? null,
          totalTokens: response.usageMetadata?.totalTokenCount ?? null,
          outputHash: hashAiValue(value),
        },
      };
    } catch (error) {
      consecutiveFailures += 1;
      if (consecutiveFailures >= settings.circuitBreakerFailureThreshold) {
        openUntil = Date.now() + settings.circuitBreakerResetSeconds * 1000;
      }
      if (error instanceof AiProviderError) throw error;
      throw providerError(error);
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    available,
    generateStructured,
    capabilities() {
      return {
        provider: settings.provider,
        model: settings.model,
        enabled: settings.enabled,
        available: available(),
        features: settings.features,
      };
    },
  };
}
