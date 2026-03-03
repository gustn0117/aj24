import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AJ24 — 프리미엄 쇼핑",
  description: "매가히트 상품들을 최저가로 만나보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
