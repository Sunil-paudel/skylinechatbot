"use client";

import { PlusCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTitle,
} from '@/components/sidebar/chat-sidebar';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';


type ChatHistorySidebarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
};

export function ChatHistorySidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
}: ChatHistorySidebarProps) {
  return (
    <>
      <SidebarHeader>
        <SidebarTitle>Conversations</SidebarTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onNewChat}
        >
          <PlusCircle className="w-5 h-5" />
          <span className="sr-only">New Chat</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {conversations.map(conversation => (
            <SidebarMenuItem key={conversation.id}>
              <SidebarMenuButton
                className="w-full justify-start h-auto py-2 px-3"
                isActive={conversation.id === activeConversationId}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span className="truncate flex-1 text-left">{conversation.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
