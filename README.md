# Skyline Chat

This is a Next.js application that provides a conversational AI chatbot interface for Skyline Higher Secondary School.

## Customizing the AI Model

This application uses Genkit to interface with Large Language Models (LLMs). You can easily change the model or even add a fallback model by editing the Genkit configuration file.

**File to edit:** `src/ai/genkit.ts`

### Example: Switching from Google Gemini to OpenAI's ChatGPT

1.  **Install the OpenAI Plugin:**
    Open your terminal and run the following command to add the Genkit OpenAI plugin to your project:
    ```bash
    npm install @genkit-ai/openai
    ```

2.  **Add Your API Key:**
    Add your OpenAI API key to the `.env` file in the root of your project. If the file doesn't exist, create it.
    ```
    OPENAI_API_KEY="your-api-key-here"
    ```

3.  **Update Genkit Configuration:**
    Modify `src/ai/genkit.ts` to import and use the OpenAI plugin.

    ```ts
    import {genkit} from 'genkit';
    import {openai} from '@genkit-ai/openai'; // Import openai
    import {googleAI} from '@genkit-ai/google-genai'; // Keep googleAI for the fallback

    export const ai = genkit({
      plugins: [
        openai(), // Add the openai plugin
        googleAI()
      ],
      model: 'openai/gpt-4', // Change the primary model to ChatGPT
    });
    ```

### How to Configure a Fallback Model

Genkit can automatically switch to a fallback model if the primary one fails. To configure this, you can provide an array of models in the `model` property. Genkit will try them in order.

1.  **Update Genkit Configuration:**
    In `src/ai/genkit.ts`, change the `model` property to an array of model names. The first model is the primary, and the second is the fallback.

    ```ts
    import {genkit} from 'genkit';
    import {googleAI} from '@genkit-ai/google-genai';

    export const ai = genkit({
      plugins: [googleAI()],
      // The first model is the primary, the second is the fallback.
      model: ['googleai/gemini-2.5-pro', 'googleai/gemini-2.5-flash'],
    });
    ```
    In this example, the app will first try to use `gemini-2.5-pro`. If that fails for any reason (e.g., the model is unavailable), it will automatically try `gemini-2.5-flash` instead.
# skylinechatbot
