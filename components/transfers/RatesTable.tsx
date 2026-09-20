import styles from "@/components/transfers/TransferTables.module.css";
import { formatPriceCents } from "@/lib/content/format";
import type { TransferRoute } from "@/lib/generated/prisma/client";

export function RatesTable({ routes }: { routes: TransferRoute[] }) {
  return (
    <table className={styles.table}>
      <caption>Airport rates</caption>
      <thead>
        <tr>
          <th scope="col">Route</th>
          <th scope="col">Max passengers</th>
          <th scope="col">Max luggage</th>
          <th scope="col">Price</th>
          <th scope="col">Duration</th>
        </tr>
      </thead>
      <tbody>
        {routes.map((r) => (
          <tr key={r.id}>
            <td>
              {r.origin} ↔ {r.destination}
            </td>
            <td>{r.maxPax}</td>
            <td>{r.maxLuggage}</td>
            <td className={styles.price}>{formatPriceCents(r.priceCents)}</td>
            <td>{r.durationLabel}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
