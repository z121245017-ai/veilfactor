// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 VeilFactor Contributors

import { describe, expect, it } from "vitest";
import { setNetworkId } from "@midnight-ntwrk/midnight-js-network-id";
import {
  AmountBand,
  DealStatus,
  RiskTier,
  VeilFactorSimulator,
  pureCircuits,
} from "../index.js";

setNetworkId("undeployed");

async function sha256(label: string): Promise<Uint8Array> {
  const bytes = new TextEncoder().encode(label);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return new Uint8Array(digest);
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

describe("VeilFactor Compact 0.36.1 ZK Smart Contract", async () => {
  const adminSk = await sha256("actor:admin:01");
  const supplier1Sk = await sha256("actor:supplier:shenzhen-pcb");
  const supplier2Sk = await sha256("actor:supplier:rogue-shell-co");
  const factor1Sk = await sha256("actor:factor:apex-trade-finance");
  const factor2Sk = await sha256("actor:factor:horizon-credit");
  const auditorSk = await sha256("actor:auditor:deloitte-zk");
  const rogueAuditorSk = await sha256("actor:auditor:impostor");

  const factor1Pk = pureCircuits.deriveFactorPk(factor1Sk);
  const factor2Pk = pureCircuits.deriveFactorPk(factor2Sk);
  const auditorPk = pureCircuits.deriveAuditorPk(auditorSk);

  const validInvoiceA = {
    invoiceDocHash: await sha256("INV-2026-88412|PCB-LOT-9|NET60"),
    buyerTaxHash: await sha256("BUYER-TAX-DE-811128135"),
    faceValueCents: 18_500_000n, // $185,000.00 -> BAND_MID
    buyerExposureCents: 30_000_000n, // $300,000 existing -> total $485,000 <= $1,000,000
    creditScore: 790n, // TIER_A_PRIME
    invoiceSalt: await sha256("salt:inv-88412:a"),
  };

  it("initializes deterministic ledger policy and protocol admin PK", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    const state = sim.getLedger();
    expect(state.protocolAdminPk).toEqual(pureCircuits.deriveAdminPk(adminSk));
    expect(state.minCreditScore).toBe(620n);
    expect(state.maxAdvanceBps).toBe(9000n);
    expect(state.maxBuyerConcentrationCents).toBe(100_000_000n);
    expect(state.totalPledged).toBe(0n);
    expect(state.totalFunded).toBe(0n);
    expect(state.totalSettled).toBe(0n);
    expect(state.pledgedNullifiers.isEmpty()).toBe(true);
  });

  it("rejects invalid constructor guardrails", async () => {
    await expect(
      VeilFactorSimulator.create(adminSk, {
        minCreditScore: 400n,
        maxAdvanceBps: 9000n,
        maxBuyerConcentrationCents: 100_000_000n,
      })
    ).rejects.toThrow("Invalid credit score floor");

    await expect(
      VeilFactorSimulator.create(adminSk, {
        minCreditScore: 620n,
        maxAdvanceBps: 9800n,
        maxBuyerConcentrationCents: 100_000_000n,
      })
    ).rejects.toThrow("Invalid max advance bps");
  });

  it("allows only protocol admin to update global risk policy", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    await expect(
      sim.updateRiskPolicy(supplier1Sk, {
        minCreditScore: 650n,
        maxAdvanceBps: 8500n,
        maxBuyerConcentrationCents: 50_000_000n,
      })
    ).rejects.toThrow("Unauthorized: caller is not protocol admin");

    const { ledger: updated } = await sim.updateRiskPolicy(adminSk, {
      minCreditScore: 650n,
      maxAdvanceBps: 8800n,
      maxBuyerConcentrationCents: 75_000_000n,
    });
    expect(updated.minCreditScore).toBe(650n);
    expect(updated.maxAdvanceBps).toBe(8800n);
    expect(updated.maxBuyerConcentrationCents).toBe(75_000_000n);
  });

  it("pledges a private invoice with zero leakage of raw amount, buyer, or credit score", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    const {
      result: nullifier,
      ledger: state,
      gasCost,
    } = await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8500n,
      validInvoiceA
    );

    const expectedNullifier = pureCircuits.computeInvoiceNullifier(
      validInvoiceA.invoiceDocHash,
      validInvoiceA.buyerTaxHash
    );
    expect(nullifier).toEqual(expectedNullifier);
    expect(state.totalPledged).toBe(1n);
    expect(state.pledgedNullifiers.member(nullifier)).toBe(true);
    expect(gasCost.computeTime).toBeGreaterThan(0n);

    const summary = state.deals.lookup(nullifier);
    expect(summary.supplierPk).toEqual(pureCircuits.deriveSupplierPk(supplier1Sk));
    expect(summary.factorPk).toEqual(factor1Pk);
    expect(summary.auditorPk).toEqual(auditorPk);
    expect(summary.riskTier).toBe(RiskTier.TIER_A_PRIME);
    expect(summary.amountBand).toBe(AmountBand.BAND_MID);
    expect(summary.advanceBps).toBe(8500n);
    expect(summary.status).toBe(DealStatus.PLEDGED);
    expect(summary.disclosedToAuditor).toBe(false);

    // Privacy leakage verification: serialized public summary never reveals raw docHash/buyerTaxHash/exact amount/exact score
    const publicDump = JSON.stringify({
      supplierPk: toHex(summary.supplierPk),
      factorPk: toHex(summary.factorPk),
      auditorPk: toHex(summary.auditorPk),
      commitment: toHex(summary.invoiceCommitment),
      seal: toHex(summary.disclosureSeal),
      riskTier: summary.riskTier,
      amountBand: summary.amountBand,
      advanceBps: summary.advanceBps.toString(),
    });
    expect(publicDump).not.toContain(toHex(validInvoiceA.invoiceDocHash));
    expect(publicDump).not.toContain(toHex(validInvoiceA.buyerTaxHash));
    expect(publicDump).not.toContain("18500000");
    expect(publicDump).not.toContain("790");
  });

  it("BLOCKS double-pledging the same invoice to a second factor — even from a different supplier wallet and salt", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8500n,
      validInvoiceA
    );

    await expect(
      sim.pledgeInvoice(supplier2Sk, factor2Pk, auditorPk, 8000n, {
        ...validInvoiceA,
        invoiceSalt: await sha256("salt:different-attempt"),
      })
    ).rejects.toThrow("Double-pledge blocked: invoice already financed");

    expect(sim.getLedger().totalPledged).toBe(1n);
  });

  it("enforces private buyer concentration covenant in zero knowledge", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    await expect(
      sim.pledgeInvoice(supplier1Sk, factor1Pk, auditorPk, 8000n, {
        ...validInvoiceA,
        invoiceDocHash: await sha256("INV-2026-CONC-BREACH"),
        faceValueCents: 25_000_000n, // $250k
        buyerExposureCents: 80_000_000n, // $800k -> $1.05M > $1.0M cap
      })
    ).rejects.toThrow("Buyer concentration covenant breached");
  });

  it("enforces private credit score floor and Tier-C 80% advance rate guardrail", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);

    await expect(
      sim.pledgeInvoice(supplier1Sk, factor1Pk, auditorPk, 7500n, {
        ...validInvoiceA,
        invoiceDocHash: await sha256("INV-2026-LOW-SCORE"),
        creditScore: 595n,
      })
    ).rejects.toThrow("Private credit score below policy floor");

    await expect(
      sim.pledgeInvoice(supplier1Sk, factor1Pk, auditorPk, 8500n, {
        ...validInvoiceA,
        invoiceDocHash: await sha256("INV-2026-TIER-C-HIGH-ADV"),
        creditScore: 650n,
      })
    ).rejects.toThrow("Tier C invoices capped at 80% advance rate");

    const { result: nullifier } = await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8000n,
      {
        ...validInvoiceA,
        invoiceDocHash: await sha256("INV-2026-TIER-C-OK"),
        faceValueCents: 1_200_000n, // $12,000 -> BAND_MICRO
        creditScore: 650n,
      }
    );
    const deal = sim.lookupDeal(nullifier);
    expect(deal.riskTier).toBe(RiskTier.TIER_C_ENHANCED);
    expect(deal.amountBand).toBe(AmountBand.BAND_MICRO);
  });

  it("classifies institutional invoices ($250k-$5M) into BAND_INSTITUTIONAL and rejects out-of-bounds face values", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);

    await expect(
      sim.pledgeInvoice(supplier1Sk, factor1Pk, auditorPk, 8000n, {
        ...validInvoiceA,
        invoiceDocHash: await sha256("INV-TOO-SMALL"),
        faceValueCents: 50_000n, // $500 < $1,000 min
      })
    ).rejects.toThrow("Invoice face value below $1,000 minimum");

    const { result: nullifier } = await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8800n,
      {
        ...validInvoiceA,
        invoiceDocHash: await sha256("INV-INSTITUTIONAL-01"),
        faceValueCents: 42_000_000n, // $420,000
        buyerExposureCents: 10_000_000n,
        creditScore: 710n, // TIER_B_STANDARD
      }
    );
    const deal = sim.lookupDeal(nullifier);
    expect(deal.riskTier).toBe(RiskTier.TIER_B_STANDARD);
    expect(deal.amountBand).toBe(AmountBand.BAND_INSTITUTIONAL);
  });

  it("completes full PLEDGED -> FUNDED -> SETTLED lifecycle and enforces factor-only authorization", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    const { result: nullifier } = await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8500n,
      validInvoiceA
    );

    await expect(sim.fundDeal(factor2Sk, nullifier)).rejects.toThrow(
      "Unauthorized: caller is not designated factor"
    );

    await expect(sim.settleDeal(factor1Sk, nullifier)).rejects.toThrow(
      "Deal must be FUNDED before settlement"
    );

    const { ledger: afterFund } = await sim.fundDeal(factor1Sk, nullifier);
    expect(afterFund.totalFunded).toBe(1n);
    expect(afterFund.deals.lookup(nullifier).status).toBe(DealStatus.FUNDED);

    const { ledger: afterSettle } = await sim.settleDeal(factor1Sk, nullifier);
    expect(afterSettle.totalSettled).toBe(1n);
    expect(afterSettle.deals.lookup(nullifier).status).toBe(DealStatus.SETTLED);

    // Settled invoice nullifier stays permanently spent
    await expect(
      sim.pledgeInvoice(supplier1Sk, factor2Pk, auditorPk, 8000n, validInvoiceA)
    ).rejects.toThrow("Double-pledge blocked: invoice already financed");
  });

  it("verifies auditor-scoped selective disclosure seal without leaking terms publicly", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    const { result: nullifier } = await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8500n,
      validInvoiceA
    );
    await sim.fundDeal(factor1Sk, nullifier);

    await expect(
      sim.attestSelectiveDisclosure(
        rogueAuditorSk,
        nullifier,
        validInvoiceA.faceValueCents,
        validInvoiceA.creditScore
      )
    ).rejects.toThrow("Unauthorized: caller is not designated auditor");

    await expect(
      sim.attestSelectiveDisclosure(
        auditorSk,
        nullifier,
        validInvoiceA.faceValueCents + 100n,
        validInvoiceA.creditScore
      )
    ).rejects.toThrow("Selective disclosure seal mismatch");

    const { result: seal, ledger: afterAudit } =
      await sim.attestSelectiveDisclosure(
        auditorSk,
        nullifier,
        validInvoiceA.faceValueCents,
        validInvoiceA.creditScore
      );
    expect(afterAudit.totalAuditorDisclosures).toBe(1n);
    expect(afterAudit.deals.lookup(nullifier).disclosedToAuditor).toBe(true);
    expect(seal).toEqual(afterAudit.deals.lookup(nullifier).disclosureSeal);

    await expect(
      sim.attestSelectiveDisclosure(
        auditorSk,
        nullifier,
        validInvoiceA.faceValueCents,
        validInvoiceA.creditScore
      )
    ).rejects.toThrow("Deal already attested by auditor");
  });

  it("allows bilateral dispute freeze by supplier or factor, blocking unauthorized third parties", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    const { result: nullifier } = await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8500n,
      validInvoiceA
    );
    await sim.fundDeal(factor1Sk, nullifier);

    await expect(sim.flagDispute(factor2Sk, nullifier)).rejects.toThrow(
      "Unauthorized: caller is neither supplier nor factor"
    );

    const { ledger: afterDispute } = await sim.flagDispute(
      supplier1Sk,
      nullifier
    );
    expect(afterDispute.totalDisputed).toBe(1n);
    expect(afterDispute.deals.lookup(nullifier).status).toBe(
      DealStatus.DISPUTED
    );

    await expect(sim.settleDeal(factor1Sk, nullifier)).rejects.toThrow(
      "Deal must be FUNDED before settlement"
    );
  });

  it("allows funding factor to flag dispute and blocks duplicate disputes", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    const { result: nullifier } = await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8500n,
      validInvoiceA
    );
    await sim.fundDeal(factor1Sk, nullifier);
    const { ledger: disputed } = await sim.flagDispute(factor1Sk, nullifier);
    expect(disputed.deals.lookup(nullifier).status).toBe(DealStatus.DISPUTED);
    await expect(sim.flagDispute(supplier1Sk, nullifier)).rejects.toThrow(
      "Only active PLEDGED or FUNDED deals can be disputed"
    );
  });

  it("allows multiple distinct invoices for the same buyer while staying within concentration cap", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    const inv1 = await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8500n,
      validInvoiceA
    );
    const inv2 = await sim.pledgeInvoice(
      supplier1Sk,
      factor2Pk,
      auditorPk,
      8200n,
      {
        ...validInvoiceA,
        invoiceDocHash: await sha256("INV-2026-88413|PCB-LOT-10|NET60"),
        faceValueCents: 15_000_000n,
        buyerExposureCents: 48_500_000n, // $485k + $150k = $635k <= $1M
      }
    );
    expect(inv1.result).not.toEqual(inv2.result);
    expect(sim.getLedger().totalPledged).toBe(2n);
    expect(sim.getLedger().pledgedNullifiers.size()).toBe(2n);
  });

  it("enforces tightened admin risk policy on subsequent pledges without breaking existing deals", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    const { result: n1 } = await sim.pledgeInvoice(
      supplier1Sk,
      factor1Pk,
      auditorPk,
      8500n,
      validInvoiceA
    );
    await sim.updateRiskPolicy(adminSk, {
      minCreditScore: 800n,
      maxAdvanceBps: 8500n,
      maxBuyerConcentrationCents: 50_000_000n,
    });
    // Score 790 now rejected under tightened 800 floor
    await expect(
      sim.pledgeInvoice(supplier1Sk, factor1Pk, auditorPk, 8000n, {
        ...validInvoiceA,
        invoiceDocHash: await sha256("INV-AFTER-TIGHTEN"),
      })
    ).rejects.toThrow("Private credit score below policy floor");
    // Prior deal n1 still funds cleanly
    await sim.fundDeal(factor1Sk, n1);
    expect(sim.lookupDeal(n1).status).toBe(DealStatus.FUNDED);
  });

  it("enforces strict domain separation across admin, supplier, factor, and auditor PKs", () => {
    const pkAdmin = pureCircuits.deriveAdminPk(supplier1Sk);
    const pkSupplier = pureCircuits.deriveSupplierPk(supplier1Sk);
    const pkFactor = pureCircuits.deriveFactorPk(supplier1Sk);
    const pkAuditor = pureCircuits.deriveAuditorPk(supplier1Sk);
    const unique = new Set([
      toHex(pkAdmin),
      toHex(pkSupplier),
      toHex(pkFactor),
      toHex(pkAuditor),
    ]);
    expect(unique.size).toBe(4);
  });

  it("property invariant: 20 randomized invoices satisfy zero-leakage and tier/band classification", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    for (let i = 0; i < 20; i++) {
      // Deterministic pseudo-random spread across valid score (620..845), face value ($2k..$900k), exposure
      const creditScore = BigInt(620 + ((i * 37) % 225));
      const faceValueCents = BigInt(200_000 + ((i * 4_321_987) % 85_000_000));
      const buyerExposureCents = BigInt((i * 1_111_111) % 10_000_000);
      const isTierC = creditScore < 680n;
      const requestedAdvanceBps = isTierC ? 7800n : 8500n;
      const docHash = await sha256(`PROP-INV-${i}-DOC-${faceValueCents}`);
      const buyerTaxHash = await sha256(`PROP-BUYER-${i % 7}`);
      const salt = await sha256(`PROP-SALT-${i}`);

      const { result: nullifier } = await sim.pledgeInvoice(
        supplier1Sk,
        factor1Pk,
        auditorPk,
        requestedAdvanceBps,
        {
          invoiceDocHash: docHash,
          buyerTaxHash,
          faceValueCents,
          buyerExposureCents,
          creditScore,
          invoiceSalt: salt,
        }
      );

      const deal = sim.lookupDeal(nullifier);
      const expectedTier =
        creditScore >= 760n
          ? RiskTier.TIER_A_PRIME
          : creditScore >= 680n
            ? RiskTier.TIER_B_STANDARD
            : RiskTier.TIER_C_ENHANCED;
      const expectedBand =
        faceValueCents < 2_500_000n
          ? AmountBand.BAND_MICRO
          : faceValueCents < 25_000_000n
            ? AmountBand.BAND_MID
            : AmountBand.BAND_INSTITUTIONAL;
      expect(deal.riskTier).toBe(expectedTier);
      expect(deal.amountBand).toBe(expectedBand);

      // Verify zero raw witness leakage in serialized public deal summary
      const publicDump = JSON.stringify({
        supplierPk: toHex(deal.supplierPk),
        factorPk: toHex(deal.factorPk),
        auditorPk: toHex(deal.auditorPk),
        commitment: toHex(deal.invoiceCommitment),
        seal: toHex(deal.disclosureSeal),
        riskTier: deal.riskTier,
        amountBand: deal.amountBand,
        advanceBps: deal.advanceBps.toString(),
      });
      expect(publicDump).not.toContain(toHex(docHash));
      expect(publicDump).not.toContain(toHex(buyerTaxHash));
      expect(publicDump).not.toContain(toHex(salt));
      expect(publicDump).not.toContain(faceValueCents.toString());
    }
    expect(sim.getLedger().totalPledged).toBe(20n);
    expect(sim.getLedger().pledgedNullifiers.size()).toBe(20n);
  });

  it("property invariant: cross-wallet & cross-salt replay is rejected 100% of the time across 10 trials", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    for (let i = 0; i < 10; i++) {
      const docHash = await sha256(`REPLAY-DOC-${i}`);
      const buyerTaxHash = await sha256(`REPLAY-BUYER-${i}`);
      await sim.pledgeInvoice(supplier1Sk, factor1Pk, auditorPk, 8200n, {
        invoiceDocHash: docHash,
        buyerTaxHash,
        faceValueCents: 1_500_000n + BigInt(i) * 250_000n,
        buyerExposureCents: 0n,
        creditScore: 770n,
        invoiceSalt: await sha256(`ORIG-SALT-${i}`),
      });
      // Second supplier wallet + fresh salt + different factor MUST fail inside Compact ZK circuit
      const shellSupplierSk = await sha256(`SHELL-WALLET-${i}`);
      const secondFactorPk = pureCircuits.deriveFactorPk(await sha256(`FACTOR-B-${i}`));
      await expect(
        sim.pledgeInvoice(shellSupplierSk, secondFactorPk, auditorPk, 8000n, {
          invoiceDocHash: docHash,
          buyerTaxHash,
          faceValueCents: 1_500_000n + BigInt(i) * 250_000n,
          buyerExposureCents: 0n,
          creditScore: 810n,
          invoiceSalt: await sha256(`FRESH-SALT-${i}`),
        })
      ).rejects.toThrow("Double-pledge blocked");
    }
    expect(sim.getLedger().pledgedNullifiers.size()).toBe(10n);
  });

  it("property invariant: Tier-C (<680 score) advance > 8000 bps is always rejected across boundary scores", async () => {
    const sim = await VeilFactorSimulator.create(adminSk);
    for (const score of [620n, 650n, 679n]) {
      await expect(
        sim.pledgeInvoice(supplier1Sk, factor1Pk, auditorPk, 8001n, {
          ...validInvoiceA,
          invoiceDocHash: await sha256(`TIERC-FAIL-${score}`),
          creditScore: score,
        })
      ).rejects.toThrow("Tier C invoices capped at 80% advance rate");
    }
    // Score 680 (Tier-B boundary) at 8001 bps MUST succeed
    const { result } = await sim.pledgeInvoice(supplier1Sk, factor1Pk, auditorPk, 8001n, {
      ...validInvoiceA,
      invoiceDocHash: await sha256("TIERB-PASS-680"),
      creditScore: 680n,
    });
    expect(sim.lookupDeal(result).riskTier).toBe(RiskTier.TIER_B_STANDARD);
  });
});
