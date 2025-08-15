"use server";

import { aiAgentPrompt } from "@/lib/data";
import { prismaClient } from "@/lib/prismaClient";
import { vapiServer } from "@/lib/vapi/vapiServer";

const FALLBACK_MODEL = "gpt-4o";
const FALLBACK_PROVIDER = "openai";
const DEFAULT_TEMP = 0.5;

const buildFirstMessage = (name: string) =>
  `Hi there, this is ${name} from customer support. How can I help you today?`;

const sanitize = (s: string) => s?.trim();

export const createAssistant = async (rawName: string, rawUserId: string) => {
  try {
    const name = sanitize(rawName);
    const userId = sanitize(rawUserId);
    if (!name || name.length < 2) return { success: false, status: 400, message: "Name must be at least 2 characters" };
    if (!userId) return { success: false, status: 400, message: "Missing userId" };

    const created = await vapiServer.assistants.create({
      name,
      firstMessage: buildFirstMessage(name),
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
        name,
        firstMessage: buildFirstMessage(name),
        userId,
      },
    });

    return { success: true, status: 200, data: aiAgent };
  } catch (error: any) {
    console.error("Error creating agent:", error);
    return { success: false, status: 500, message: error?.message ?? "Failed to create agent" };
  }
};

export const updateAssistant = async (
  assistantId: string,
  rawFirstMessage: string,
  rawSystemPrompt: string
) => {
  try {
    const firstMessage = sanitize(rawFirstMessage) || "Hello! How can I help you today?";
    const systemPrompt = sanitize(rawSystemPrompt) || aiAgentPrompt;

    const updatedExternal = await vapiServer.assistants.update(assistantId, {
      firstMessage,
      model: {
        model: FALLBACK_MODEL,
        provider: FALLBACK_PROVIDER,
        messages: [{ role: "system", content: systemPrompt }],
      },
      serverMessages: [],
    });

    const providerModel = (updatedExternal as any)?.model?.model ?? FALLBACK_MODEL;
    const providerName = (updatedExternal as any)?.model?.provider ?? FALLBACK_PROVIDER;

    const updated = await prismaClient.aiAgents.update({
      where: { id: assistantId },
      data: { firstMessage, prompt: systemPrompt, model: providerModel, provider: providerName },
    });

    return { success: true, status: 200, data: updated };
  } catch (error: any) {
    console.error("Error updating agent:", error);
    return { success: false, status: 500, message: error?.message ?? "Failed to update agent" };
  }
};
