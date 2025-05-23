// src/app/tags/page.tsx
import Link from 'next/link';
import { getAllTags } from '@/lib/posts'; // getAllTags 関数をインポート
import type { Metadata } from 'next';

// タグ一覧ページのメタデータ
export const metadata: Metadata = {
  title: 'タグ一覧',
  description: 'ブログ内のすべてのタグ一覧です。',
};

// タグ一覧ページのコンポーネント (非同期処理は不要)
export default function TagsPage() {
  // すべてのタグを取得
  const tags = getAllTags();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">タグ一覧</h1>
      {tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2"> {/* タグを横並びに */}
          {tags.map((tag) => (
            <li key={tag}>
              <Link
                href={`/tags/${encodeURIComponent(tag)}`} // タグ名をURLエンコードしてパスに含める
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded-full text-sm" // タグのスタイル
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>タグがありません。</p> // タグが一つもない場合の表示
      )}
    </div>
  );
}