import type { Metadata } from 'next';
import { Nunito, Bangers } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';
import { Toaster } from 'react-hot-toast';

const nunito = Nunito({ subsets: ['latin'], variable: '--font-body' });
const bangers = Bangers({ subsets: ['latin'], weight: '400', variable: '--font-display' });

export const metadata: Metadata = {
  title: 'ComicKid Studio 🎨',
  description: 'Create amazing comic books!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'ComicKid Studio',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png',      sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Explicit apple-touch-icon tag — belt AND suspenders */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <meta name="theme-color" content="#ffd23f"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-title" content="ComicKid"/>
      </head>
      <body className={`${nunito.variable} ${bangers.variable} font-body bg-amber-50 min-h-screen`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" toastOptions={{
            style: { fontFamily: 'var(--font-body)', fontWeight: 700, borderRadius: '12px' }
          }} />
        </AuthProvider>
      </body>
    </html>
  );
}
