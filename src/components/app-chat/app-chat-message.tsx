import { Bot, User } from 'lucide-react';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function AppChatMessage({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const isLoading = message.content === '...';

  return (
    <div className={cn('flex items-start gap-3 text-sm', isUser && 'justify-end')}>
      {!isUser && (
        <Avatar className="w-8 h-8 border">
          <AvatarFallback className="bg-card">
            <Bot className="w-5 h-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'px-3 py-2 rounded-lg max-w-[85%] break-words shadow-sm',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-none'
            : 'bg-card text-card-foreground border rounded-bl-none'
        )}
      >
        {isLoading ? (
            <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-0"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-200"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse delay-400"></span>
            </div>
        ) : (
          message.content
        )}
      </div>
      {isUser && (
        <Avatar className="w-8 h-8 border">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
