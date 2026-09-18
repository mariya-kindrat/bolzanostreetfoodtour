import lighthouse from "lighthouse";
import * as chromeLauncher from "chrome-launcher";

const LCP_GOOD_MS = 2500;
const CLS_GOOD = 0.1;

async function runCheck(url, label, extraChromeFlags = []) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless", ...extraChromeFlags] });
  const result = await lighthouse(url, { port: chrome.port, onlyCategories: ["performance"] });
  await chrome.kill();

  const { "largest-contentful-paint": lcp, "cumulative-layout-shift": cls } = result.lhr.audits;
  console.log(
    `[${label}] LCP: ${lcp.displayValue} (${lcp.numericValue}ms), CLS: ${cls.displayValue}`,
  );

  if (lcp.numericValue > LCP_GOOD_MS) {
    throw new Error(
      `${label}: LCP ${lcp.numericValue}ms exceeds the ${LCP_GOOD_MS}ms "Good" threshold`,
    );
  }
  if (cls.numericValue > CLS_GOOD) {
    throw new Error(`${label}: CLS ${cls.numericValue} exceeds the ${CLS_GOOD} "Good" threshold`);
  }
}

const baseUrl = process.argv[2] ?? "http://localhost:3100";
await runCheck(baseUrl, "3D accent enabled (default)");
// Chromium's --force-prefers-reduced-motion flag makes matchMedia("(prefers-reduced-motion: reduce)")
// report true for the whole browser session, exercising the static-image fallback path.
await runCheck(baseUrl, "reduced-motion fallback", ["--force-prefers-reduced-motion"]);

console.log("Both hero configurations pass Core Web Vitals 'Good' thresholds.");
