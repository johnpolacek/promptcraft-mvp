import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
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
  title: "PromptCraft – AI Coding Prompt Discovery & Sharing",
  description: "Discover, share, and favorite AI coding prompts. Powered by Clerk and GibsonAI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}>
          <header className="flex items-center justify-between px-6 h-16 border-b bg-white">
            <nav className="flex gap-4 items-center" aria-label="Main navigation">
              <Link href="/" className="font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} aria-label="Home">PromptCraft</Link>
              <Link href="/browse" className="focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} aria-label="Browse Prompts">Browse</Link>
              <Link href="/share" className="focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} aria-label="Share Prompt">Share</Link>
              <Link href="/favorites" className="focus:outline-none focus:ring-2 focus:ring-blue-500" tabIndex={0} aria-label="Favorites">Favorites</Link>
            </nav>
            <div className="flex gap-2 items-center">
              <SignedOut>
                <SignInButton mode="modal" />
                <SignUpButton mode="modal" />
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
          <main className="max-w-3xl mx-auto w-full py-8 px-4">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
