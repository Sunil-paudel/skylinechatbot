
"use client";

import { useState, useEffect } from 'react';
import type { Message, Conversation } from '@/lib/types';
import { getAIResponse } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { seedConversations } from '@/lib/seed-data';

import { ChatHeader } from '@/components/chat/chat-header';
import { ChatHistorySidebar } from '@/components/chat/chat-history-sidebar';
import { Sidebar } from '@/components/ui/sidebar';
import { ChatInterface } from '@/components/chat/chat-interface';

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    } else {
      setConversations(seedConversations);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    const savedCurrentConversationId = localStorage.getItem('currentConversationId');
    if (savedCurrentConversationId && savedCurrentConversationId !== 'null') {
      setCurrentConversationId(savedCurrentConversationId);
    } else if (conversations.length > 0) {
      setCurrentConversationId(conversations[0].id);
    } else {
      handleNewChat();
    }
  }, [conversations.length]);

  useEffect(() => {
    if (currentConversationId) {
      localStorage.setItem('currentConversationId', currentConversationId);
    }
  }, [currentConversationId]);


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
    
    let currentMessages: Message[] = [];
    let targetConversationId = currentConversationId;

    const currentConv = conversations.find(c => c.id === targetConversationId);
    const isNewConversation = !currentConv || currentConv.messages.length === 0;

    if (isNewConversation) {
        const newId = `conv-${Date.now()}`;
        const newConversation: Conversation = {
            id: newId,
            title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
            messages: [userMessage],
        };
        setConversations(prev => {
            const otherConversations = prev.filter(c => c.id !== targetConversationId);
            return [newConversation, ...otherConversations];
        });
        setCurrentConversationId(newId);
        targetConversationId = newId;
        currentMessages = [userMessage];
    } else {
        setConversations(prev =>
            prev.map(c => {
                if (c.id === targetConversationId) {
                    const updatedMessages = [...c.messages, userMessage];
                    currentMessages = updatedMessages;
                    return { ...c, messages: updatedMessages };
                }
                return c;
            })
        );
    }

    setIsLoading(true);
    const loadingMessage: Message = { role: 'assistant', content: '...' };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === targetConversationId) {
          return { ...c, messages: [...currentMessages, loadingMessage] };
        }
        return c;
      })
    );


    try {
      const history = conversations.find(c => c.id === targetConversationId)?.messages.slice(0, -1) ?? [];
      const conversationHistory = history.map(msg => ({ role: msg.role, content: msg.content }));

      const aiResponse = await getAIResponse({
        latestMessage: text,
        conversationHistory,
      });

      const aiMessage: Message = { role: 'assistant', content: aiResponse.response };
      
      setConversations(prev =>
        prev.map(c => {
          if (c.id === targetConversationId) {
            const finalMessages = [...currentMessages, aiMessage];
            return { ...c, messages: finalMessages };
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
      setConversations(prev =>
        prev.map(c => {
          if (c.id === targetConversationId) {
            return { ...c, messages: currentMessages };
          }
          return c;
        })
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
        <div className="flex flex-col flex-1 h-full min-w-0">
            <ChatHeader onNewChat={handleNewChat} />
            <ChatInterface
                messages={activeConversation?.messages || []}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                placeholder="Ask AetherChat anything..."
            />
        </div>
    </div>
  );
}
