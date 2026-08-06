"use client";

import { useRouter } from "next/navigation";
import { tarayiciIstemcisi } from "@/lib/supabase-tarayici";

export function CikisButonu() {
  const router = useRouter();

  async function cik() {
    await tarayiciIstemcisi().auth.signOut();
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={cik}
      className="mt-2 font-sans text-xs text-bone/50 underline underline-offset-4 transition-colors hover:text-brass"
    >
      Çıkış yap
    </button>
  );
}
