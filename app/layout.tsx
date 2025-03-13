import type { Metadata } from "next";
import { ThemeProvider } from 'next-themes';
import { Geist, Geist_Mono } from "next/font/google";
import AppProviders from "../components/Providers/AppProvider";
import ProtectedRoute from "../components/Providers/ProtectedRoute";
import "./globals.css";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "A perfect workspace ✨",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
              <AppProviders>
              <ProtectedRoute>
                {children}
              </ProtectedRoute>
              </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
