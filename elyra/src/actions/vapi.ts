"use server";

import { aiAgentPrompt } from "@/lib/data";
import { prismaClient } from "@/lib/prismaClient";
import { vapiServer } from "@/lib/vapi/vapiServer";

export const createAssistant = async (name: string, userId: string) => {
  try {
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

    const aiAgent = await prismaClient.aiAgents.create({
      data: {
        id: created.assistantId,
        model: "gpt-4o",
        provider: "openai",
        prompt: aiAgentPrompt,
        name,
        firstMessage: `Hi there, this is ${name} from customer support. How can I help you today?`,
        userId,
      },
    });

    return { success: true, status: 200, data: aiAgent };
  } catch (error) {
    console.error("Error creating agent:", error);
    return { success: false, status: 500, message: "Failed to create agent" };
  }
};

export const updateAssistant = async (
  assistantId: string,
  firstMessage: string,
  systemPrompt: string
) => {
  try {
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
  } catch (error) {
    console.error("Error updating agent:", error);
    return { success: false, status: 500, message: "Failed to update agent" };
  }
};
