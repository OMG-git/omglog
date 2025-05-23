// src/app/page.tsx
import Link from 'next/link';
import { getSortedPostsData, PostMeta } from '@/lib/posts'; // 関数と型をインポート

// Home コンポーネントを async 関数に変更
export default async function Home() {
  // サーバーサイドで記事データを取得
  const allPostsData: PostMeta[] = getSortedPostsData();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">最新の記事</h1>
      <section>
        <ul>
          {allPostsData.map(({ slug, date, title, excerpt }) => (
            <li key={slug} className="mb-6 border-b pb-4"> {/* 各記事項目 */}
              <h2 className="text-xl font-semibold mb-1">
                {/* 記事タイトルを記事詳細ページへのリンクにする */}
                <Link href={`/posts/${slug}`} className="hover:text-blue-600">
                  {title}
                </Link>
              </h2>
              <p className="text-sm text-gray-600 mb-2">{date}</p> {/* 投稿日 */}
              {excerpt && <p className="text-gray-700">{excerpt}</p>} {/* 抜粋があれば表示 */}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}