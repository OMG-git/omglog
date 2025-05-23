// src/components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          OMGlog {/* ← ブログタイトルに変更してください */}
        </Link>
        <nav>
          {/* 必要に応じてナビゲーションリンクを追加 */}
          {/* <Link href="/about" className="ml-4">About</Link> */}
        </nav>
      </div>
    </header>
  );
}