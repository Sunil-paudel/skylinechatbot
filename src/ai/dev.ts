'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/receive-intelligent-ai-response.ts';
import '@/ai/flows/app-knowledge-flow.ts';
