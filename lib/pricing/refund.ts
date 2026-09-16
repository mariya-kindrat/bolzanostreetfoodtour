export interface RefundInput {
  tourDate: Date;
  cancellationDate: Date;
  totalPaidCents: number;
}

export interface RefundResult {
  refundCents: number;
  refundPercent: 100 | 50 | 0;
  daysBeforeTour: number;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function calculateRefund(input: RefundInput): RefundResult {
  const daysBeforeTour = Math.floor((input.tourDate.getTime() - input.cancellationDate.getTime()) / MS_PER_DAY);

  // CLAUDE.md's stated bands ("100% at >=7 days, 50% at 3-6 days, 0% at <2 days")
  // leave the exact 2-day mark undefined. Resolved as <=2 days -> 0%, closing the
  // gap; flagged to the user rather than silently assumed (see plan doc).
  let refundPercent: 100 | 50 | 0;
  if (daysBeforeTour >= 7) {
    refundPercent = 100;
  } else if (daysBeforeTour >= 3) {
    refundPercent = 50;
  } else {
    refundPercent = 0;
  }

  return {
    refundCents: Math.round((input.totalPaidCents * refundPercent) / 100),
    refundPercent,
    daysBeforeTour,
  };
}
