// src/app/posts/[slug]/page.tsx
import { getAllPostSlugs, getPostData, PostData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next'; // Metadata 型をインポート

// Props の型定義 (params に slug が含まれる)
type Props = {
  params: {
    slug: string;
  };
};

// (ビルド時) 静的に生成するパスを Next.js に伝える関数
export async function generateStaticParams() {
  const paths = getAllPostSlugs();
  // 例: [{ slug: 'first-post' }, { slug: 'second-post' }] のような形式で返す
  // getAllPostSlugs は { params: { slug: '...' } } の形式で返すのでそのまま使える
  return paths;
}

// (リクエスト時またはビルド時) メタデータを動的に生成する関数
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostData(params.slug);
    return {
      title: post.title, // 記事タイトルをページの <title> に設定
      description: post.excerpt, // 抜粋を description に設定 (任意)
    };
  } catch (error) {
    // 記事が見つからない場合はデフォルトのメタデータやエラー処理
    return {
      title: '記事が見つかりません',
    };
  }
}

// 記事詳細ページのコンポーネント本体 (async 関数)
export default async function PostPage({ params }: Props) {
  const slug = params.slug;

  try {
    // URL の slug に基づいて記事データを取得
    const post: PostData = await getPostData(slug);

    return (
      <article className="prose lg:prose-xl max-w-none"> {/* Tailwind Typography を適用 */}
        {/* 記事タイトル */}
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">{post.title}</h1>
        {/* 投稿日などのメタ情報 */}
        <div className="text-gray-500 text-sm mb-8">
          <span>{post.date}</span>
          {post.author && <span> by {post.author}</span>}
        </div>

        {/* Markdown から変換された HTML コンテンツ */}
        <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
      </article>
    );
  } catch (error) {
    // getPostData でファイルが見つからないなどのエラーが発生した場合
    // (例えば、存在しないスラッグの URL にアクセスされた場合)
    console.error(`Error fetching post data for slug: ${slug}`, error);
    notFound(); // Next.js の 404 ページを表示させる
  }
}