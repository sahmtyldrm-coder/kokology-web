import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { StickyCTA } from "@/components/StickyCTA";
import { Hero } from "@/components/Hero";
import { Manifesto } from "@/components/Manifesto";
import { Menu } from "@/components/Menu";
import { Space } from "@/components/Space";
import { Heritage } from "@/components/Heritage";
import { Culture } from "@/components/Culture";
import { Faq } from "@/components/Faq";
import { FindUs } from "@/components/FindUs";
import { Footer } from "@/components/Footer";
import { a11y } from "@/content/tr";
import { homeSchema, jsonLdString } from "@/lib/schema";

/**
 * Tek scroll — "scroll = yürüyüş".
 * Sokaktan kapıya, ateşe, kültüre, masaya: bölüm sırası bu yolculuğu izler.
 */
export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />

      <main id="icerik" aria-label={a11y.mainLandmark} className="flex-1">
        <Hero />
        <Manifesto />
        <Menu />
        <Space />
        <Heritage />
        <Culture />
        <Faq />
        <FindUs />
      </main>

      <Footer />
      <StickyCTA />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(homeSchema()) }}
      />
    </>
  );
}
