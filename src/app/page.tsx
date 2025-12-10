
"use client";

import { useState, useEffect } from 'react';
import type { Message, Conversation } from '@/lib/types';
import { getAIResponse } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { seedConversations } from '@/lib/seed-data';

import { ChatHeader } from '@/components/chat/chat-header';
import { ChatHistorySidebar } from '@/components/chat/chat-history-sidebar';
import { Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load seed data on initial render
    setConversations(seedConversations);
    if (seedConversations.length > 0) {
      setCurrentConversationId(seedConversations[0].id);
    } else {
      // Create a new empty chat if there's no seed data
      handleNewChat();
    }
  }, []);

  const handleNewChat = () => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: 'New Chat',
      messages: [],
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newId);
  };
  
  const handleSelectConversation = (id: string) => {
    setCurrentConversationId(id);
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    setIsLoading(true);

    let targetConversationId = currentConversationId;

    // Find current conversation
    const currentConversation = conversations.find(c => c.id === currentConversationId);

    if (!currentConversation) {
      handleNewChat(); // This will create a new conversation and set it as current
      // We need to get the new ID, so we'll re-run this function in a moment
      targetConversationId = `conv-${Date.now()}`; // A bit of a hack, but will work for now
    }
    
    // If the current conversation is new (no messages), its title becomes the first message.
    const isNewConversation = currentConversation ? currentConversation.messages.length === 0 : true;

    setConversations(prev =>
      prev.map(c => {
        if (c.id === targetConversationId) {
          const updatedConversation = {
            ...c,
            title: isNewConversation ? text.substring(0, 30) + (text.length > 30 ? '...' : '') : c.title,
            messages: [...c.messages, userMessage],
          };
          return updatedConversation;
        }
        return c;
      })
    );
    
    const loadingMessage: Message = { role: 'assistant', content: '...' };
    setConversations(prev =>
      prev.map(c =>
        c.id === targetConversationId ? { ...c, messages: [...(c.messages || []), loadingMessage] } : c
      )
    );

    try {
      const history = conversations.find(c => c.id === targetConversationId)?.messages ?? [];
      const conversationHistory = [...history, userMessage].map(msg => ({ role: msg.role, content: msg.content }));

      const aiResponse = await getAIResponse({
        latestMessage: text,
        conversationHistory: conversationHistory,
      });

      const aiMessage: Message = { role: 'assistant', content: aiResponse.response };
      
      setConversations(prev =>
        prev.map(c => {
          if (c.id === targetConversationId) {
            // Replace loading message with AI response
            const newMessages = c.messages.slice(0, -1);
            newMessages.push(aiMessage);
            return { ...c, messages: newMessages };
          }
          return c;
        })
      );

    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from AI. Please try again.",
      });
      // Remove loading message on error
      setConversations(prev =>
        prev.map(c =>
          c.id === targetConversationId ? { ...c, messages: c.messages.slice(0, -1) } : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const activeConversation = conversations.find(c => c.id === currentConversationId);

  return (
    <div className="flex h-screen bg-background text-foreground">
        <Sidebar>
            <ChatHistorySidebar 
                conversations={conversations}
                activeConversationId={currentConversationId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleNewChat}
            />
        </Sidebar>
        <SidebarInset>
            <div className="flex flex-col h-full">
                <ChatHeader onNewChat={handleNewChat} />
                <ChatInterface
                    messages={activeConversation?.messages || []}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    placeholder="Ask AetherChat anything..."
                />
            </div>
        </SidebarInset>
    </div>
  );
}
