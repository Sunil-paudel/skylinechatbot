
"use client";

import { PlusCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
} from '@/components/ui/sidebar';
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
        <SidebarGroup>
            <SidebarGroupLabel>Conversations</SidebarGroupLabel>
            <SidebarGroupAction asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onNewChat}
                    >
                    <PlusCircle className="w-5 h-5" />
                    <span className="sr-only">New Chat</span>
                </Button>
            </SidebarGroupAction>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
            {conversations.map(conversation => (
                <button
                    key={conversation.id}
                    className={cn(
                        "w-full flex items-center gap-2 rounded-md h-auto py-2 px-3 text-left text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        conversation.id === activeConversationId && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    onClick={() => onSelectConversation(conversation.id)}
                >
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1">{conversation.title}</span>
                </button>
            ))}
            </div>
        </ScrollArea>
      </SidebarContent>
    </>
  );
}
