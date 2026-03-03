import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "온오프마켓 - ONOFF Market",
  description: "매가히트 상품들을 만나보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
