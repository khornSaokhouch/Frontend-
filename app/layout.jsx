// src/app/layout.jsx

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Service Booker',
  description: 'Book amazing services',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en"  data-gptw="">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
