import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppChatWidget } from '@/components/app-chat/app-chat-widget';

export const metadata: Metadata = {
  title: 'Skyline Higher Secondary School',
  description: 'A conversational AI chatbot for Skyline Higher Secondary School.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex flex-1">
            {children}
          </div>
        </SidebarProvider>
        <AppChatWidget />
        <Toaster />
      </body>
    </html>
  );
}
