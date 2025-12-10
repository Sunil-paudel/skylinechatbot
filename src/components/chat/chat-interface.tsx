
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SendHorizontal } from 'lucide-react';

import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/chat/chat-message';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    onSendMessage(data.message);
    form.reset();
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = event.currentTarget;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat History */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className={cn("p-4 md:p-6 space-y-6 pb-24", messages.length === 0 && "flex flex-col h-full")}>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          ) : (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground m-auto">
                <div className="p-8 border-2 border-dashed rounded-full bg-card">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-12 w-12 text-primary"><path d="M12 22a6 6 0 0 0 6-6V9a6 6 0 0 0-12 0v7a6 6 0 0 0 6 6Z"/><path d="M12 18a2 2 0 0 0-2-2v-2a4 4 0 0 1 8 0v2a2 2 0 0 0-2 2Z"/><path d="M12 6V4"/><path d="M6 8V6"/><path d="M18 8V6"/></svg>
                </div>
                <h2 className="mt-6 text-2xl font-bold font-headline text-foreground">Welcome to AetherChat</h2>
                <p className="mt-2 max-w-md">Start a conversation by typing a message below. The AI assistant is ready to help you.</p>
             </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 bg-card border-t relative">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-3">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder={placeholder}
                      className="resize-none min-h-[44px] max-h-48 pr-20"
                      rows={1}
                      {...field}
                      ref={textareaRef}
                      onKeyDown={handleKeyDown}
                      onInput={handleInput}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isLoading || !form.formState.isValid} className="h-11 w-11 shrink-0">
              <SendHorizontal className="w-5 h-5" />
              <span className="sr-only">Send Message</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
