// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 VeilFactor Contributors

import { describe, expect, it } from "vitest";
import {
  DealStatus,
  RiskTier,
  buildComplianceAttestationJson,
  computePortfolioLifecycleMetrics,
  createBootstrappedEngine,
  evaluatePreFlightCovenants,
  extractLedgerDeals,
  runGuidedComplianceWalkthrough,
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

  it("predicts pre-flight covenant pass vs concentration breach accurately against live Ledger-9 policy", async () => {
    const { sim } = await createBootstrappedEngine();
    const ledger = sim.getLedger();

    const ok = evaluatePreFlightCovenants(
      { faceValueUsd: 142500, buyerExposureUsd: 485000, creditScore: 745, advancePct: 85 },
      ledger
    );
    expect(ok.willPassCircuit).toBe(true);
    expect(ok.predictedRiskTier).toBe(RiskTier.TIER_B_STANDARD);
    expect(ok.concentrationUtilizationPct).toBeCloseTo(62.75, 2);

    const breach = evaluatePreFlightCovenants(
      { faceValueUsd: 260000, buyerExposureUsd: 800000, creditScore: 805, advancePct: 85 },
      ledger
    );
    expect(breach.willPassCircuit).toBe(false);
    expect(breach.concentrationPass).toBe(false);
    expect(breach.violations.some((v) => v.includes("exceeds"))).toBe(true);
  });

  it("enforces Tier-C 80% advance rate guardrail in pre-flight covenant evaluator", async () => {
    const { sim } = await createBootstrappedEngine();
    const res = evaluatePreFlightCovenants(
      { faceValueUsd: 18000, buyerExposureUsd: 40000, creditScore: 650, advancePct: 85 },
      sim.getLedger()
    );
    expect(res.predictedRiskTier).toBe(RiskTier.TIER_C_ENHANCED);
    expect(res.effectiveMaxAdvancePct).toBe(80);
    expect(res.advanceRatePass).toBe(false);
    expect(res.willPassCircuit).toBe(false);
  });

  it("executes full 4-step guided compliance walkthrough on real Compact 0.36.1 WASM", async () => {
    const { sim, actors } = await createBootstrappedEngine();
    const res = await runGuidedComplianceWalkthrough(sim, actors, "TEST");
    expect(res.traces).toHaveLength(4);
    expect(res.traces[0].ok).toBe(true);
    expect(res.traces[1].ok).toBe(false); // double-pledge blocked!
    expect(res.traces[1].message).toContain("Double-pledge blocked");
    expect(res.traces[2].ok).toBe(true);
    expect(res.traces[3].ok).toBe(true);
    expect(res.leakageAudit.allClear).toBe(true);
    expect(res.leakageAudit.leaksFound).toBe(0);
    const deal = sim.lookupDeal(res.dossier.nullifier);
    expect(deal.status).toBe(DealStatus.FUNDED);
    expect(deal.disclosedToAuditor).toBe(true);
  });

  it("aggregates portfolio lifecycle counts and Ledger-9 RunningCost telemetry accurately", async () => {
    const { sim, actors, initialTrace } = await createBootstrappedEngine();
    const walk = await runGuidedComplianceWalkthrough(sim, actors, "METR");
    const allTraces = [
      initialTrace,
      ...walk.traces.map((t, i) => ({ ...t, id: i + 2, ts: "t" })),
    ];
    const metrics = computePortfolioLifecycleMetrics(extractLedgerDeals(sim.getLedger()), allTraces);
    expect(metrics.totalDeals).toBe(2);
    expect(metrics.pledged).toBe(1);
    expect(metrics.funded).toBe(1);
    expect(metrics.attested).toBe(1);
    expect(metrics.passCalls).toBe(4);
    expect(metrics.blockedCalls).toBe(1);
    expect(metrics.totalComputeTime).toBeGreaterThan(0n);
    expect(metrics.totalBytesWritten).toBeGreaterThan(0n);
  });
});
