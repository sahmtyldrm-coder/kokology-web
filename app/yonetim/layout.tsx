import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { CikisButonu } from "@/components/yonetim/CikisButonu";
import { sunucuIstemcisi, supabaseHazir } from "@/lib/supabase";

/**
 * Panel düzeni.
 *
 * Kök layout'un içine yerleşir — `<html>`/`<body>` orada tanımlı, burada
 * tekrarlanamaz. Marka fontları ve zemin zaten miras alınıyor.
 *
 * `noindex`: yönetim ekranları arama sonuçlarında görünmemeli.
 */
export const metadata: Metadata = {
  title: "Kokology Yönetim",
  robots: { index: false, follow: false },
};

const BOLUMLER = [
  { href: "/yonetim", label: "Özet" },
  { href: "/yonetim/menu", label: "Menü ve fiyatlar" },
  { href: "/yonetim/saatler", label: "Çalışma saatleri" },
  { href: "/yonetim/iletisim", label: "İletişim ve linkler" },
];

export default async function YonetimLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Supabase yapılandırılmadıysa giriş kontrolü yapılamaz; sayfa kendi
  // uyarısını gösterir.
  if (!supabaseHazir) return <>{children}</>;

  const db = await sunucuIstemcisi();
  const {
    data: { user },
  } = await db.auth.getUser();

  if (!user) return <>{children}</>;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col gap-8 px-5 py-8 lg:flex-row lg:gap-12 lg:py-12">
      <aside className="lg:w-56 lg:shrink-0">
        <Link
          href="/yonetim"
          className="font-display text-xl tracking-tight text-bone"
        >
          Kokology
        </Link>
        <p className="mt-1 font-sans text-xs text-bone/40">Yönetim</p>

        <nav className="mt-7">
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {BOLUMLER.map((b) => (
              <li key={b.href}>
                <Link
                  href={b.href}
                  className="block rounded-sm px-3 py-2 font-sans text-sm text-bone/70 transition-colors hover:bg-soot hover:text-brass"
                >
                  {b.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 border-t border-bone/10 pt-5">
          <p className="font-sans text-xs break-all text-bone/40">{user.email}</p>
          <CikisButonu />
          <Link
            href="/"
            className="mt-3 block font-sans text-xs text-bone/40 transition-colors hover:text-brass"
          >
            ← Siteyi gör
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
