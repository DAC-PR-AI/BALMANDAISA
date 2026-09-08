import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BALMANDAISA BY DAC — Live Cinematic Availability Presentation',
  description: 'Live real-time cinematic availability presentation for Balmandaisa by DAC. Full-screen automated showcase with Google Sheets live sync.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/branding/balmandaisa-icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/branding/balmandaisa-icon.png', sizes: '16x16', type: 'image/png' },
      { url: '/branding/balmandaisa-icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/branding/balmandaisa-icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
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
