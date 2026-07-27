import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Capsule — Class Memory Archive',
  description: 'A premium, private digital yearbook and memory capsule exclusively for a graduating high-school class.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#F4E6CD] selection:text-[#1D1C1A]">
        {children}
      </body>
    </html>
  );
}
