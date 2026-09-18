import { formatPriceCents } from "@/lib/content/format";
import type { TransferSupplement } from "@/lib/generated/prisma/client";

export function SupplementsTable({ supplements }: { supplements: TransferSupplement[] }) {
  return (
    <table>
      <caption>Supplements — additional South Tyrol destinations</caption>
      <thead>
        <tr>
          <th scope="col">Additional city</th>
          <th scope="col">Supplement</th>
        </tr>
      </thead>
      <tbody>
        {supplements.map((s) => (
          <tr key={s.id}>
            <td>{s.label}</td>
            <td>{formatPriceCents(s.priceCents)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
