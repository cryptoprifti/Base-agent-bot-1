import * as OpenAIModule from "openai";

const OpenAI = (OpenAIModule as any).default ?? OpenAIModule;

let _openai: InstanceType<typeof OpenAI> | null = null;

export function getOpenAIClient(): InstanceType<typeof OpenAI> {
  if (_openai) return _openai;

  const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

  if (!baseURL) {
    throw new Error(
      "AI_INTEGRATIONS_OPENAI_BASE_URL must be set. Did you forget to provision the OpenAI AI integration?",
    );
  }

  if (!apiKey) {
    throw new Error(
      "AI_INTEGRATIONS_OPENAI_API_KEY must be set. Did you forget to provision the OpenAI AI integration?",
    );
  }

  _openai = new OpenAI({ apiKey, baseURL });
  return _openai;
}

/** @deprecated Use getOpenAIClient() for lazy initialization. Kept for backward compat. */
export const openai = new Proxy({} as InstanceType<typeof OpenAI>, {
  get(_target, prop, receiver) {
    return Reflect.get(getOpenAIClient(), prop, receiver);
  },
});
