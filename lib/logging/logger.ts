import pino from "pino";

const transport =
  process.env.AXIOM_TOKEN && process.env.AXIOM_DATASET
    ? pino.transport({
        target: "@axiomhq/pino",
        options: {
          dataset: process.env.AXIOM_DATASET,
          token: process.env.AXIOM_TOKEN,
        },
      })
    : undefined;

export const logger = pino(
  {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    base: { environment: process.env.NODE_ENV },
  },
  transport,
);
