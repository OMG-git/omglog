// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// highlight.js の CSS をインポート (ステップ9で追加)
import 'highlight.js/styles/github-dark.css'; // ← 好みのスタイルに変更可能

const inter = Inter({ subsets: ["latin"] });

// サイト全体のメタデータ (必要に応じて変更)
export const metadata: Metadata = {
  title: "My Tech Blog", // ← サイト全体のデフォルトタイトル
  description: "PCパーツやIT/AIに関する技術ブログ", // ← サイトの説明
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja"> {/* ← 日本語サイトなので lang="ja" に変更 */}
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen"> {/* 縦方向にflex、最小高さを画面いっぱいにする */}
          <Header /> {/* Headerコンポーネントを配置 */}
          {/* ↓ className に bg-white text-gray-900 を追加 (ステップ8.5) */}
          <main className="flex-grow container mx-auto p-4 bg-white text-gray-900"> {/* メインコンテンツエリア、残りの高さを埋める */}
            {children} {/* ← 各ページのコンテンツがここに表示される */}
          </main>
          <Footer /> {/* Footerコンポーネントを配置 */}
        </div>
      </body>
    </html>
  );
}