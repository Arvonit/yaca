import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from '@next/font/google';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabase] = useState(() => createBrowserSupabaseClient());
  return (
    <main className={inter.className}>
      <SessionContextProvider supabaseClient={supabase} initialSession={pageProps.initialSession}>
        <Component {...pageProps} />
      </SessionContextProvider>
    </main>
  );
}
