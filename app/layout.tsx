import type { Metadata } from 'next';

import { GlobalQuery } from '@/components/global/global-query';
import { BaseLayout } from '@/components/layout/base-layout';

import './globals.css';

export const metadata: Metadata = {
  title: 'AnyMM',
  description: 'AnyMM',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <GlobalQuery>
          <BaseLayout>{children}</BaseLayout>
        </GlobalQuery>
      </body>
    </html>
  );
}
