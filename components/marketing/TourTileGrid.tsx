import Image from "next/image";
import Link from "next/link";
import { LabelChip } from "@/components/ui/LabelChip";
import { computeTileLayout } from "@/lib/homepage/tileGridLayout";
import styles from "@/components/marketing/TourTileGrid.module.css";
import type { Tile } from "@/types/homepage";

const CATEGORY_LABEL: Record<Tile["category"], string> = {
  food: "Street Food",
  wine: "Wine",
  cooking: "Cooking",
  winter: "Winter",
};

export function TourTileGrid({ tiles }: { tiles: Tile[] }) {
  const tileLayout = computeTileLayout(tiles.length);

  return (
    <div id="discover-our-tours" className={styles.grid}>
      {tiles.map((tile, i) => {
        const layout = tileLayout[i];
        return (
          <div
            key={tile.href}
            className={styles.tile}
            style={{
              gridColumn: `${layout.colStart} / span ${layout.colSpan}`,
              gridRow: `${layout.rowStart} / span ${layout.rowSpan}`,
            }}
          >
            <Link href={tile.href} className={styles.link}>
              {tile.image ? (
                <Image
                  src={tile.image}
                  alt=""
                  fill
                  className={styles.photo}
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              ) : (
                <div className={`${styles.placeholder} ${styles[tile.category]}`} />
              )}
              <div className={styles.scrim} aria-hidden="true" />
              <span className={styles.title}>{tile.title}</span>
            </Link>
            {/* top-right, not bottom-left: the tile title is bottom-anchored
                (see .link's align-items: flex-end) — a bottom-left chip
                would sit in the same corner and occlude the title text. */}
            <LabelChip
              number={String(i + 1).padStart(2, "0")}
              label={CATEGORY_LABEL[tile.category]}
              corner="top-right"
            />
          </div>
        );
      })}
    </div>
  );
}
