import { business } from "@/content/tr";

/**
 * Saat hesapları artık dışarıdan saat listesi alıyor.
 *
 * Sebebi: saatler panelden değiştirilebiliyor ve "şu an açık" rozeti bu
 * değişikliği görmek zorunda. Dosyadaki liste yalnızca varsayılan olarak
 * duruyor — veritabanı erişilemezse site yine doğru çalışsın diye.
 */
export type DayHours = {
  day: number;
  label: string;
  opens: string;
  closes: string;
  kapali?: boolean;
};

export const VARSAYILAN_SAATLER: DayHours[] = business.hours.map((h) => ({
  day: h.day,
  label: h.label,
  opens: h.opens,
  closes: h.closes,
}));

const TIMEZONE = "Europe/Istanbul";

/**
 * Ziyaretçinin cihaz saat dilimi ne olursa olsun İstanbul'daki yerel zamanı
 * verir. Yurt dışından bakan biri "kapalı" yazısını yanlış görmesin diye.
 */
function nowInIstanbul(): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIMEZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const weekdayIndex: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  // hour12:false bazı ortamlarda gece yarısını "24" olarak verir.
  const hour = Number(get("hour")) % 24;

  return {
    day: weekdayIndex[get("weekday")] ?? 0,
    minutes: hour * 60 + Number(get("minute")),
  };
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function hoursForDay(saatler: DayHours[], day: number): DayHours | undefined {
  const g = saatler.find((h) => h.day === day);
  return g && !g.kapali ? g : undefined;
}

export type OpenState =
  | { open: true; closesAt: string }
  | { open: false; opensAt: string | null };

/**
 * Şu anda açık mı? Kapanış saati açılıştan küçükse (ör. 11:00–02:00)
 * ertesi güne taşan vardiya olarak değerlendirilir.
 */
export function getOpenState(saatler: DayHours[] = VARSAYILAN_SAATLER): OpenState {
  const { day, minutes } = nowInIstanbul();

  const today = hoursForDay(saatler, day);
  if (today) {
    const opens = toMinutes(today.opens);
    const closes = toMinutes(today.closes);

    if (closes > opens) {
      if (minutes >= opens && minutes < closes) {
        return { open: true, closesAt: today.closes };
      }
    } else {
      // Gece yarısını aşan vardiya: bugünün açılışından gece yarısına kadar
      if (minutes >= opens) return { open: true, closesAt: today.closes };
    }
  }

  // Dünden sarkan vardiya hâlâ sürüyor olabilir
  const yesterday = hoursForDay(saatler, (day + 6) % 7);
  if (yesterday) {
    const opens = toMinutes(yesterday.opens);
    const closes = toMinutes(yesterday.closes);
    if (closes <= opens && minutes < closes) {
      return { open: true, closesAt: yesterday.closes };
    }
  }

  // Kapalı — bir sonraki açılışı bul (bugün henüz açılmadıysa bugün, yoksa ileri günler)
  if (today && minutes < toMinutes(today.opens)) {
    return { open: false, opensAt: today.opens };
  }
  for (let i = 1; i <= 7; i++) {
    const next = hoursForDay(saatler, (day + i) % 7);
    if (next) return { open: false, opensAt: next.opens };
  }
  return { open: false, opensAt: null };
}

/** Bugünün satırını vurgulamak için — sadece istemcide çağır. */
export function todayIndex(): number {
  return nowInIstanbul().day;
}

/** "11:00" → "11.00" (Türkçe saat gösterimi) */
export function formatTime(time: string): string {
  return time.replace(":", ".");
}

/** schema.org openingHoursSpecification — ISO gün adlarıyla */
const SCHEMA_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function openingHoursSpecification(saatler: DayHours[] = VARSAYILAN_SAATLER) {
  return saatler.filter((h) => !h.kapali).map((h) => {
    // `business.hours` `as const` olduğu için saatler literal tipe daralıyor;
    // string'e genişletmezsek aşağıdaki kontrol derlenmez.
    const closes: string = h.closes;
    return {
      "@type": "OpeningHoursSpecification" as const,
      dayOfWeek: `https://schema.org/${SCHEMA_DAYS[h.day]}`,
      opens: h.opens,
      // schema.org "24:00" kabul etmez; gece yarısı "23:59" olarak yazılır.
      closes: closes === "24:00" ? "23:59" : closes,
    };
  });
}
