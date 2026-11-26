// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 VeilFactor Contributors

import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import {
  AmountBand,
  DealStatus,
  RiskTier,
  VeilFactorSimulator,
  pureCircuits,
  type DealSummary,
  type Ledger,
} from "../../contract/src/index.ts";

setNetworkId("undeployed");

export { AmountBand, DealStatus, RiskTier, pureCircuits };

export async function sha256(label: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(label);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return new Uint8Array(digest);
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function shortHex(bytes: Uint8Array, n = 6): string {
  const h = toHex(bytes);
  return `0x${h.slice(0, n)}…${h.slice(-n)}`;
}

export function riskTierLabel(t: RiskTier): string {
  if (t === RiskTier.TIER_A_PRIME) return "TIER_A_PRIME (760+)";
  if (t === RiskTier.TIER_B_STANDARD) return "TIER_B_STANDARD (680–759)";
  return "TIER_C_ENHANCED (<680, ≤80% cap)";
}

export function amountBandLabel(b: AmountBand): string {
  if (b === AmountBand.BAND_MICRO) return "BAND_MICRO ($1k–$25k)";
  if (b === AmountBand.BAND_MID) return "BAND_MID ($25k–$250k)";
  return "BAND_INSTITUTIONAL ($250k–$5M)";
}

export function dealStatusLabel(s: DealStatus): string {
  if (s === DealStatus.PLEDGED) return "PLEDGED";
  if (s === DealStatus.FUNDED) return "FUNDED";
  if (s === DealStatus.SETTLED) return "SETTLED";
  return "DISPUTED";
}

export type DemoActors = {
  adminSk: Uint8Array;
  supplier1Sk: Uint8Array;
  supplier2Sk: Uint8Array;
  factor1Sk: Uint8Array;
  factor2Sk: Uint8Array;
  auditorSk: Uint8Array;
  rogueAuditorSk: Uint8Array;
  factor1Pk: Uint8Array;
  factor2Pk: Uint8Array;
  auditorPk: Uint8Array;
};

export type PrivateDossierRecord = {
  nullifierHex: string;
  nullifier: Uint8Array;
  invoiceRef: string;
  buyerTaxId: string;
  faceValueUsd: number;
  buyerExposureUsd: number;
  creditScore: number;
  factorLabel: string;
  factorId: "factor1" | "factor2";
  docHashHex: string;
  buyerTaxHashHex: string;
};

export type TraceEvent = {
  id: number;
  ts: string;
  circuit: string;
  actor: string;
  ok: boolean;
  message: string;
  computeTime?: string;
  bytesWritten?: string;
};

export type LedgerDealItem = {
  nullifierHex: string;
  nullifier: Uint8Array;
  summary: DealSummary;
};

export async function createDemoActors(): Promise<DemoActors> {
  const [
    adminSk,
    supplier1Sk,
    supplier2Sk,
    factor1Sk,
    factor2Sk,
    auditorSk,
    rogueAuditorSk,
  ] = await Promise.all([
    sha256("veilfactor:actor:admin:01"),
    sha256("veilfactor:actor:supplier:shenzhen-pcb"),
    sha256("veilfactor:actor:supplier:rogue-shell"),
    sha256("veilfactor:actor:factor:apex-trade-finance"),
    sha256("veilfactor:actor:factor:horizon-credit"),
    sha256("veilfactor:actor:auditor:deloitte-zk"),
    sha256("veilfactor:actor:auditor:impostor"),
  ]);
  return {
    adminSk,
    supplier1Sk,
    supplier2Sk,
    factor1Sk,
    factor2Sk,
    auditorSk,
    rogueAuditorSk,
    factor1Pk: pureCircuits.deriveFactorPk(factor1Sk),
    factor2Pk: pureCircuits.deriveFactorPk(factor2Sk),
    auditorPk: pureCircuits.deriveAuditorPk(auditorSk),
  };
}

export function extractLedgerDeals(state: Ledger): LedgerDealItem[] {
  const out: LedgerDealItem[] = [];
  for (const [nullifier, summary] of state.deals) {
    out.push({
      nullifierHex: toHex(nullifier),
      nullifier,
      summary,
    });
  }
  return out;
}

export async function createBootstrappedEngine(): Promise<{
  sim: VeilFactorSimulator;
  actors: DemoActors;
  initialDossier: PrivateDossierRecord;
  initialTrace: TraceEvent;
}> {
  const actors = await createDemoActors();
  const sim = await VeilFactorSimulator.create(actors.adminSk);

  // Seed one live verified deal on startup so judges immediately see real Compact state
  const invoiceRef = "INV-2026-88412-PCB";
  const buyerTaxId = "DE-811128135";
  const docHash = await sha256(invoiceRef);
  const buyerTaxHash = await sha256(buyerTaxId);
  const salt = await sha256("veilfactor:seed:salt:01");

  const exec = await sim.pledgeInvoice(
    actors.supplier1Sk,
    actors.factor1Pk,
    actors.auditorPk,
    8500n,
    {
      invoiceDocHash: docHash,
      buyerTaxHash,
      faceValueCents: 18_500_000n, // $185,000
      buyerExposureCents: 30_000_000n, // $300,000
      creditScore: 790n,
      invoiceSalt: salt,
    }
  );

  const nullifierHex = toHex(exec.result);
  return {
    sim,
    actors,
    initialDossier: {
      nullifierHex,
      nullifier: exec.result,
      invoiceRef,
      buyerTaxId,
      faceValueUsd: 185000,
      buyerExposureUsd: 300000,
      creditScore: 790,
      factorLabel: "Apex Trade Finance",
      factorId: "factor1",
      docHashHex: toHex(docHash),
      buyerTaxHashHex: toHex(buyerTaxHash),
    },
    initialTrace: {
      id: 1,
      ts: "boot",
      circuit: "pledgeInvoice",
      actor: "Supplier A (Shenzhen PCB)",
      ok: true,
      message: `Pledged ${invoiceRef} -> nullifier 0x${nullifierHex.slice(0, 10)}… (TIER_A_PRIME · BAND_MID)`,
      computeTime: exec.gasCost.computeTime.toString(),
      bytesWritten: exec.gasCost.bytesWritten.toString(),
    },
  };
}
