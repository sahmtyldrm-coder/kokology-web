import Link from "next/link";

/**
 * Kırıntı yolu. Hem ziyaretçiye hem arama motoruna sayfanın site içindeki
 * yerini bildirir. Son öğe bağlantı değildir, `aria-current` ile işaretlenir.
 *
 * Yapısal veri karşılığı (BreadcrumbList) lib/schema.ts içinde ayrıca üretilir.
 */
export function Breadcrumb({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="Sayfa yolu">
      <ol className="flex flex-wrap items-center gap-2 font-sans text-sm text-bone/45">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-brass">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-bone/70">
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
