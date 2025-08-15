"use server";

import { z } from "zod";
import { aiAgentPrompt } from "@/lib/data";
import { prismaClient } from "@/lib/prismaClient";
import { vapiServer } from "@/lib/vapi/vapiServer";

const FALLBACK_MODEL = "gpt-4o";
const FALLBACK_PROVIDER = "openai";
const DEFAULT_TEMP = 0.5;

const CreateSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  userId: z.string().trim().min(1, "Missing userId"),
});

const UpdateSchema = z.object({
  assistantId: z.string().trim().min(1, "Missing assistantId"),
  firstMessage: z.string().trim().optional(),
  systemPrompt: z.string().trim().optional(),
});

const buildFirstMessage = (name: string) =>
  `Hi there, this is ${name} from customer support. How can I help you today?`;

const normalizeError = (err: unknown) => {
  const e = err as any;
  const code: number =
    e?.statusCode ?? e?.response?.status ?? e?.status ?? 500;
  const message: string =
    e?.message ??
    e?.response?.data?.error ??
    e?.response?.data?.message ??
    "Unexpected error";
  return { code, message };
};

export const createAssistant = async (name: string, userId: string) => {
  try {
    const { name: validName, userId: validUserId } = CreateSchema.parse({ name, userId });

    const created = await vapiServer.assistants.create({
      name: validName,
      firstMessage: buildFirstMessage(validName),
      model: {
        model: FALLBACK_MODEL,
        provider: FALLBACK_PROVIDER,
        messages: [{ role: "system", content: aiAgentPrompt }],
        temperature: DEFAULT_TEMP,
      },
      serverMessages: [],
    });

    const externalId =
      (created as any).assistantId ?? (created as any)?.assistant?.id ?? (created as any)?.id;
    if (!externalId) return { success: false, status: 502, message: "Provider did not return assistant id" };

    const providerModel = (created as any)?.model?.model ?? FALLBACK_MODEL;
    const providerName = (created as any)?.model?.provider ?? FALLBACK_PROVIDER;

    const aiAgent = await prismaClient.aiAgents.create({
      data: {
        id: externalId,
        model: providerModel,
        provider: providerName,
        prompt: aiAgentPrompt,
        name: validName,
        firstMessage: buildFirstMessage(validName),
        userId: validUserId,
      },
    });

    return { success: true, status: 200, data: aiAgent };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, status: 400, message: error.issues[0]?.message ?? "Invalid input" };
    }
    const { code, message } = normalizeError(error);
    console.error("Error creating agent:", message);
    return { success: false, status: code, message };
  }
};

export const updateAssistant = async (
  assistantId: string,
  firstMessage: string,
  systemPrompt: string
) => {
  try {
    const parsed = UpdateSchema.parse({ assistantId, firstMessage, systemPrompt });

    const fm = parsed.firstMessage?.trim() || "Hello! How can I help you today?";
    const sp = parsed.systemPrompt?.trim() || aiAgentPrompt;

    const [external, updated] = await Promise.all([
      vapiServer.assistants.update(parsed.assistantId, {
        firstMessage: fm,
        model: {
          model: FALLBACK_MODEL,
          provider: FALLBACK_PROVIDER,
          messages: [{ role: "system", content: sp }],
        },
        serverMessages: [],
      }),
      prismaClient.aiAgents.update({
        where: { id: parsed.assistantId },
        data: { firstMessage: fm, prompt: sp, model: FALLBACK_MODEL, provider: FALLBACK_PROVIDER },
      }),
    ]);

    const providerModel = (external as any)?.model?.model;
    const providerName = (external as any)?.model?.provider;
    if (providerModel || providerName) {
      await prismaClient.aiAgents.update({
        where: { id: parsed.assistantId },
        data: {
          ...(providerModel ? { model: providerModel } : {}),
          ...(providerName ? { provider: providerName } : {}),
        },
      });
    }

    return { success: true, status: 200, data: updated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, status: 400, message: error.issues[0]?.message ?? "Invalid input" };
    }
    const { code, message } = normalizeError(error);
    console.error("Error updating agent:", message);
    return { success: false, status: code, message };
  }
};
