import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import Providers from './providers';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700']
});

export const metadata: Metadata = {
  title: 'Dog Matcher',
  description: 'Find your perfect dog match with our dog matching application.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ all: 'unset' }}>
      <body
        className={`${roboto.variable}`}
        style={{ all: 'unset', fontFamily: 'var(--font-roboto)' }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
