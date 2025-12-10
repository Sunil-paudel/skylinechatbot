
"use client";

import * as React from 'react';
import { PlusCircle, MessageSquare, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
} from '@/components/ui/sidebar';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';


type ChatHistorySidebarProps = {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onDeleteConversation: (id: string) => void;
};

export function ChatHistorySidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
}: ChatHistorySidebarProps) {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [tempTitle, setTempTitle] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  const handleStartEditing = (id: string, title: string) => {
    setEditingId(id);
    setTempTitle(title);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setTempTitle('');
  };

  const handleSaveRename = () => {
    if (editingId) {
      onRenameConversation(editingId, tempTitle);
      handleCancelEditing();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelEditing();
    }
  };


  return (
    <Sidebar className="w-full max-w-xs flex flex-col">
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
                <div 
                    key={conversation.id}
                    className={cn(
                        "group w-full flex items-center justify-between gap-2 rounded-md h-auto py-2 px-3 text-sm font-medium text-sidebar-foreground transition-colors",
                        conversation.id === activeConversationId && "bg-sidebar-accent text-sidebar-accent-foreground",
                        editingId !== conversation.id && "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                >
                    {editingId === conversation.id ? (
                      <Input
                        ref={inputRef}
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={handleSaveRename}
                        onKeyDown={handleKeyDown}
                        className="h-8 flex-1"
                      />
                    ) : (
                      <>
                        <button
                          className="flex items-center gap-2 text-left flex-1 truncate"
                          onClick={() => onSelectConversation(conversation.id)}
                        >
                          <MessageSquare className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1">{conversation.title}</span>
                        </button>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleStartEditing(conversation.id, conversation.title)}>
                            <Pencil className="w-4 h-4"/>
                            <span className="sr-only">Rename</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDeleteConversation(conversation.id)}>
                            <Trash2 className="w-4 h-4"/>
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </>
                    )}
                </div>
            ))}
            </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}

