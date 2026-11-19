import { Figtree } from 'next/font/google';
import './globals.css';

const font = Figtree({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Hospital Staff Portal',
  description: 'Staff, attendance aur salary management',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  );
}
