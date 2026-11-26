// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 VeilFactor Contributors

import { describe, expect, it } from "vitest";
import {
  DealStatus,
  createBootstrappedEngine,
  extractLedgerDeals,
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
});
