import type { Blok } from "@/content/blog";

/**
 * Blog gövdesini render eder.
 *
 * Markdown yerine yapılandırılmış bloklar kullanılıyor: ayrıştırıcı bağımlılığı
 * yok, içerik tipli, ve Faz D'de admin paneli aynı şekli doğrudan veritabanına
 * yazabilecek.
 */
export function BlogBloklari({ bloklar }: { bloklar: Blok[] }) {
  return (
    <div className="max-w-[68ch]">
      {bloklar.map((blok, i) => {
        if (blok.tip === "baslik") {
          return (
            <h2
              key={i}
              className="font-display mt-12 mb-4 text-2xl text-brass sm:text-3xl"
            >
              {blok.metin}
            </h2>
          );
        }

        if (blok.tip === "liste") {
          return (
            <ul key={i} className="mt-5 space-y-3">
              {blok.ogeler.map((oge) => (
                <li
                  key={oge}
                  className="flex gap-3 font-sans text-base leading-relaxed text-bone/70"
                >
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" />
                  {oge}
                </li>
              ))}
            </ul>
          );
        }

        if (blok.tip === "alinti") {
          return (
            <blockquote key={i} className="mt-10 border-l-2 border-brass/50 pl-6">
              <p className="font-hand text-2xl text-brass sm:text-3xl">
                {blok.metin}
              </p>
            </blockquote>
          );
        }

        if (blok.tip === "not") {
          return (
            <aside
              key={i}
              className="mt-8 rounded-sm border border-bone/15 bg-soot/60 p-5"
            >
              <p className="font-sans text-sm leading-relaxed text-bone/60">
                {blok.metin}
              </p>
            </aside>
          );
        }

        return (
          <p
            key={i}
            className="mt-5 font-sans text-lg leading-[1.8] text-bone/75"
          >
            {blok.metin}
          </p>
        );
      })}
    </div>
  );
}
