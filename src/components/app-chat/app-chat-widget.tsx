
'use client';

import { useState } from 'react';
import { MessageCircle, SendHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import type { Message } from '@/lib/types';
import { getAppKnowledgeResponse } from '@/app/actions';
import { ScrollArea } from '../ui/scroll-area';
import { ChatMessage } from '@/components/chat/chat-message';
import { ChatInput } from '@/components/chat/chat-input';

export function AppChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const toggleOpen = () => {
    setIsOpen(prev => !prev);
    if (!isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: "Hi! I'm your app expert. Ask me anything about this application's features or code." }]);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (isLoading || !text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const loadingMessage: Message = { role: 'assistant', content: '...' };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await getAppKnowledgeResponse({ question: text });
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
      <div className="fixed bottom-24 right-6 z-50">
        <Button 
          onClick={toggleOpen} 
          size="icon" 
          className="w-14 h-14 rounded-full shadow-lg"
          aria-label={isOpen ? "Close App Assistant" : "Open App Assistant"}
        >
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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "circOut" }}
            className="fixed bottom-40 right-6 z-50 w-full max-w-sm"
          >
            <Card className="h-[32rem] flex flex-col shadow-xl">
              <CardHeader className="border-b">
                <CardTitle className="text-base">App Assistant</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                 <div className="flex flex-col h-full">
                    <ScrollArea className="flex-1">
                        <div className="p-4 space-y-4">
                            {messages.map((msg, index) => (
                                <ChatMessage key={index} message={msg} />
                            ))}
                        </div>
                    </ScrollArea>
                    <ChatInput 
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        placeholder="Ask about the app..."
                    />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
