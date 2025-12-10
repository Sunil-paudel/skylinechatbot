'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI assistant that answers questions about the application's codebase.
 *
 * - answerAppQuestion - A function that provides answers to user questions about the application.
 * - AppKnowledgeInput - The input type for the answerAppQuestion function.
 * - AppKnowledgeOutput - The return type for the answerAppQuestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { promises as fs } from 'fs';
import path from 'path';

const AppKnowledgeInputSchema = z.object({
  question: z.string().describe('The user\'s question about the application.'),
});
export type AppKnowledgeInput = z.infer<typeof AppKnowledgeInputSchema>;

const AppKnowledgeOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the question.'),
});
export type AppKnowledgeOutput = z.infer<typeof AppKnowledgeOutputSchema>;

// A simple in-memory cache to store file contents
let fileContextCache: string | null = null;

async function getAppContext(): Promise<string> {
  if (fileContextCache) {
    return fileContextCache;
  }

  const fileContents: Record<string, string> = {};
  const rootDir = process.cwd();
  const filesToRead = [
    'README.md',
    'package.json',
    'next.config.ts',
    'src/app/layout.tsx',
    'src/app/page.tsx',
    'src/ai/genkit.ts',
    'src/lib/types.ts',
  ];

  for (const file of filesToRead) {
    try {
      const content = await fs.readFile(path.join(rootDir, file), 'utf-8');
      fileContents[file] = content;
    } catch (error) {
      console.warn(`Could not read file: ${file}`);
      fileContents[file] = 'Could not read file.';
    }
  }

  const contextString = `
    You are an expert AI assistant knowledgeable about this Next.js application.
    Your task is to answer questions based ONLY on the provided file context.
    Do not invent features or capabilities that are not supported by the files.
    Be concise and helpful.

    Here is the content of key files in the application:
    ${JSON.stringify(fileContents, null, 2)}
    `;
    
  fileContextCache = contextString;
  return contextString;
}


const appKnowledgeFlow = ai.defineFlow(
  {
    name: 'appKnowledgeFlow',
    inputSchema: AppKnowledgeInputSchema,
    outputSchema: AppKnowledgeOutputSchema,
  },
  async ({ question }) => {
    const context = await getAppContext();
    
    const prompt = `
      ${context}

      Based on the provided context, please answer the following question:
      Question: ${question}
      Answer:
    `;

    const { output } = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.5-flash',
      output: {
          schema: AppKnowledgeOutputSchema
      }
    });

    return output!;
  }
);


export async function answerAppQuestion(input: AppKnowledgeInput): Promise<AppKnowledgeOutput> {
  const validatedInput = AppKnowledgeInputSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for answerAppQuestion');
  }
  return appKnowledgeFlow(validatedInput.data);
}
