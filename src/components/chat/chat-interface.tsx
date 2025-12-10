
'use client';

import * as React from 'react';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat/chat-message';
import { ChatInput } from './chat-input';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  placeholder = "Ask anything..."
}: ChatInterfaceProps) {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      {/* Chat History */}
      <ScrollArea className="flex-1">
        <div className={cn("p-4 md:p-6 space-y-6", messages.length === 0 && "flex flex-col h-full")}>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground m-auto">
                <div className="p-8 border-2 border-dashed rounded-full bg-card">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12 text-primary"><path d="M12 22a6 6 0 0 0 6-6V9a6 6 0 0 0-12 0v7a6 6 0 0 0 6 6Z"/><path d="M12 18a2 2 0 0 0-2-2v-2a4 4 0 0 1 8 0v2a2 2 0 0 0-2 2Z"/><path d="M12 6V4"/><path d="M6 8V6"/><path d="M18 8V6"/></svg>
                </div>
                <h2 className="mt-6 text-2xl font-bold font-headline text-foreground">Welcome to Skyline Chat</h2>
                <p className="mt-2 max-w-md">Start a conversation by typing a message below. The AI assistant is ready to help you.</p>
             </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <ChatInput 
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        placeholder={placeholder}
      />
    </div>
  );
}
