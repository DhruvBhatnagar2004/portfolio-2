import { Inter } from 'next/font/google';
import './globals.css';
import { pressStart2P } from '@/utils/fonts';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'Dino Portfolio',
  description: 'A creative portfolio with Chrome Dino game integration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${pressStart2P.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
