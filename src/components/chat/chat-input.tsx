"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { SendHorizontal } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

const formSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
});

type ChatInputProps = {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
};

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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
    <div className="p-4 bg-card border-t">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-3">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    placeholder="Ask AetherChat anything..."
                    className="resize-none min-h-[44px] max-h-48"
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
  );
}
