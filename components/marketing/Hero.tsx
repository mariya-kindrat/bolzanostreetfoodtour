import Image from "next/image";
import { Kicker } from "@/components/ui/Kicker";
import { HeroSceneLoader } from "@/components/three/HeroSceneLoader";
import { TreeBranchOverlay } from "@/components/marketing/TreeBranchOverlay";
import { BrandBadge } from "@/components/marketing/BrandBadge";
import { HeroCategoryContent } from "@/components/marketing/HeroCategoryContent";
import { HeroTestimonial } from "@/components/marketing/HeroTestimonial";
import type { Testimonial } from "@/types/homepage";
import type { Category } from "@/lib/generated/prisma/client";

// Generic last-resort fallback if the Category table is ever empty (should
// never happen in practice — getActiveCategories always returns the seeded
// set — but the static photo needs *something* to render).
const FALLBACK_IMAGE = {
  src: "/images/home/hero-market.jpg",
  alt: "A bakery window in Bolzano's old town, hung with pretzels and stacked Schüttelbrot flatbread",
};

export function Hero({
  categories,
  testimonials,
}: {
  categories: Category[];
  testimonials: Testimonial[];
}) {
  const firstSlide = categories[0] ?? null;
  const slides = categories.map((category) => ({
    src: category.photoUrl,
    alt: category.altText,
  }));

  return (
    <section style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
          minHeight: "70vh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Stacking order, explicit and isolated per layer (the previous
          version put the photo at zIndex: -1 with no isolated stacking
          context, which pushed it behind the page background entirely —
          it was never actually visible): back photo -> 3D carousel -> branch
          -> text-contrast gradient -> headline content. The static photo
          matches slide 0 of the 3D carousel (both are categories[0]) so
          there's no visible jump once the canvas mounts and takes over. */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src={firstSlide?.photoUrl ?? FALLBACK_IMAGE.src}
            alt={firstSlide?.altText ?? FALLBACK_IMAGE.alt}
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <HeroSceneLoader slides={slides} />
        </div>
        <TreeBranchOverlay />
        <BrandBadge
          size={112}
          style={{ position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 4 }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            background: "linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 60%)",
          }}
        />
        <div
          style={{ position: "relative", zIndex: 4, padding: "3rem", maxWidth: "min(100%, 38rem)" }}
        >
          <Kicker onDark>Bozen · Bolzano — Altstadt</Kicker>
          <HeroCategoryContent categories={categories} />
        </div>
      </div>
      {testimonials.length > 0 && (
        <HeroTestimonial testimonials={testimonials} slideCount={categories.length} />
      )}
    </section>
  );
}
