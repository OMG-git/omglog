// src/components/Footer.tsx
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="bg-gray-200 text-gray-600 p-4 mt-8">
        <div className="container mx-auto text-center text-sm">
          © {currentYear} OMGlog. All Rights Reserved. {/* ← ブログタイトルに合わせる */}
        </div>
      </footer>
    );
  }