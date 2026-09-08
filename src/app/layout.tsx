import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BALMANDAISA BY DAC — Live Cinematic Availability Presentation',
  description: 'Live real-time cinematic availability presentation for Balmandaisa by DAC. Full-screen automated showcase with Google Sheets live sync.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark bg-[#070b14] text-white">
      <body className="min-h-screen bg-[#070b14] text-white antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
