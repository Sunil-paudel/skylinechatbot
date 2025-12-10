
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { Message, Conversation } from '@/lib/types';
import { getAIResponse } from '@/app/actions';
import { useToast } from "@/hooks/use-toast";
import { seedConversations } from '@/lib/seed-data';

import { ChatHeader } from '@/components/chat/chat-header';
import { ChatInterface } from '@/components/chat/chat-interface';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from '@/components/ui/skeleton';

const ChatHistorySidebar = dynamic(() => import('@/components/chat/chat-history-sidebar').then(mod => mod.ChatHistorySidebar), {
  loading: () => (
      <div className="w-full max-w-xs flex-col gap-4 p-2 hidden md:flex">
          <div className="flex justify-between items-center p-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-8" />
          </div>
          <div className="space-y-2 p-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
          </div>
      </div>
  ),
  ssr: false
});

const AppChatWidget = dynamic(() => import('@/components/app-chat/app-chat-widget').then(mod => mod.AppChatWidget), {
  ssr: false,
});


export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; convId: string | null }>({ isOpen: false, convId: null });

  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    if (savedConversations) {
      const parsedConvs = JSON.parse(savedConversations);
      if (parsedConvs.length > 0) {
        setConversations(parsedConvs);
      } else {
        setConversations(seedConversations);
      }
    } else {
      setConversations(seedConversations);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    const savedCurrentConversationId = localStorage.getItem('currentConversationId');
    if (savedCurrentConversationId && savedCurrentConversationId !== 'null' && conversations.some(c => c.id === savedCurrentConversationId)) {
      setCurrentConversationId(savedCurrentConversationId);
    } else if (conversations.length > 0) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations.length > 0]);


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

  const handleRenameConversation = (id: string, newTitle: string) => {
    if (!newTitle.trim()) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Conversation title cannot be empty.",
        });
        return;
    }
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title: newTitle } : c))
    );
    toast({
        title: "Success",
        description: "Conversation renamed.",
    });
  };

  const handleDeleteConversation = (id: string) => {
    setDeleteDialog({ isOpen: true, convId: id });
  };
  
  const confirmDelete = () => {
    if (deleteDialog.convId) {
      setConversations(prev => prev.filter(c => c.id !== deleteDialog.convId));
      if (currentConversationId === deleteDialog.convId) {
        const remainingConversations = conversations.filter(c => c.id !== deleteDialog.convId);
        if (remainingConversations.length > 0) {
          setCurrentConversationId(remainingConversations[0].id);
        } else {
          handleNewChat();
        }
      }
      toast({
          title: "Conversation Deleted",
          description: "The conversation has been removed.",
      });
    }
    setDeleteDialog({ isOpen: false, convId: null });
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    
    let currentMessages: Message[] = [];
    let targetConversationId = currentConversationId;

    const currentConv = conversations.find(c => c.id === targetConversationId);
    
    // If there is no current conversation or it has no messages, create a new one.
    if (!currentConv || currentConv.messages.length === 0) {
        const newId = targetConversationId && currentConv ? targetConversationId : `conv-${Date.now()}`;
        
        const newConversation: Conversation = {
            id: newId,
            title: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
            messages: [userMessage],
        };
        
        setConversations(prev => {
            const otherConversations = prev.filter(c => c.id !== newId);
            return [newConversation, ...otherConversations];
        });
        
        if (!currentConversationId || !currentConv) {
          setCurrentConversationId(newId);
        }
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
    <>
      <div className="flex h-screen bg-background text-foreground w-full">
        <ChatHistorySidebar
          conversations={conversations}
          activeConversationId={currentConversationId}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
          onRenameConversation={handleRenameConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        <main className="flex flex-1 flex-col min-w-0">
          <ChatHeader onNewChat={handleNewChat} />
          <ChatInterface
              messages={activeConversation?.messages || []}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="Ask Skyline Chat anything..."
          />
        </main>
      </div>
      <AlertDialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => setDeleteDialog({ isOpen, convId: deleteDialog.convId })}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete this conversation.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
      <AppChatWidget />
    </>
  );
}
