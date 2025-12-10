import type { Conversation } from './types';

export const seedConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Next.js App Router',
    messages: [
      { role: 'user', content: 'What is the Next.js App Router?' },
      {
        role: 'assistant',
        content:
          'The Next.js App Router is a new routing system introduced in Next.js 13. It uses React Server Components and allows for features like nested layouts, server-side rendering by default, and improved code splitting.',
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'History of the Roman Empire',
    messages: [
      { role: 'user', content: 'Tell me a fun fact about the Roman Empire.' },
      {
        role: 'assistant',
        content:
          'The Romans had a goddess for sewers named Cloacina. She was also the goddess of beauty and purity, which is an interesting combination!',
      },
       { role: 'user', content: 'That is fascinating. What was the population of Rome at its peak?' },
      {
        role: 'assistant',
        content:
          'At its peak in the 2nd century AD, the city of Rome had an estimated population of over one million people, making it one of the largest cities in the ancient world.',
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'Cooking a perfect steak',
    messages: [
        { role: 'user', content: 'How do I cook the perfect steak?' },
        { role: 'assistant', content: 'Cooking the perfect steak depends on your preferred doneness. A key tip is to let it rest after cooking to allow the juices to redistribute. Do you have a meat thermometer?' }
    ]
  }
];
