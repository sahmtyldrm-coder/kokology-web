/**
 * Çerez onayı — okuma ve yazma.
 *
 * Onay bir çerezde tutuluyor, localStorage'da değil: sunucunun da okuyabilmesi
 * gerekiyor. localStorage yalnızca tarayıcıda görünür ve sunucu tarafında
 * render edilen sayfa, izleme kodlarını basıp basmayacağını bilemezdi —
 * kodlar bir an görünüp sonra kaybolurdu.
 */

export const ONAY_CEREZI = "kokology-cerez-onayi";
export type OnayDurumu = "kabul" | "ret" | null;

/** Altı ay: KVKK için makul bir süre, her ziyarette sormaz. */
const SURE_GUN = 180;

export function onayOku(cerezMetni: string): OnayDurumu {
  const eslesme = cerezMetni.match(
    new RegExp(`(?:^|;\\s*)${ONAY_CEREZI}=(kabul|ret)`),
  );
  return (eslesme?.[1] as OnayDurumu) ?? null;
}

export function onayYaz(durum: Exclude<OnayDurumu, null>) {
  const bitis = new Date(Date.now() + SURE_GUN * 24 * 60 * 60 * 1000);
  // SameSite=Lax: çerez yalnızca kendi sitemizde okunur.
  document.cookie =
    `${ONAY_CEREZI}=${durum}; path=/; expires=${bitis.toUTCString()}; SameSite=Lax`;
}

/* -------------------------------------------------------------------------- */

/**
 * `useSyncExternalStore` için küçük bir depo.
 *
 * Çerez tarayıcıya özgü bir değer; efekt içinde okuyup state'e yazmak yerine
 * React'in bu iş için tasarladığı primitifi kullanıyoruz. Sunucu anlık
 * görüntüsü `undefined` döner: statik HTML'de ne bant ne piksel basılır,
 * karar hidrasyondan sonra verilir. Sunucuda "karar verilmemiş" varsaymak,
 * daha önce seçim yapmış ziyaretçiye bandı bir an gösterirdi.
 */
const dinleyiciler = new Set<() => void>();

export function onayAbone(dinleyici: () => void) {
  dinleyiciler.add(dinleyici);
  return () => {
    dinleyiciler.delete(dinleyici);
  };
}

let sonDeger: OnayDurumu | undefined;

export function onayAnlik(): OnayDurumu {
  const okunan = onayOku(document.cookie);
  // Referans kararlılığı: aynı değer için aynı sonucu döndürmezsek
  // useSyncExternalStore sonsuz döngüye girer.
  if (sonDeger !== okunan) sonDeger = okunan;
  return sonDeger;
}

export function onaySunucuAnlik(): undefined {
  return undefined;
}

/** Karar verildiğinde çerezi yaz ve aboneleri uyar. */
export function onayKaydet(durum: Exclude<OnayDurumu, null>) {
  onayYaz(durum);
  sonDeger = durum;
  dinleyiciler.forEach((d) => d());
}
