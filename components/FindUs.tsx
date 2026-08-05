"use client";

import { useEffect, useState } from "react";
import { findUs, business, nav } from "@/content/tr";
import { getOpenState, todayIndex, formatTime, type OpenState } from "@/lib/hours";
import { primaryAction } from "@/lib/schema";
import { Reveal, WipeText } from "@/components/Reveal";

/**
 * Bölüm 7 — Kapı. Sitenin ticari olarak en önemli ekranı.
 * Mobilde tek başparmakla: ara, yol tarifi al, saatleri gör.
 */
export function FindUs({
  /** /bul-bizi sayfasında başlık H1 olarak sayfanın kendisinde duruyor */
  showHeading = true,
}: {
  showHeading?: boolean;
} = {}) {
  const action = primaryAction();

  /**
   * Açık/kapalı durumu sunucuda hesaplanmaz: sayfa statik üretildiği için
   * build anındaki cevap saatler sonra yanlış olurdu. İlk boyamada rozet
   * yerine boşluk bırakılır, mount sonrası gerçek durum yazılır.
   */
  const [state, setState] = useState<OpenState | null>(null);
  const [today, setToday] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => {
      setState(getOpenState());
      setToday(todayIndex());
    };
    tick();
    // Sekme uzun süre açık kalırsa rozet bayatlamasın
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="bul-bizi"
      className="relative scroll-mt-20 border-t border-bone/10 bg-charcoal py-20 md:py-28"
    >
      <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          {showHeading && (
            <>
              <p className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brass">
                {findUs.eyebrow}
              </p>
              <WipeText className="font-display mt-4 text-jumbo text-bone">
                {findUs.heading}
              </WipeText>
            </>
          )}
          <p className="mt-5 max-w-[46ch] font-serif text-lg leading-relaxed text-bone/70 italic">
            {findUs.lead}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
          {/* Bilgi sütunu */}
          <Reveal className="order-2 lg:order-1">
            <div className="flex flex-col gap-9">
              {/* Adres */}
              <div>
                <h3 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/45">
                  {findUs.addressLabel}
                </h3>
                <address className="mt-3 font-sans text-xl leading-relaxed text-bone not-italic sm:text-2xl">
                  {business.address.street}
                  <br />
                  {business.address.district}, {business.address.postalCode}{" "}
                  {business.address.town} / {business.address.city}
                </address>
                <p className="mt-2 font-sans text-base text-bone/50">
                  {business.address.landmark} içinde
                </p>
              </div>

              {/* Telefon */}
              <div>
                <h3 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/45">
                  {findUs.phoneLabel}
                </h3>
                <a
                  href={`tel:${business.phone.e164}`}
                  className="mt-3 inline-block font-sans text-xl text-bone underline decoration-brass/50 decoration-1 underline-offset-[6px] transition-colors hover:text-brass sm:text-2xl"
                >
                  {business.phone.display}
                </a>
              </div>

              {/* Saatler */}
              <div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <h3 className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-bone/45">
                    {findUs.hoursLabel}
                  </h3>
                  <OpenBadge state={state} />
                </div>

                <dl className="mt-4 divide-y divide-bone/10 border-y border-bone/10">
                  {business.hours.map((h) => {
                    const isToday = today === h.day;
                    return (
                      <div
                        key={h.day}
                        className={`flex items-baseline justify-between gap-4 py-2.5 font-sans text-base ${
                          isToday ? "text-bone" : "text-bone/55"
                        }`}
                      >
                        <dt className={isToday ? "font-semibold" : ""}>
                          {h.label}
                          {isToday && (
                            <span className="ml-2 text-xs text-brass">bugün</span>
                          )}
                        </dt>
                        <dd
                          className={`tabular-nums ${isToday ? "font-semibold" : ""}`}
                        >
                          {formatTime(h.opens)} – {formatTime(h.closes)}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </div>

              {/* Mekân olanakları — Google İşletme Profilindekilerle aynı */}
              <ul className="flex flex-wrap gap-2">
                {business.amenities.map((amenity) => (
                  <li
                    key={amenity}
                    className="rounded-full border border-bone/20 px-3.5 py-1.5 font-sans text-sm text-bone/70"
                  >
                    {amenity}
                  </li>
                ))}
              </ul>

              {/* Aksiyonlar — mobilde tam genişlik, dokunmatik hedef 56px */}
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={`tel:${business.phone.e164}`}
                  className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full bg-red px-8 font-sans text-base font-semibold text-bone transition-colors duration-200 hover:bg-brass hover:text-charcoal sm:flex-initial"
                >
                  {findUs.callCta}
                </a>
                <a
                  href={business.maps.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full border border-bone/25 px-8 font-sans text-base font-medium text-bone transition-colors duration-200 hover:border-brass hover:text-brass sm:flex-initial"
                >
                  {findUs.directionsCta}
                </a>
                {action.label === "order" && (
                  <a
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[56px] flex-1 items-center justify-center gap-2 rounded-full border border-bone/25 px-8 font-sans text-base font-medium text-bone transition-colors duration-200 hover:border-brass hover:text-brass sm:flex-initial"
                  >
                    {nav.cta.order}
                  </a>
                )}
              </div>
            </div>
          </Reveal>

          {/* Harita */}
          <Reveal className="order-1 lg:order-2" direction="right">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-bone/15 lg:aspect-[4/3.4]">
              <iframe
                src={business.maps.embedUrl}
                title={findUs.mapTitle}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                /* Hafif bir tonlama yeter: daha güçlü gri filtre kırmızı
                   konum pinini de soldurup haritayı işlevsiz bırakıyor. */
                className="absolute inset-0 h-full w-full brightness-[0.94] saturate-[0.92] transition-[filter] duration-500 hover:brightness-100 hover:saturate-100"
              />
            </div>
            <p className="mt-3 font-sans text-sm text-bone/45">
              {business.address.full}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Renk tek başına anlam taşımaz: nokta + metin birlikte durumu bildirir.
 * `state` null iken (mount öncesi) yüksekliği korur, düzen zıplamaz.
 */
function OpenBadge({ state }: { state: OpenState | null }) {
  if (!state) {
    return <span className="inline-block h-7" aria-hidden />;
  }

  const label = state.open
    ? `${findUs.openNow} · ${findUs.closesAt(formatTime(state.closesAt))}`
    : state.opensAt
      ? `${findUs.closedNow} · ${findUs.opensAt(formatTime(state.opensAt))}`
      : findUs.closedNow;

  return (
    <span
      role="status"
      className={`inline-flex h-7 items-center gap-2 rounded-full border px-3 font-sans text-xs font-medium ${
        state.open
          ? "border-brass/40 bg-brass/10 text-brass"
          : "border-bone/20 bg-bone/5 text-bone/60"
      }`}
    >
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full ${
          state.open ? "bg-brass" : "bg-bone/40"
        }`}
      />
      {label}
    </span>
  );
}
