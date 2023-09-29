import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Encrypted',
  description: 'End-to-End Chat Encryption App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className='light'>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
