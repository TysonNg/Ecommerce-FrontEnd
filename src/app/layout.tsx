import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";
import { Header } from "../shared/header";
import { Footer } from "@/shared/footer";
import "../lib/fontawersome";
import { InitGuestId } from "@/features/users/actions/initGuestId";
import { GlobalProvider } from "./context/GloBalProvider";
import LoginModal from "@/features/users/compornents/modalToAccess/LoginModal";

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
      <GlobalProvider>
        <div className="site">
          <InitGuestId />
          <Header />
          {children}
          <LoginModal />
          <Footer />
        </div>
      </GlobalProvider>
      </body>
    </html>
  );
}
