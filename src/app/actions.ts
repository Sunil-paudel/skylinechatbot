'use server';

import {
  receiveIntelligentAIResponse,
  type ReceiveIntelligentAIResponseInput,
  type ReceiveIntelligentAIResponseOutput,
} from '@/ai/flows/receive-intelligent-ai-response';
import {
  answerAppQuestion,
  type AppKnowledgeInput,
  type AppKnowledgeOutput,
} from '@/ai/flows/app-knowledge-flow';
import { z } from 'zod';

const getAIResponseInputSchema = z.object({
  latestMessage: z.string(),
  conversationHistory: z.array(z.object({
    role: z.string(),
    content: z.string(),
  })).optional(),
});

export async function getAIResponse(input: ReceiveIntelligentAIResponseInput): Promise<ReceiveIntelligentAIResponseOutput> {
  const validatedInput = getAIResponseInputSchema.safeParse(input);

  if (!validatedInput.success) {
    throw new Error('Invalid input for getAIResponse');
  }

  try {
    const response = await receiveIntelligentAIResponse(validatedInput.data);
    return response;
  } catch (error) {
    console.error('Error in getAIResponse:', error);
    throw new Error('Failed to get AI response.');
  }
}

const getAppKnowledgeResponseInputSchema = z.object({
  question: z.string(),
});

export async function getAppKnowledgeResponse(input: AppKnowledgeInput): Promise<AppKnowledgeOutput> {
    const validatedInput = getAppKnowledgeResponseInputSchema.safeParse(input);

    if (!validatedInput.success) {
        throw new Error('Invalid input for getAppKnowledgeResponse');
    }

    try {
        const response = await answerAppQuestion(validatedInput.data);
        return response;
    } catch (error) {
        console.error('Error in getAppKnowledgeResponse:', error);
        throw new Error('Failed to get app knowledge response.');
    }
}
