"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { tarayiciIstemcisi } from "@/lib/supabase-tarayici";

/**
 * Panel girişi.
 *
 * Kayıt olma yok — kullanıcı Supabase panelinden elle ekleniyor. Açık kayıt
 * formu bırakmak, yönetim paneline herkesin hesap açabilmesi demek olurdu.
 */
export function GirisFormu() {
  const router = useRouter();
  const [eposta, setEposta] = useState("");
  const [sifre, setSifre] = useState("");
  const [hata, setHata] = useState("");
  const [bekliyor, setBekliyor] = useState(false);

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setBekliyor(true);

    const db = tarayiciIstemcisi();
    const { error } = await db.auth.signInWithPassword({
      email: eposta,
      password: sifre,
    });

    if (error) {
      // Hangi alanın yanlış olduğunu söylemiyoruz: e-postanın kayıtlı olup
      // olmadığını sızdırmak saldırgana bilgi verir.
      setHata("E-posta veya şifre hatalı.");
      setBekliyor(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form onSubmit={gonder} className="w-full max-w-sm">
        <h1 className="font-display text-3xl tracking-tight text-bone">
          Kokology Yönetim
        </h1>
        <p className="mt-2 font-sans text-sm text-bone/50">
          Devam etmek için giriş yap.
        </p>

        <label className="mt-8 block">
          <span className="font-sans text-xs font-semibold tracking-[0.15em] text-bone/50 uppercase">
            E-posta
          </span>
          <input
            type="email"
            required
            autoComplete="username"
            value={eposta}
            onChange={(e) => setEposta(e.target.value)}
            className="mt-2 min-h-[48px] w-full rounded-sm border border-bone/20 bg-soot px-4 font-sans text-base text-bone outline-none focus:border-brass"
          />
        </label>

        <label className="mt-5 block">
          <span className="font-sans text-xs font-semibold tracking-[0.15em] text-bone/50 uppercase">
            Şifre
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            className="mt-2 min-h-[48px] w-full rounded-sm border border-bone/20 bg-soot px-4 font-sans text-base text-bone outline-none focus:border-brass"
          />
        </label>

        {hata && (
          <p role="alert" className="mt-4 font-sans text-sm text-red">
            {hata}
          </p>
        )}

        <button
          type="submit"
          disabled={bekliyor}
          className="mt-7 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-red px-8 font-sans text-base font-semibold text-bone transition-colors hover:bg-brass hover:text-charcoal disabled:opacity-50"
        >
          {bekliyor ? "Giriş yapılıyor…" : "Giriş yap"}
        </button>
      </form>
    </div>
  );
}
