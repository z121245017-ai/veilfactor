#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
// Headless Chrome live WASM QA + screenshot capture for VeilFactor

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const WEB_DIR = path.join(ROOT_DIR, "web");
const OUT_DIR = path.join(ROOT_DIR, "docs", "frames");
mkdirSync(OUT_DIR, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findChrome() {
  const home = process.env.HOME || "";
  for (const p of [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    path.join(
      home,
      "Library/Caches/ms-playwright/chromium-1217/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
    ),
  ]) {
    if (existsSync(p)) return p;
  }
  throw new Error("Chrome binary not found");
}

async function waitForHttp(url, timeoutMs = 15000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {}
    await sleep(200);
  }
  throw new Error("Timeout waiting for " + url);
}

class CDP {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }
  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((res, rej) => {
      this.ws.addEventListener("open", res, { once: true });
      this.ws.addEventListener("error", rej, { once: true });
    });
    this.ws.addEventListener("message", (e) => {
      const m = JSON.parse(String(e.data));
      if (m.id && this.pending.has(m.id)) {
        const { res, rej } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error ? rej(new Error(m.error.message)) : res(m.result);
      } else if (m.method && this.listeners.has(m.method)) {
        for (const fn of this.listeners.get(m.method)) fn(m.params);
      }
    });
  }
  on(m, fn) {
    if (!this.listeners.has(m)) this.listeners.set(m, []);
    this.listeners.get(m).push(fn);
  }
  send(method, params = {}) {
    const id = this.id++;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expr) {
    const r = await this.send("Runtime.evaluate", {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result?.value;
  }
  async shot(file) {
    const { data } = await this.send("Page.captureScreenshot", {
      format: "png",
    });
    writeFileSync(file, Buffer.from(data, "base64"));
  }
  close() {
    try {
      this.ws?.close();
    } catch {}
  }
}

async function clickByText(cdp, sub) {
  const ok = await cdp.eval(`(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => !b.disabled && (b.textContent || '').includes(${JSON.stringify(sub)}));
    if (!btn) return false;
    btn.click();
    return true;
  })()`);
  if (!ok) throw new Error("Button not found or disabled: " + sub);
  await sleep(450);
}

async function main() {
  const port = 5193;
  const debugPort = 9448;
  const url = `http://127.0.0.1:${port}/`;
  const preview = spawn(
    process.execPath,
    [
      path.join(WEB_DIR, "node_modules/vite/bin/vite.js"),
      "preview",
      "--port",
      String(port),
      "--host",
      "127.0.0.1",
      "--strictPort",
    ],
    { cwd: WEB_DIR, stdio: "ignore" }
  );
  let chrome = null;
  let cdp = null;
  try {
    await waitForHttp(url);
    chrome = spawn(
      findChrome(),
      [
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        `--remote-debugging-port=${debugPort}`,
        "--window-size=1440,900",
        "about:blank",
      ],
      { stdio: "ignore" }
    );
    await waitForHttp(`http://127.0.0.1:${debugPort}/json/list`);
    const targets = await (
      await fetch(`http://127.0.0.1:${debugPort}/json/list`)
    ).json();
    const page = targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
    cdp = new CDP(page.webSocketDebuggerUrl);
    await cdp.connect();
    const errs = [];
    cdp.on("Runtime.exceptionThrown", (p) =>
      errs.push(p.exceptionDetails?.text || "exception")
    );
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await cdp.send("Page.navigate", { url });
    await sleep(2200); // wait for Compact 0.36.1 WASM bootstrap

    // 1. Run legit pledge + simulate rogue double-pledge attack
    await clickByText(cdp, "Run pledgeInvoice() Compact Circuit");
    await clickByText(cdp, "Simulate Rogue Double-Pledge Attack");
    const tab1Check = await cdp.eval(`(() => ({
      text: document.body.innerText,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      scrollH: document.documentElement.scrollHeight
    }))()`);
    await cdp.shot(path.join(OUT_DIR, "01-pledge-double-attack.png"));

    // 2. Lifecycle tab: test impostor factor reject + real factor funding
    await clickByText(cdp, "2. Factor Lifecycle");
    await clickByText(cdp, "Test Impostor");
    await clickByText(cdp, "Fund (Factor)");
    await cdp.shot(path.join(OUT_DIR, "02-lifecycle-dealbook.png"));

    // 3. Auditor Selective Disclosure tab: verify exact seal
    await clickByText(cdp, "3. Auditor Selective Disclosure");
    await clickByText(cdp, "Verify & Attest Selective Disclosure");
    await cdp.shot(path.join(OUT_DIR, "03-auditor-disclosure.png"));

    // 4. Policy & 6-Circuit Matrix tab
    await clickByText(cdp, "4. Risk Policy");
    await clickByText(cdp, "Test Unauthorized Non-Admin Update");
    await cdp.shot(path.join(OUT_DIR, "04-policy-circuits.png"));

    // 5. Pitch Deck check
    await cdp.send("Page.navigate", { url: `http://127.0.0.1:${port}/deck.html` });
    await sleep(600);
    const deckOverflow = await cdp.eval(
      `document.documentElement.scrollWidth - document.documentElement.clientWidth`
    );
    await cdp.shot(path.join(OUT_DIR, "05-pitch-deck.png"));

    const passedAssertions = {
      doublePledgeBlockedInUi: tab1Check.text.includes("Double-pledge blocked"),
      leakageAuditPass: tab1Check.text.includes("LEAKAGE AUDIT: 0 SECRETS ON-CHAIN"),
      zeroRuntimeErrors: errs.length === 0,
      zeroOverflowX: tab1Check.overflowX <= 0 && deckOverflow <= 0,
    };

    console.log(
      JSON.stringify(
        {
          status:
            Object.values(passedAssertions).every(Boolean) ? "PASS" : "FAIL",
          passedAssertions,
          errors: errs,
          overflowX: tab1Check.overflowX,
          scrollH: tab1Check.scrollH,
          deckOverflow,
        },
        null,
        2
      )
    );
    if (!Object.values(passedAssertions).every(Boolean)) process.exit(1);
  } finally {
    cdp?.close();
    chrome?.kill("SIGTERM");
    preview?.kill("SIGTERM");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
