"use client";

import { useState } from 'react';
import type { Message } from '@/lib/types';
import { getAIResponse } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";

import { ChatHeader } from '@/components/chat/chat-header';
import { ChatHistory } from '@/components/chat/chat-history';
import { ChatInput } from '@/components/chat/chat-input';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const loadingMessage: Message = { role: 'assistant', content: '...' };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const conversationHistory = newMessages.map(msg => ({ role: msg.role, content: msg.content }));
      
      const aiResponse = await getAIResponse({
        latestMessage: text,
        conversationHistory: conversationHistory,
      });

      const aiMessage: Message = { role: 'assistant', content: aiResponse.response };
      setMessages(prev => [...prev.slice(0, -1), aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
      });
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <ChatHeader onNewChat={handleNewChat} />
      <div className="flex-1 overflow-hidden">
        <ChatHistory messages={messages} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
