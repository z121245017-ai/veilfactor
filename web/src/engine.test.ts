// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 VeilFactor Contributors

import { describe, expect, it } from "vitest";
import {
  DealStatus,
  buildComplianceAttestationJson,
  createBootstrappedEngine,
  extractLedgerDeals,
  scanPublicLedgerZeroLeakage,
  sha256,
} from "./veilfactorEngine";

describe("VeilFactor Web Engine (Compact 0.36.1 WASM)", () => {
  it("bootstraps with 1 pledged deal and blocks rogue double-pledge", async () => {
    const { sim, actors, initialDossier } = await createBootstrappedEngine();
    const deals = extractLedgerDeals(sim.getLedger());
    expect(deals).toHaveLength(1);
    expect(deals[0].summary.status).toBe(DealStatus.PLEDGED);

    await expect(
      sim.pledgeInvoice(actors.supplier2Sk, actors.factor2Pk, actors.auditorPk, 8000n, {
        invoiceDocHash: await sha256(initialDossier.invoiceRef),
        buyerTaxHash: await sha256(initialDossier.buyerTaxId),
        faceValueCents: 18_500_000n,
        buyerExposureCents: 30_000_000n,
        creditScore: 790n,
        invoiceSalt: await sha256("alt-salt"),
      })
    ).rejects.toThrow("Double-pledge blocked");
  });

  it("supports end-to-end fund -> selective auditor disclosure -> settle", async () => {
    const { sim, actors, initialDossier } = await createBootstrappedEngine();
    await sim.fundDeal(actors.factor1Sk, initialDossier.nullifier);
    await sim.attestSelectiveDisclosure(
      actors.auditorSk,
      initialDossier.nullifier,
      18_500_000n,
      790n
    );
    await sim.settleDeal(actors.factor1Sk, initialDossier.nullifier);
    const deal = sim.lookupDeal(initialDossier.nullifier);
    expect(deal.status).toBe(DealStatus.SETTLED);
    expect(deal.disclosedToAuditor).toBe(true);
  });

  it("verifies zero private witness leakage across serialized Ledger-9 public state", async () => {
    const { sim, initialDossier } = await createBootstrappedEngine();
    const audit = scanPublicLedgerZeroLeakage(sim.getLedger(), initialDossier);
    expect(audit.allClear).toBe(true);
    expect(audit.leaksFound).toBe(0);
    expect(audit.checks).toHaveLength(7);
    expect(audit.serializedCharsScanned).toBeGreaterThan(200);
  });

  it("rejects tampered +$1.00 selective disclosure figures and impostor auditor keys", async () => {
    const { sim, actors, initialDossier } = await createBootstrappedEngine();
    await expect(
      sim.attestSelectiveDisclosure(
        actors.auditorSk,
        initialDossier.nullifier,
        18_500_100n, // +$1 tampered
        790n
      )
    ).rejects.toThrow();

    await expect(
      sim.attestSelectiveDisclosure(
        actors.rogueAuditorSk,
        initialDossier.nullifier,
        18_500_000n,
        790n
      )
    ).rejects.toThrow();
  });

  it("rejects impostor factor funding and freezes settlement after bilateral dispute", async () => {
    const { sim, actors, initialDossier } = await createBootstrappedEngine();
    await expect(
      sim.fundDeal(actors.factor2Sk, initialDossier.nullifier)
    ).rejects.toThrow();

    await sim.fundDeal(actors.factor1Sk, initialDossier.nullifier);
    await sim.flagDispute(actors.supplier1Sk, initialDossier.nullifier);
    expect(sim.lookupDeal(initialDossier.nullifier).status).toBe(DealStatus.DISPUTED);

    await expect(
      sim.settleDeal(actors.factor1Sk, initialDossier.nullifier)
    ).rejects.toThrow();
  });

  it("builds a verifiable JSON compliance attestation receipt without leaking raw figures", async () => {
    const { sim, actors, initialDossier } = await createBootstrappedEngine();
    await sim.attestSelectiveDisclosure(
      actors.auditorSk,
      initialDossier.nullifier,
      18_500_000n,
      790n
    );
    const deals = extractLedgerDeals(sim.getLedger());
    const audit = scanPublicLedgerZeroLeakage(sim.getLedger(), initialDossier);
    const json = buildComplianceAttestationJson(deals[0], initialDossier, audit);
    const parsed = JSON.parse(json);
    expect(parsed.schema).toBe("veilfactor.selective-disclosure.receipt.v1");
    expect(parsed.publicLedgerCommitment.disclosedToAuditor).toBe(true);
    expect(parsed.privacyAudit.allClear).toBe(true);
    expect(json).not.toContain("185000");
    expect(json).not.toContain("DE-811128135");
  });
});
