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
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
