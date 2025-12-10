'use server';

import {
  receiveIntelligentAIResponse,
  type ReceiveIntelligentAIResponseInput,
  type ReceiveIntelligentAIResponseOutput,
} from '@/ai/flows/receive-intelligent-ai-response';
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
