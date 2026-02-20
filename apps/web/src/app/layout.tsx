import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance Platform',
  description: 'Cloud-Powered Regulatory Compliance Platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
