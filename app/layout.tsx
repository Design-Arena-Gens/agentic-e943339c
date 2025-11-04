import type { Metadata } from "next";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Studio Promptia",
  description: "Assistente criativo para roteiros e prompts de IA para YouTube",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} gradient-bg min-h-screen`}>{children}</body>
    </html>
  );
}
