import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-black bg-white text-black">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="font-semibold tracking-tight">AI Labs</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/analyze" className="hover:underline">Анализ</Link>
          <Link href="/dashboard" className="hover:underline">ЛК</Link>
          <Link href="/pricing" className="hover:underline">Тарифы</Link>
        </nav>
      </div>
    </header>
  );
}