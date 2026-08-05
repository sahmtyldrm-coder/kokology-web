import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MenuSections } from "@/components/MenuSections";
import { menu, business, findUs } from "@/content/tr";
import { menuPage } from "@/content/menu-page";
import { primaryAction } from "@/lib/schema";

/**
 * QR MENÜ — masadan okutulan sürüm.
 *
 * Tasarım kararları buradaki kullanım senaryosundan çıkıyor: müşteri masada,
 * telefonda, muhtemelen zayıf bir bağlantıda ve fiyata bakmak istiyor.
 * Bu yüzden hero yok, parallax yok, kategori görselleri yok — sadece liste,
 * üstte hızlı geçiş için kategori sekmeleri.
 *
 * `noindex`: içerik /menu ile aynı. İki sayfanın arama sonuçlarında birbiriyle
 * yarışmaması için asıl hedef /menu olarak işaretlenir.
 */
export const metadata: Metadata = {
  title: "QR Menü",
  description: menuPage.description,
  alternates: { canonical: "/menu" },
  robots: { index: false, follow: true },
};

export default function QrMenuPage() {
  const action = primaryAction();

  return (
    <main className="flex-1 bg-charcoal pb-20">
      {/* Başlık — sade, tek satır */}
      <header className="border-b border-bone/10 px-5 py-5">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src="/logo-kokology.png"
            alt=""
            aria-hidden
            width={40}
            height={34}
            priority
            className="w-auto"
            style={{ height: 34 }}
          />
          <span className="font-display text-xl leading-none tracking-tight text-bone">
            {business.name}
          </span>
        </Link>
      </header>

      {/* Kategori sekmeleri — yatay kaydırılır, sayfa yatay kaymaz */}
      <nav
        aria-label="Menü kategorileri"
        className="sticky top-0 z-20 -mx-px border-b border-bone/10 bg-charcoal/95 backdrop-blur-md"
      >
        <ul className="flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {menu.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#menu-${section.id}`}
                className="inline-flex min-h-[44px] items-center rounded-full border border-bone/20 px-4 font-sans text-sm whitespace-nowrap text-bone/80 transition-colors hover:border-brass hover:text-brass"
              >
                {section.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-5 pt-8">
        <h1 className="font-display text-3xl text-bone">{menuPage.h1}</h1>
        <p className="mt-2 font-sans text-sm text-bone/50">{menuPage.qrNote}</p>

        {/* Tek sütun, görselsiz: masada hız her şeyden önemli */}
        <MenuSections
          headingLevel="h2"
          showImages={false}
          columns={1}
          className="mt-10"
        />

        <p className="mt-8 font-sans text-sm text-bone/40">{menu.priceNote}</p>

        <div className="mt-10 flex flex-col gap-3">
          <a
            href={action.href}
            {...(action.label === "order" && {
              target: "_blank",
              rel: "noopener noreferrer",
            })}
            className="inline-flex min-h-[56px] items-center justify-center rounded-full bg-red px-8 font-sans text-base font-semibold text-bone"
          >
            {findUs.callCta}
          </a>
          <Link
            href="/"
            className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-bone/25 px-8 font-sans text-base font-medium text-bone"
          >
            {menuPage.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
