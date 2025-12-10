"use client";

import { SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

type ChatHeaderProps = {
  onNewChat: () => void;
};

export function ChatHeader({ onNewChat }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b shrink-0">
        <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-bold font-headline">AetherChat</h1>
        </div>
      <Button onClick={onNewChat} variant="ghost" size="icon" aria-label="New Chat">
        <SquarePen className="w-5 h-5" />
      </Button>
    </header>
  );
}
