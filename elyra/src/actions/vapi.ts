"use server";

import { aiAgentPrompt } from "@/lib/data";
import { prismaClient } from "@/lib/prismaClient";
import { vapiServer } from "@/lib/vapi/vapiServer";

const sanitize = (s: string) => s?.trim();

export const createAssistant = async (rawName: string, rawUserId: string) => {
  try {
    const name = sanitize(rawName);
    const userId = sanitize(rawUserId);

    if (!name || name.length < 2) {
      return { success: false, status: 400, message: "Name must be at least 2 characters" };
    }
    if (!userId) {
      return { success: false, status: 400, message: "Missing userId" };
    }

    const created = await vapiServer.assistants.create({
      name,
      firstMessage: `Hi there, this is ${name} from customer support. How can I help you today?`,
      model: {
        model: "gpt-4o",
        provider: "openai",
        messages: [{ role: "system", content: aiAgentPrompt }],
        temperature: 0.5,
      },
      serverMessages: [],
    });

    const externalId =
      (created as any).assistantId ??
      (created as any)?.assistant?.id ??
      (created as any)?.id;

    if (!externalId) {
      return { success: false, status: 502, message: "Provider did not return assistant id" };
    }

    const aiAgent = await prismaClient.aiAgents.create({
      data: {
        id: externalId,
        model: "gpt-4o",
        provider: "openai",
        prompt: aiAgentPrompt,
        name,
        firstMessage: `Hi there, this is ${name} from customer support. How can I help you today?`,
        userId,
      },
    });

    return { success: true, status: 200, data: aiAgent };
  } catch (error: any) {
    const msg = error?.message ?? "Failed to create agent";
    console.error("Error creating agent:", error);
    return { success: false, status: 500, message: msg };
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

    await vapiServer.assistants.update(assistantId, {
      firstMessage,
      model: {
        model: "gpt-4o",
        provider: "openai",
        messages: [{ role: "system", content: systemPrompt }],
      },
      serverMessages: [],
    });

    const updated = await prismaClient.aiAgents.update({
      where: { id: assistantId },
      data: { firstMessage, prompt: systemPrompt },
    });

    return { success: true, status: 200, data: updated };
  } catch (error: any) {
    const msg = error?.message ?? "Failed to update agent";
    console.error("Error updating agent:", error);
    return { success: false, status: 500, message: msg };
  }
};
