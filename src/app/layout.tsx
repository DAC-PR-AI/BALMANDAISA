import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BALMANDAISA BY DAC — Live Cinematic Availability Presentation',
  description: 'Live real-time cinematic availability presentation for Balmandaisa by DAC. Full-screen automated showcase with Google Sheets live sync.',
  icons: {
    icon: [
      { url: '/branding/balmandaisa-logo.png' },
      { url: '/branding/balmandaisa-logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/branding/balmandaisa-logo.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/branding/balmandaisa-logo.png',
    apple: '/branding/balmandaisa-logo.png',
  },
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
