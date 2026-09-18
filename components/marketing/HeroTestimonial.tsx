"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useHeroSlideIndex } from "@/components/hooks/useHeroSlideIndex";
import type { Testimonial } from "@/types/homepage";
import styles from "@/components/marketing/HeroTestimonial.module.css";

/**
 * Guest quote on a parchment scroll (`public/images/home/pergament.png`). Changes with the hero slide (same
 * clock as the photo and headline) rather than on its own timer, so the
 * hero only ever changes in one beat.
 */
export function HeroTestimonial({
  testimonials,
  slideCount,
}: {
  testimonials: Testimonial[];
  slideCount: number;
}) {
  const activeIndex = useHeroSlideIndex(slideCount) % testimonials.length;
  const noteRef = useRef<HTMLElement>(null);
  const [unrolled, setUnrolled] = useState(false);

  // Start unrolling once the note is actually on screen: right away on
  // desktop (it overlays the hero), on scroll on mobile (it sits below the
  // photo, so a load-time animation would finish unseen).
  useEffect(() => {
    const note = noteRef.current;
    if (!note) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setUnrolled(true);
        observer.disconnect();
      },
      { threshold: 0.6 },
    );
    observer.observe(note);
    return () => observer.disconnect();
  }, []);

  return (
    <figure ref={noteRef} className={styles.note} aria-label="Guest testimonials">
      <div className={unrolled ? `${styles.paper} ${styles.unrolled}` : styles.paper}>
        <div className={styles.sheet}>
          <ScrollImage />
          <div className={styles.quotes}>
            {testimonials.map((testimonial, index) => (
              <blockquote
                key={testimonial.author}
                className={
                  index === activeIndex ? `${styles.quote} ${styles.active}` : styles.quote
                }
                aria-hidden={index !== activeIndex}
              >
                <p className={styles.text}>&ldquo;{testimonial.quote}&rdquo;</p>
                <footer className={styles.author}>
                  {testimonial.author}, {testimonial.origin}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
        {/* Each roll is the same image cropped (cover, pinned to its own side)
            to the outer 7.6%, travelling outward from the centre as the paper
            is revealed between them. */}
        <div className={`${styles.roll} ${styles.rollLeft}`} aria-hidden="true">
          <ScrollImage crop="left" />
        </div>
        <div className={`${styles.roll} ${styles.rollRight}`} aria-hidden="true">
          <ScrollImage crop="right" />
        </div>
      </div>
    </figure>
  );
}

function ScrollImage({ crop }: { crop?: "left" | "right" }) {
  return (
    <Image
      src="/images/home/pergament.png"
      alt=""
      fill
      sizes="416px"
      style={crop ? { objectFit: "cover", objectPosition: crop } : { objectFit: "fill" }}
    />
  );
}
