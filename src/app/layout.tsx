import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import "../lib/fontawersome";
import AppFrame from './AppFrame';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en"  className="mdl-js">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
