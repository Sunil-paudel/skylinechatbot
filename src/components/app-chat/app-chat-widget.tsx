'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, SendHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import type { Message } from '@/lib/types';
import { getAppKnowledgeResponse } from '@/app/actions';
import { AppChatMessage } from './app-chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export function AppChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen(prev => !prev);
    if (!isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: "Hi! I'm your app expert. Ask me anything about this application's features or code." }]);
    }
  };
  
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const loadingMessage: Message = { role: 'assistant', content: '...' };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await getAppKnowledgeResponse({ question: input });
      const aiMessage: Message = { role: 'assistant', content: response.answer };
      
      setMessages(prev => {
        const newMessages = prev.slice(0, -1);
        newMessages.push(aiMessage);
        return newMessages;
      });

    } catch (error) {
      console.error("Error getting app knowledge response:", error);
      const errorMessage: Message = { role: 'assistant', content: "Sorry, I couldn't get an answer. Please try again." };
      setMessages(prev => {
        const newMessages = prev.slice(0, -1);
        newMessages.push(errorMessage);
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={toggleOpen} size="icon" className="w-14 h-14 rounded-full shadow-lg">
          <AnimatePresence>
            {isOpen ? (
              <motion.div
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: -90, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: 90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                exit={{ rotate: 90, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50"
          >
            <Card className="w-80 h-96 flex flex-col shadow-xl">
              <CardHeader className="border-b">
                <CardTitle className="text-base">App Assistant</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <AppChatMessage key={index} message={msg} />
                        ))}
                    </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-2 border-t">
                <form onSubmit={handleSendMessage} className="flex w-full items-start gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about the app..."
                    className="resize-none text-sm min-h-[38px] max-h-24"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    disabled={isLoading}
                  />
                  <Button type="submit" size="icon" className="w-9 h-9 shrink-0" disabled={isLoading}>
                    <SendHorizontal className="w-4 h-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
