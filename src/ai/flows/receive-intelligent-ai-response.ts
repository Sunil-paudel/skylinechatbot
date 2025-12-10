'use server';
/**
 * @fileOverview This file defines the Genkit flow for receiving intelligent and context-aware responses from the AI assistant.
 *
 * - receiveIntelligentAIResponse - A function that handles the process of receiving AI-generated responses based on the conversation history.
 * - ReceiveIntelligentAIResponseInput - The input type for the receiveIntelligentAIResponse function, including the latest message and conversation history.
 * - ReceiveIntelligentAIResponseOutput - The return type for the receiveIntelligentAIResponse function, which is the AI's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ReceiveIntelligentAIResponseInputSchema = z.object({
  latestMessage: z.string().describe('The latest message from the user.'),
  conversationHistory: z.array(z.object({role: z.string(), content: z.string()})).optional().describe('The history of the conversation.'),
});
export type ReceiveIntelligentAIResponseInput = z.infer<typeof ReceiveIntelligentAIResponseInputSchema>;

const ReceiveIntelligentAIResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type ReceiveIntelligentAIResponseOutput = z.infer<typeof ReceiveIntelligentAIResponseOutputSchema>;

export async function receiveIntelligentAIResponse(input: ReceiveIntelligentAIResponseInput): Promise<ReceiveIntelligentAIResponseOutput> {
  return receiveIntelligentAIResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'receiveIntelligentAIResponsePrompt',
  input: {schema: ReceiveIntelligentAIResponseInputSchema},
  output: {schema: ReceiveIntelligentAIResponseOutputSchema},
  prompt: `You are a helpful AI assistant. Respond to the user based on the latest message and the conversation history to maintain context and relevance. 

Conversation History:
{{#each conversationHistory}}
  {{this.role}}: {{this.content}}
{{/each}}

User Message: {{{latestMessage}}}

Response:`,
});

const receiveIntelligentAIResponseFlow = ai.defineFlow(
  {
    name: 'receiveIntelligentAIResponseFlow',
    inputSchema: ReceiveIntelligentAIResponseInputSchema,
    outputSchema: ReceiveIntelligentAIResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
