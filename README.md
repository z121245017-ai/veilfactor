# VeilFactor

**Zero-Knowledge Invoice Double-Pledge Prevention, Confidential Underwriting Covenants & Auditor-Scoped Selective Disclosure on Midnight.**

> Built for the **Midnight Buildathon (Wave 3)** · Licensed under **Apache License 2.0** · Compiled with **`compact 0.36.1`** (`pragma language_version >= 0.28.0;`, Ledger-9 `@midnight-ntwrk/compact-runtime@0.21.0`).

- **Live Interactive WASM Console:** https://z121245017-ai.github.io/veilfactor/
- **Interactive Pitch Slide Deck:** https://z121245017-ai.github.io/veilfactor/deck.html
- **HD Walkthrough Video (YouTube):** https://youtu.be/KP9GJiiqSoo (local copy: `docs/demo.mp4`)
- **AKINDO Wave 3 Submission:** https://app.akindo.io/communities/o6qvaZ91nTq2LLJ38/products/xKqzmON1ZHvV7k3j

---

## 1. The Problem

Global invoice factoring and supply-chain trade finance moves **$3T+ annually**, yet suffers billions in losses from **invoice double-financing**: a rogue supplier pledges the exact same commercial receivable to Factor A and Factor B simultaneously.

- **On private silos:** Competing factoring desks refuse to pool raw invoice databases because doing so exposes buyer identities, unit pricing, and credit concentration.
- **On public blockchains:** Publishing invoice data on-chain leaks commercial secrets and supplier liquidity distress to competitors.

**VeilFactor uses Midnight's dual-ledger architecture to solve the paradox:** global cryptographic uniqueness across competing lenders with strict programmable data protection.

---

## 2. Midnight Dual-Ledger Architecture

```
┌──────────────────────────────────────────────┐       ┌──────────────────────────────────────────────────┐
│  LOCAL PRIVATE PROVER (Witnesses — HIDDEN)   │       │  MIDNIGHT PUBLIC LEDGER (Zero Raw Secrets)       │
├──────────────────────────────────────────────┤       ├──────────────────────────────────────────────────┤
│ • localInvoiceDocHash()   (PDF SHA-256)      │       │ • pledgedNullifiers: Set<Bytes<32>>              │
│ • localBuyerTaxHash()     (Buyer Tax ID)     │  ZK   │     H("veilfactor:nullifier:v1", doc, buyer)     │
│ • localFaceValueCents()   (Exact $ amount)   │ ────► │ • deals: Map<Bytes<32>, DealSummary>             │
│ • localBuyerExposureCents()(Portfolio cap)   │ Proof │     salted commitment + disclosureSeal           │
│ • localCreditScore()      (Exact 500–850)    │       │     coarse RiskTier + AmountBand + advanceBps    │
│ • localInvoiceSalt()      (Random blinding)  │       │ • Global Policy Guardrails & Counters            │
│ • localSecretKey() / localAuditorSecretKey() │       │     minCreditScore, maxAdvanceBps, buyerCap      │
└──────────────────────────────────────────────┘       └──────────────────────────────────────────────────┘
```

### Why Cross-Wallet Double-Pledging Is Mathematically Impossible
`computeInvoiceNullifier(docHash, buyerTaxHash)` deliberately excludes `supplierSk` and `invoiceSalt`. Even if a dishonest supplier creates a brand-new shell wallet with a fresh salt and approaches a second factoring desk, **the deterministic nullifier collides in `pledgedNullifiers` and `pledgeInvoice()` reverts inside the Compact ZK circuit.**

---

## 3. Compiled Compact 0.36.1 Circuits (`contract/src/veilfactor.compact`)

All **6 stateful provable circuits** compile cleanly with `compact 0.36.1` (`language_version 0.28.0`) producing full Halo2 `.prover`, `.verifier`, `.zkir`, and `.bzkir` artifacts under `contract/src/managed/veilfactor/`:

| Circuit | Role Authentication (ZK) | Privacy & Security Guarantees |
| --- | --- | --- |
| `pledgeInvoice` | Supplier (`deriveSupplierPk`) | Proves credit score ≥ floor, `buyerExposure + faceValue ≤ cap`, Tier-C ≤ 80% advance cap, and `!pledgedNullifiers.member(nullifier)` — without leaking exact values. |
| `fundDeal` | Designated Factor (`deriveFactorPk`) | Blocks impostor lenders; transitions `PLEDGED → FUNDED`. |
| `settleDeal` | Designated Factor (`deriveFactorPk`) | Transitions `FUNDED → SETTLED`; spent nullifier remains permanently locked against replay financing. |
| `flagDispute` | Supplier **or** Factor | Bilateral freeze into `DISPUTED` state halting settlement pending compliance audit. |
| `attestSelectiveDisclosure` | Designated Auditor (`deriveAuditorPk`) | Verifies exact off-chain commercial dossier `(faceValue, creditScore)` against on-chain `disclosureSeal` without publishing those exact figures publicly. |
| `updateRiskPolicy` | Protocol Admin (`deriveAdminPk`) | Updates global score floor, max advance bps, and buyer concentration cap for future pledges. |

---

## 4. Quick Start & Reproducible Verification

### Prerequisites
- Node.js `>= 24.11` (verified on `v24.14.1`)
- Midnight Compact CLI `0.5.3` with toolchain `0.36.1` (`compact update 0.36.1`)

### 1. Compile Compact 0.36.1 Contract & Run 15 Ledger-9 Tests
```bash
cd contract
npm install
npm run compact     # compiles src/veilfactor.compact -> src/managed/veilfactor/
npm run typecheck   # tsc --noEmit
npm run test        # 15/15 Vitest tests against @midnight-ntwrk/compact-runtime@0.21.0
```

### 2. Run Interactive Browser-WASM Console & Web Tests
```bash
cd web
npm install
npm run test        # 2/2 web WASM engine tests
npm run build       # builds dist/ with real midnight_onchain_runtime_wasm_bg.wasm
npm run dev         # opens live interactive console at http://localhost:5173
```

---

## 5. Verification Summary

- **Compact Compiler (`0.36.1`):** `6/6` circuits compiled cleanly (`contract/src/managed/veilfactor/keys/*.{prover,verifier}` & `zkir/*`).
- **Contract Test Suite (`vitest`):** **`15/15 PASS`** covering policy governance, deterministic privacy-preserving commitments, zero-leakage assertions on serialized public state, cross-wallet/cross-salt double-pledge blocking, concentration covenant breaches, Tier-C 80% guardrails, impostor factor/auditor rejection, +\$1 tampered disclosure seal rejection, bilateral dispute freeze, and 4-role domain separation.
- **Web WASM Console (`vite` + Headless Chrome QA):** **`2/2 PASS`** unit tests + live Headless Chrome `1440×900` E2E execution of the real WASM bundle (`0` runtime errors, `0px` horizontal overflow across all 4 tabs & pitch deck).

---

## 6. Wave 3 Changelog & Roadmap

- **Wave 3 Delivery:** First full release — engineered `veilfactor.compact` (6 provable circuits + 8 pure hash/key helpers), `VeilFactorSimulator` on Ledger-9 (`compact-runtime@0.21.0`), `15/15` automated tests, live browser-WASM dual-ledger interactive dApp, 7-slide pitch deck (`web/public/deck.html`), and 56s HD demo video.
- **Next Milestones (Midnight Build Club):** Midnight Preprod live deployment with Lace DApp Connector v4 + Midnight proof server, encrypted off-chain auditor dossier vault, and pilot ERP webhooks for B2B factoring desks.

## License

Licensed under the [Apache License, Version 2.0](./LICENSE).
