import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from '@/components/ui/sidebar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'Skyline Higher Secondary School',
    template: `%s | Skyline Higher Secondary School`,
  },
  description: 'A conversational AI chatbot for Skyline Higher Secondary School, powered by Next.js and Google Gemini.',
  keywords: ['Skyline Higher Secondary School', 'AI Chatbot', 'Student Assistant', 'Next.js', 'Gemini'],
  openGraph: {
    title: 'Skyline Higher Secondary School',
    description: 'A conversational AI chatbot for students and staff.',
    type: 'website',
    url: 'https://skyline-chat.example.com', // Replace with your actual domain
    images: [
      {
        url: 'https://picsum.photos/seed/skyline-og/1200/630', // Placeholder OG image
        width: 1200,
        height: 630,
        alt: 'Skyline Higher Secondary School AI Chatbot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skyline Higher Secondary School',
    description: 'A conversational AI chatbot for students and staff.',
    images: ['https://picsum.photos/seed/skyline-twitter/1200/600'], // Placeholder Twitter card image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex flex-1">
            {children}
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
