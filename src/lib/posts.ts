// src/lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
// rehype 系プラグインをインポート
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';

// _posts ディレクトリのパスを取得
const postsDirectory = path.join(process.cwd(), '_posts');

// 型定義: Front Matter の型
export interface PostFrontMatter {
  title: string;
  date: string; // または Date 型
  author?: string; // 任意
  tags?: string[]; // 任意 (タグ機能で利用)
  excerpt?: string; // 任意
}

// 型定義: 記事データ全体の型（Front Matter + slug + contentHtml）
export interface PostData extends PostFrontMatter {
  slug: string;
  contentHtml: string;
}

// 型定義: 記事一覧用のデータ型（Front Matter + slug + tags）
export interface PostMeta extends PostFrontMatter {
  slug: string;
  // tags?: string[]; // PostFrontMatter に含まれるので必須ではないが、明示
}

// 全記事のメタデータとスラッグを取得し、日付で降順ソートする関数
export function getSortedPostsData(): PostMeta[] {
  // _posts ディレクトリ内のファイル名を取得
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // ファイル名から '.md' を削除してスラッグを取得
    const slug = fileName.replace(/\.md$/, '');

    // Markdown ファイルを文字列として読み込む
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // gray-matter で Front Matter を解析
    const matterResult = matter(fileContents);

    // スラッグと Front Matter データを結合 (tags も含まれる)
    return {
      slug,
      ...(matterResult.data as PostFrontMatter), // 型アサーション
    };
  });

  // 投稿を日付でソート (新しい順)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 指定されたスラッグの記事データを取得する関数
export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // gray-matter で Front Matter を解析
  const matterResult = matter(fileContents);

  // remark -> rehype -> highlight -> stringify の順で処理
  const processedContent = await remark()
    .use(remarkRehype) // remark AST を rehype AST (HTML) に変換
    .use(rehypeHighlight, { /* オプションがあればここに追加 */ }) // rehype AST 上でハイライト処理
    .use(rehypeStringify) // rehype AST を HTML 文字列に変換
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // スラッグ、Front Matter、HTMLコンテンツを結合して返す
  return {
    slug,
    contentHtml,
    ...(matterResult.data as PostFrontMatter), // 型アサーション
  };
}

// 全記事のスラッグ（ファイル名）を取得する関数 (動的ルート生成用)
export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  // [{ params: { slug: 'first-post' } }, { params: { slug: '...' } }] の形式で返す
  return fileNames.map((fileName) => {
    return {
      params: {
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

// --- タグ関連の関数 (ステップ10で追加) ---

// すべてのユニークなタグを取得する関数
export function getAllTags(): string[] {
  const allPosts = getSortedPostsData(); // 全記事のメタデータを取得
  const tags = new Set<string>(); // 重複を避けるために Set を使用

  allPosts.forEach(post => {
    if (post.tags) { // post.tags が存在する場合のみ処理
      post.tags.forEach(tag => tags.add(tag));
    }
  });

  // Set を配列に変換して返す
  return Array.from(tags).sort(); // アルファベット順にソート (任意)
}

// 指定されたタグを持つ記事のメタデータを取得する関数
export function getPostsByTag(tag: string): PostMeta[] {
  const allPosts = getSortedPostsData(); // 全記事のメタデータを取得

  // 指定されたタグを tags 配列に含んでいる記事のみをフィルタリング
  const filteredPosts = allPosts.filter(post =>
    post.tags?.includes(tag) // post.tags が存在し、かつ tag を含んでいるか
  );

  return filteredPosts; // フィルタリングされた記事リストを返す (日付順は維持される)
}