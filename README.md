# VeilFactor

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)
[![Tests: 35/35 Passing](https://img.shields.io/badge/Tests-35%2F35_Passing-10b981.svg)](#5-verification-summary)
[![Midnight Compact 0.36.1](https://img.shields.io/badge/Midnight_Compact-0.36.1_Ledger--9-6366f1.svg)](https://docs.midnight.network/)

**Zero-Knowledge Invoice Double-Pledge Prevention, Confidential Underwriting Covenants & Auditor-Scoped Selective Disclosure on Midnight.**

> Built for the **Midnight Buildathon (Wave 3)** on **[Midnight Network](https://midnight.network/)** (`midnightntwrk`) · Licensed under **Apache License 2.0** · Compiled with **`compact 0.36.1`** (`pragma language_version >= 0.28.0;`, Ledger-9 `@midnight-ntwrk/compact-runtime@0.21.0`).

- **Live Interactive WASM Console:** https://z121245017-ai.github.io/veilfactor/
- **Interactive Pitch Slide Deck:** https://z121245017-ai.github.io/veilfactor/deck.html
- **HD Walkthrough Video (YouTube):** https://youtu.be/KP9GJiiqSoo (local copy: `docs/demo.mp4`)
- **AKINDO Wave 3 Submission:** https://app.akindo.io/communities/o6qvaZ91nTq2LLJ38/products/xKqzmON1ZHvV7k3j

---

## Judge Quick-Verification Map (Midnight Buildathon Rubric)

| Rubric Criterion | Weight | Where to Verify in This Repo |
| --- | ---: | --- |
| **Engineering & Implementation** | 40% | `contract/src/veilfactor.compact` (6 compiled Compact 0.36.1 circuits + full `managed/` Halo2 prover/verifier keys), local Private Witness Vault state management (`web/src/veilfactorEngine.ts`), GitHub topic `midnightntwrk`, Apache-2.0 `LICENSE` |
| **Quality Assurance & Reliability** | 15% | **`35/35` passing Vitest tests** (`18` contract incl. 20-invoice randomized property & 10-trial cross-wallet replay invariants + `17` web WASM), `tsc --noEmit` & Headless Chrome QA (`0` errors) |
| **Product & Vision** | 15% | Solves the $3T trade-finance double-pledging paradox via deterministic nullifiers + selective auditor disclosure; realistic Preprod → Mainnet roadmap below |
| **User Experience & Design** | 15% | Live zero-install Browser-WASM console with 1-Click 4-Step Compliance Walkthrough, 1-Click 5-Vector Adversarial ZK Bench, Pre-Flight Covenant Gauges & Lace Midnight Wallet (`mnLace`) connector |
| **Communication** | 10% | 7-slide interactive pitch deck (`deck.html`) + 56s narrated HD video walkthrough (`youtu.be/KP9GJiiqSoo`) |
| **Business Development & Viability** | 5% | Target B2B factoring desks & trade-finance consortiums (per-pledge verification fee + compliance audit API; see Slide 6 of `deck.html`) |

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

### 1. Compile Compact 0.36.1 Contract & Run 18 Ledger-9 Tests
```bash
cd contract
npm install
npm run compact     # compiles src/veilfactor.compact -> src/managed/veilfactor/
npm run typecheck   # tsc --noEmit
npm run test        # 18/18 Vitest tests (incl. randomized zero-leakage & replay property invariants)
```

### 2. Run Interactive Browser-WASM Console & Web Tests
```bash
cd web
npm install
npm run test        # 17/17 web WASM engine, adversarial bench, Lace connector, Private Vault & leakage-scanner tests
npm run build       # builds dist/ with real midnight_onchain_runtime_wasm_bg.wasm
npm run dev         # opens live interactive console at http://localhost:5173
```

---

## 5. Verification Summary

- **Compact Compiler (`0.36.1`):** `6/6` circuits compiled cleanly (`contract/src/managed/veilfactor/keys/*.{prover,verifier}` & `zkir/*`).
- **Contract Test Suite (`vitest`):** **`18/18 PASS`** covering policy governance, deterministic privacy-preserving commitments, zero-leakage assertions on serialized public state, cross-wallet/cross-salt double-pledge blocking, concentration covenant breaches, Tier-C 80% guardrails, impostor factor/auditor rejection, +\$1 tampered disclosure seal rejection, bilateral dispute freeze, 4-role domain separation, and **3 property-based invariant suites** (20 randomized invoices zero-leakage + tier/band check, 10-trial cross-wallet replay blocking, and Tier-C boundary enforcement).
- **Web WASM Console (`vite` + Headless Chrome QA):** **`17/17 PASS`** unit tests (**`35/35` total**) covering real browser WASM execution, **Local Private Witness Vault** persistence & private-vs-public boundary inventory, real-time **Pre-Flight ZK Covenant Gauges**, **1-Click 4-Step Guided Compliance Walkthrough**, **1-Click 5-Vector Adversarial ZK Security Bench**, **Lace Midnight Wallet Connector (`window.midnight.mnLace`)** probe/fallback, **Ledger-9 RunningCost Telemetry**, the **Public State Zero-Leakage Byte Scanner** (`0/7` leaks), and verifiable compliance attestation JSON export.

---

## 6. Wave 3 Changelog & Roadmap

- **Wave 3 Delivery:** Full release — engineered `veilfactor.compact` (6 provable circuits + 8 pure hash/key helpers), `VeilFactorSimulator` on Ledger-9 (`compact-runtime@0.21.0`), **`35/35` automated tests (`18` contract + `17` web WASM)**, live browser-WASM dual-ledger interactive dApp with Local Private Witness Vault management, real-time **Pre-Flight Covenant SVG Gauges**, **1-Click 4-Step ZK Compliance Walkthrough**, **1-Click 5-Vector Adversarial ZK Security Bench**, **Lace Midnight Wallet (`mnLace`) connector**, **Public State Zero-Leakage Byte Scanner** & 1-click **Compliance Attestation JSON Export**, 7-slide pitch deck (`web/public/deck.html`), and 56s HD demo video.
- **Next Milestones (Midnight Build Club):** Midnight Preprod live deployment with Lace DApp Connector v4 + Midnight proof server, encrypted off-chain auditor dossier vault, and pilot ERP webhooks for B2B factoring desks.

## Ecosystem Attribution & License

Built with [Midnight Network](https://midnight.network/) (`midnightntwrk`), Midnight Compact (`0.36.1`), and `@midnight-ntwrk/compact-runtime` (`0.21.0`).  
Licensed under the [Apache License, Version 2.0](./LICENSE).
