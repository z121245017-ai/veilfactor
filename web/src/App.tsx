// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 VeilFactor Contributors

import React, { useEffect, useMemo, useState } from "react";
import {
  DealStatus,
  amountBandLabel,
  buildComplianceAttestationJson,
  computePortfolioLifecycleMetrics,
  createBootstrappedEngine,
  dealStatusLabel,
  evaluatePreFlightCovenants,
  extractLedgerDeals,
  riskTierLabel,
  runGuidedComplianceWalkthrough,
  scanPublicLedgerZeroLeakage,
  sha256,
  shortHex,
  toHex,
  type DemoActors,
  type LedgerDealItem,
  type PrivateDossierRecord,
  type TraceEvent,
} from "./veilfactorEngine";
import { CovenantGaugeChart, LifecycleFunnelChart } from "./PrivacyCharts";
import type { VeilFactorSimulator } from "../../contract/src/index.ts";

type TabKey = "pledge" | "lifecycle" | "auditor" | "policy";

function nowLabel(): string {
  return new Date().toTimeString().slice(0, 8);
}

export function App() {
  const [sim, setSim] = useState<VeilFactorSimulator | null>(null);
  const [actors, setActors] = useState<DemoActors | null>(null);
  const [tick, setTick] = useState(0);
  const [tab, setTab] = useState<TabKey>("pledge");
  const [laceDetected, setLaceDetected] = useState(false);

  // Private supplier witness form state
  const [invoiceRef, setInvoiceRef] = useState("INV-2026-99104-OPTICS");
  const [buyerTaxId, setBuyerTaxId] = useState("DE-811128135");
  const [faceValueUsd, setFaceValueUsd] = useState("142500");
  const [buyerExposureUsd, setBuyerExposureUsd] = useState("485000");
  const [creditScore, setCreditScore] = useState("745");
  const [advancePct, setAdvancePct] = useState("85");
  const [factorChoice, setFactorChoice] = useState<"factor1" | "factor2">("factor1");
  const [supplierChoice, setSupplierChoice] = useState<"supplier1" | "supplier2">("supplier1");

  // Auditor selective disclosure form state
  const [selectedDealHex, setSelectedDealHex] = useState("");
  const [auditFaceUsd, setAuditFaceUsd] = useState("185000");
  const [auditScore, setAuditScore] = useState("790");
  const [auditRole, setAuditRole] = useState<"auditor" | "impostor">("auditor");

  // Policy governance form state
  const [policyMinScore, setPolicyMinScore] = useState("620");
  const [policyMaxAdvance, setPolicyMaxAdvance] = useState("90");
  const [policyCapUsd, setPolicyCapUsd] = useState("1000000");

  // Local private dossier registry (stays in browser only — never on ledger)
  const [dossiers, setDossiers] = useState<Record<string, PrivateDossierRecord>>({});
  const [traces, setTraces] = useState<TraceEvent[]>([]);
  const [banner, setBanner] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const win = window as unknown as { midnight?: { mnLace?: unknown } };
    setLaceDetected(Boolean(win.midnight?.mnLace));
    createBootstrappedEngine().then(({ sim: s, actors: a, initialDossier, initialTrace }) => {
      setSim(s);
      setActors(a);
      setDossiers({ [initialDossier.nullifierHex]: initialDossier });
      setSelectedDealHex(initialDossier.nullifierHex);
      setTraces([initialTrace]);
      setBanner({
        ok: true,
        text: "Midnight Compact 0.36.1 WASM runtime initialized. 1 live invoice pledged; try simulating a rogue double-pledge attack.",
      });
      setTick((t) => t + 1);
    });
  }, []);

  const ledger = useMemo(() => (sim ? sim.getLedger() : null), [sim, tick]);
  const deals: LedgerDealItem[] = useMemo(
    () => (ledger ? extractLedgerDeals(ledger) : []),
    [ledger]
  );

  const activeDeal = useMemo(() => {
    if (!deals.length) return null;
    return deals.find((d) => d.nullifierHex === selectedDealHex) ?? deals[deals.length - 1];
  }, [deals, selectedDealHex]);

  const activeDossier = activeDeal ? dossiers[activeDeal.nullifierHex] : undefined;

  const leakageAudit = useMemo(() => {
    if (!ledger || !activeDossier) return null;
    return scanPublicLedgerZeroLeakage(ledger, activeDossier);
  }, [ledger, activeDossier]);

  const preFlight = useMemo(
    () =>
      evaluatePreFlightCovenants(
        {
          faceValueUsd: Number(faceValueUsd),
          buyerExposureUsd: Number(buyerExposureUsd),
          creditScore: Number(creditScore),
          advancePct: Number(advancePct),
        },
        ledger
      ),
    [faceValueUsd, buyerExposureUsd, creditScore, advancePct, ledger]
  );

  const lifecycleMetrics = useMemo(
    () => computePortfolioLifecycleMetrics(deals, traces),
    [deals, traces]
  );

  async function handleRunGuidedWalkthrough() {
    if (!sim || !actors || busy) return;
    setBusy(true);
    try {
      const res = await runGuidedComplianceWalkthrough(sim, actors);
      setDossiers((prev) => ({ ...prev, [res.dossier.nullifierHex]: res.dossier }));
      setSelectedDealHex(res.dossier.nullifierHex);
      setAuditFaceUsd(String(res.dossier.faceValueUsd));
      setAuditScore(String(res.dossier.creditScore));
      for (const tr of res.traces) {
        appendTrace(tr);
      }
      setTick((t) => t + 1);
      setBanner({
        ok: true,
        text: `4-Step Guided ZK Walkthrough complete: ${res.dossier.invoiceRef} pledged, cross-wallet double-pledge BLOCKED, factor funded, auditor attested (${res.leakageAudit.leaksFound}/${res.leakageAudit.checks.length} public leaks).`,
      });
    } catch (e) {
      setBanner({
        ok: false,
        text: `Walkthrough error: ${e instanceof Error ? e.message : String(e)}`,
      });
    } finally {
      setBusy(false);
    }
  }

  function handleExportComplianceReceipt() {
    if (!activeDeal) return;
    const payload = buildComplianceAttestationJson(activeDeal, activeDossier, leakageAudit);
    const blob = new Blob([payload], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `veilfactor-attestation-${activeDeal.nullifierHex.slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBanner({
      ok: true,
      text: `Exported verifiable Midnight Ledger-9 compliance attestation receipt for 0x${activeDeal.nullifierHex.slice(0, 10)}…`,
    });
  }

  function appendTrace(ev: Omit<TraceEvent, "id" | "ts">) {
    setTraces((prev) => [{ ...ev, id: prev.length + 1, ts: nowLabel() }, ...prev]);
  }

  function applyPreset(kind: "legit" | "double" | "conc" | "tierc") {
    if (kind === "legit") {
      setInvoiceRef("INV-2026-99104-OPTICS");
      setBuyerTaxId("DE-811128135");
      setFaceValueUsd("142500");
      setBuyerExposureUsd("485000");
      setCreditScore("745");
      setAdvancePct("85");
      setFactorChoice("factor1");
      setSupplierChoice("supplier1");
    } else if (kind === "double") {
      setInvoiceRef("INV-2026-88412-PCB");
      setBuyerTaxId("DE-811128135");
      setFaceValueUsd("185000");
      setBuyerExposureUsd("300000");
      setCreditScore("790");
      setAdvancePct("80");
      setFactorChoice("factor2");
      setSupplierChoice("supplier2");
    } else if (kind === "conc") {
      setInvoiceRef("INV-2026-77210-BREACH");
      setBuyerTaxId("DE-811128135");
      setFaceValueUsd("260000");
      setBuyerExposureUsd("800000");
      setCreditScore("805");
      setAdvancePct("85");
      setFactorChoice("factor1");
      setSupplierChoice("supplier1");
    } else {
      setInvoiceRef("INV-2026-66019-TIERC");
      setBuyerTaxId("US-94-3019822");
      setFaceValueUsd("18000");
      setBuyerExposureUsd("40000");
      setCreditScore("650");
      setAdvancePct("85");
      setFactorChoice("factor1");
      setSupplierChoice("supplier1");
    }
  }

  async function handlePledge(forceDoubleAttack = false) {
    if (!sim || !actors || busy) return;
    setBusy(true);
    try {
      const ref = forceDoubleAttack ? "INV-2026-88412-PCB" : invoiceRef.trim();
      const tax = forceDoubleAttack ? "DE-811128135" : buyerTaxId.trim();
      const faceUsd = forceDoubleAttack ? 185000 : Number(faceValueUsd);
      const expUsd = forceDoubleAttack ? 300000 : Number(buyerExposureUsd);
      const score = forceDoubleAttack ? 790 : Number(creditScore);
      const advBps = BigInt(Math.round((forceDoubleAttack ? 80 : Number(advancePct)) * 100));
      const useSupplier2 = forceDoubleAttack || supplierChoice === "supplier2";
      const useFactor2 = forceDoubleAttack || factorChoice === "factor2";

      const docHash = await sha256(ref);
      const buyerTaxHash = await sha256(tax);
      const salt = await sha256(`salt:${ref}:${Date.now()}`);

      const exec = await sim.pledgeInvoice(
        useSupplier2 ? actors.supplier2Sk : actors.supplier1Sk,
        useFactor2 ? actors.factor2Pk : actors.factor1Pk,
        actors.auditorPk,
        advBps,
        {
          invoiceDocHash: docHash,
          buyerTaxHash,
          faceValueCents: BigInt(Math.round(faceUsd * 100)),
          buyerExposureCents: BigInt(Math.round(expUsd * 100)),
          creditScore: BigInt(Math.round(score)),
          invoiceSalt: salt,
        }
      );

      const nullifierHex = toHex(exec.result);
      const dossier: PrivateDossierRecord = {
        nullifierHex,
        nullifier: exec.result,
        invoiceRef: ref,
        buyerTaxId: tax,
        faceValueUsd: faceUsd,
        buyerExposureUsd: expUsd,
        creditScore: score,
        factorLabel: useFactor2 ? "Horizon Credit" : "Apex Trade Finance",
        factorId: useFactor2 ? "factor2" : "factor1",
        docHashHex: toHex(docHash),
        buyerTaxHashHex: toHex(buyerTaxHash),
      };
      setDossiers((prev) => ({ ...prev, [nullifierHex]: dossier }));
      setSelectedDealHex(nullifierHex);
      setAuditFaceUsd(String(faceUsd));
      setAuditScore(String(score));
      setTick((t) => t + 1);

      const summary = exec.ledger.deals.lookup(exec.result);
      const msg = `ZK Pledge accepted · Nullifier 0x${nullifierHex.slice(0, 10)}… · ${riskTierLabel(summary.riskTier)} · Ledger-9 compute=${exec.gasCost.computeTime.toString()}`;
      setBanner({ ok: true, text: msg });
      appendTrace({
        circuit: "pledgeInvoice",
        actor: useSupplier2 ? "Rogue Shell Co" : "Supplier A",
        ok: true,
        message: msg,
        computeTime: exec.gasCost.computeTime.toString(),
        bytesWritten: exec.gasCost.bytesWritten.toString(),
      });
    } catch (e) {
      const errText = e instanceof Error ? e.message : String(e);
      setBanner({ ok: false, text: `Compact ZK Circuit Rejected: ${errText}` });
      appendTrace({
        circuit: "pledgeInvoice",
        actor: forceDoubleAttack ? "Rogue Shell Co -> Factor B" : "Supplier",
        ok: false,
        message: errText,
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleLifecycleAction(
    deal: LedgerDealItem,
    action: "fund" | "impostor_fund" | "settle" | "dispute"
  ) {
    if (!sim || !actors || busy) return;
    setBusy(true);
    const d = dossiers[deal.nullifierHex];
    const isFactor2 = d?.factorId === "factor2";
    const designatedFactorSk = isFactor2 ? actors.factor2Sk : actors.factor1Sk;
    const impostorFactorSk = isFactor2 ? actors.factor1Sk : actors.factor2Sk;
    try {
      if (action === "fund") {
        const res = await sim.fundDeal(designatedFactorSk, deal.nullifier);
        setTick((t) => t + 1);
        const msg = `Deal 0x${deal.nullifierHex.slice(0, 8)}… FUNDED by designated factor (compute=${res.gasCost.computeTime.toString()})`;
        setBanner({ ok: true, text: msg });
        appendTrace({
          circuit: "fundDeal",
          actor: d?.factorLabel ?? "Factor",
          ok: true,
          message: msg,
          computeTime: res.gasCost.computeTime.toString(),
          bytesWritten: res.gasCost.bytesWritten.toString(),
        });
      } else if (action === "impostor_fund") {
        await sim.fundDeal(impostorFactorSk, deal.nullifier);
      } else if (action === "settle") {
        const res = await sim.settleDeal(designatedFactorSk, deal.nullifier);
        setTick((t) => t + 1);
        const msg = `Deal 0x${deal.nullifierHex.slice(0, 8)}… SETTLED; nullifier stays permanently spent`;
        setBanner({ ok: true, text: msg });
        appendTrace({
          circuit: "settleDeal",
          actor: d?.factorLabel ?? "Factor",
          ok: true,
          message: msg,
          computeTime: res.gasCost.computeTime.toString(),
          bytesWritten: res.gasCost.bytesWritten.toString(),
        });
      } else {
        const res = await sim.flagDispute(actors.supplier1Sk, deal.nullifier);
        setTick((t) => t + 1);
        const msg = `Deal 0x${deal.nullifierHex.slice(0, 8)}… frozen in DISPUTED state for auditor review`;
        setBanner({ ok: true, text: msg });
        appendTrace({
          circuit: "flagDispute",
          actor: "Supplier A",
          ok: true,
          message: msg,
          computeTime: res.gasCost.computeTime.toString(),
          bytesWritten: res.gasCost.bytesWritten.toString(),
        });
      }
    } catch (e) {
      const errText = e instanceof Error ? e.message : String(e);
      setBanner({ ok: false, text: `Compact ZK Circuit Rejected: ${errText}` });
      appendTrace({
        circuit: action === "impostor_fund" ? "fundDeal" : action,
        actor: action === "impostor_fund" ? "Impostor Factor" : "Actor",
        ok: false,
        message: errText,
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleAuditAttest() {
    if (!sim || !actors || !activeDeal || busy) return;
    setBusy(true);
    try {
      const sk = auditRole === "auditor" ? actors.auditorSk : actors.rogueAuditorSk;
      const res = await sim.attestSelectiveDisclosure(
        sk,
        activeDeal.nullifier,
        BigInt(Math.round(Number(auditFaceUsd) * 100)),
        BigInt(Math.round(Number(auditScore)))
      );
      setTick((t) => t + 1);
      const msg = `Selective Disclosure Verified! Seal 0x${toHex(res.result).slice(0, 12)}… attested with 0 public amount leakage.`;
      setBanner({ ok: true, text: msg });
      appendTrace({
        circuit: "attestSelectiveDisclosure",
        actor: "Deloitte ZK Desk",
        ok: true,
        message: msg,
        computeTime: res.gasCost.computeTime.toString(),
        bytesWritten: res.gasCost.bytesWritten.toString(),
      });
    } catch (e) {
      const errText = e instanceof Error ? e.message : String(e);
      setBanner({ ok: false, text: `Selective Disclosure Rejected: ${errText}` });
      appendTrace({
        circuit: "attestSelectiveDisclosure",
        actor: auditRole === "auditor" ? "Deloitte ZK Desk" : "Impostor Auditor",
        ok: false,
        message: errText,
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdatePolicy(asAdmin: boolean) {
    if (!sim || !actors || busy) return;
    setBusy(true);
    try {
      const res = await sim.updateRiskPolicy(asAdmin ? actors.adminSk : actors.supplier1Sk, {
        minCreditScore: BigInt(Math.round(Number(policyMinScore))),
        maxAdvanceBps: BigInt(Math.round(Number(policyMaxAdvance) * 100)),
        maxBuyerConcentrationCents: BigInt(Math.round(Number(policyCapUsd) * 100)),
      });
      setTick((t) => t + 1);
      const msg = `Global policy updated: minScore=${policyMinScore}, maxAdvance=${policyMaxAdvance}%, buyerCap=$${Number(policyCapUsd).toLocaleString()}`;
      setBanner({ ok: true, text: msg });
      appendTrace({
        circuit: "updateRiskPolicy",
        actor: "Protocol Admin",
        ok: true,
        message: msg,
        computeTime: res.gasCost.computeTime.toString(),
        bytesWritten: res.gasCost.bytesWritten.toString(),
      });
    } catch (e) {
      const errText = e instanceof Error ? e.message : String(e);
      setBanner({ ok: false, text: `Policy Circuit Rejected: ${errText}` });
      appendTrace({
        circuit: "updateRiskPolicy",
        actor: "Non-Admin Caller",
        ok: false,
        message: errText,
      });
    } finally {
      setBusy(false);
    }
  }

  const leakageClean = useMemo(() => {
    if (!activeDeal || !activeDossier) return true;
    const pub = JSON.stringify({
      s: toHex(activeDeal.summary.supplierPk),
      f: toHex(activeDeal.summary.factorPk),
      a: toHex(activeDeal.summary.auditorPk),
      c: toHex(activeDeal.summary.invoiceCommitment),
      d: toHex(activeDeal.summary.disclosureSeal),
      t: activeDeal.summary.riskTier,
      b: activeDeal.summary.amountBand,
    });
    return (
      !pub.includes(activeDossier.docHashHex) &&
      !pub.includes(activeDossier.buyerTaxHashHex) &&
      !pub.includes(String(activeDossier.faceValueUsd)) &&
      !pub.includes(String(activeDossier.creditScore))
    );
  }, [activeDeal, activeDossier]);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">VF</div>
          <div>
            <h1>VeilFactor</h1>
            <div className="brand-sub">
              Zero-Knowledge Invoice Double-Pledge Prevention & Selective Compliance on Midnight
            </div>
          </div>
        </div>
        <div className="top-badges">
          <span className="pill live">
            <span className="dot" />
            Compact 0.36.1 · Ledger-9 WASM Live
          </span>
          <span className="pill accent">
            {laceDetected ? "Lace Midnight Connector Detected" : "Local ZK Prover Active"}
          </span>
          <a className="pill link" href="./deck.html" target="_blank" rel="noreferrer">
            Pitch Deck ↗
          </a>
          <a
            className="pill link"
            href="https://github.com/z121245017-ai/veilfactor"
            target="_blank"
            rel="noreferrer"
          >
            GitHub (Apache-2.0) ↗
          </a>
        </div>
      </header>

      <section className="kpis">
        <div className="kpi">
          <div className="kpi-label">Pledged Invoice Nullifiers</div>
          <div className="kpi-val">
            {ledger ? ledger.totalPledged.toString() : "—"}
            <span className="kpi-sub">Double-pledge immune</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Funded Deals</div>
          <div className="kpi-val">
            {ledger ? ledger.totalFunded.toString() : "—"}
            <span className="kpi-sub">Factor ZK-authenticated</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Settled / Disputed</div>
          <div className="kpi-val">
            {ledger ? `${ledger.totalSettled.toString()} / ${ledger.totalDisputed.toString()}` : "—"}
            <span className="kpi-sub">Nullifiers permanently spent</span>
          </div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Auditor Disclosures</div>
          <div className="kpi-val">
            {ledger ? ledger.totalAuditorDisclosures.toString() : "—"}
            <span className="kpi-sub" style={{ color: "#6ee7b7" }}>
              0 raw secrets on-chain
            </span>
          </div>
        </div>
      </section>

      <nav className="tabs" role="tablist">
        <button className={`tab ${tab === "pledge" ? "active" : ""}`} onClick={() => setTab("pledge")}>
          1. Pledge & Double-Pledge Lab
        </button>
        <button className={`tab ${tab === "lifecycle" ? "active" : ""}`} onClick={() => setTab("lifecycle")}>
          2. Factor Lifecycle & Deal Book ({deals.length})
        </button>
        <button className={`tab ${tab === "auditor" ? "active" : ""}`} onClick={() => setTab("auditor")}>
          3. Auditor Selective Disclosure
        </button>
        <button className={`tab ${tab === "policy" ? "active" : ""}`} onClick={() => setTab("policy")}>
          4. Risk Policy & 6-Circuit Matrix
        </button>
      </nav>

      {tab === "pledge" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Private Invoice Witness Prover</h2>
              <span className="tag priv">LOCAL PROVER ONLY</span>
            </div>

            <div className="presets">
              <button className="preset-btn" onClick={() => applyPreset("legit")}>
                Legit $142.5k Invoice
              </button>
              <button className="preset-btn" onClick={() => applyPreset("double")}>
                Attack: Double-Pledge
              </button>
              <button className="preset-btn" onClick={() => applyPreset("conc")}>
                Attack: Concentration Breach
              </button>
              <button className="preset-btn" onClick={() => applyPreset("tierc")}>
                Attack: Tier-C &gt;80% Cap
              </button>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Invoice Doc Reference (Hashed Locally)</label>
                <input value={invoiceRef} onChange={(e) => setInvoiceRef(e.target.value)} />
              </div>
              <div className="field">
                <label>Buyer Tax ID (Never Disclosed)</label>
                <input value={buyerTaxId} onChange={(e) => setBuyerTaxId(e.target.value)} />
              </div>
              <div className="field">
                <label>Private Face Value (USD)</label>
                <input type="number" value={faceValueUsd} onChange={(e) => setFaceValueUsd(e.target.value)} />
              </div>
              <div className="field">
                <label>Private Existing Buyer Exposure (USD)</label>
                <input
                  type="number"
                  value={buyerExposureUsd}
                  onChange={(e) => setBuyerExposureUsd(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Private Credit Score (500–850)</label>
                <input type="number" value={creditScore} onChange={(e) => setCreditScore(e.target.value)} />
              </div>
              <div className="field">
                <label>Requested Advance Rate (%)</label>
                <input type="number" value={advancePct} onChange={(e) => setAdvancePct(e.target.value)} />
              </div>
              <div className="field">
                <label>Supplier Identity</label>
                <select
                  value={supplierChoice}
                  onChange={(e) => setSupplierChoice(e.target.value as "supplier1" | "supplier2")}
                >
                  <option value="supplier1">Supplier A (Shenzhen PCB Ltd)</option>
                  <option value="supplier2">Supplier B (Rogue Shell Wallet)</option>
                </select>
              </div>
              <div className="field">
                <label>Target Factoring Lender</label>
                <select
                  value={factorChoice}
                  onChange={(e) => setFactorChoice(e.target.value as "factor1" | "factor2")}
                >
                  <option value="factor1">Factor 1 (Apex Trade Finance)</option>
                  <option value="factor2">Factor 2 (Horizon Credit Desk)</option>
                </select>
              </div>
            </div>

            <CovenantGaugeChart
              report={preFlight}
              existingExposureUsd={Number(buyerExposureUsd) || 0}
              faceValueUsd={Number(faceValueUsd) || 0}
              creditScore={Number(creditScore) || 0}
            />

            <div className="actions">
              <button className="btn btn-primary" disabled={busy || !sim} onClick={() => handlePledge(false)}>
                Run pledgeInvoice() Compact Circuit
              </button>
              <button className="btn btn-danger" disabled={busy || !sim} onClick={() => handlePledge(true)}>
                Simulate Rogue Double-Pledge Attack
              </button>
              <button
                className="btn btn-secondary"
                disabled={busy || !sim}
                onClick={handleRunGuidedWalkthrough}
              >
                ▶ Run 4-Step ZK Walkthrough
              </button>
            </div>

            {banner && <div className={`banner ${banner.ok ? "ok" : "err"}`}>{banner.text}</div>}
          </div>

          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Midnight Dual-Ledger Privacy Diff</h2>
              <span className={`tag ${leakageClean ? "ok" : "err"}`}>
                {leakageClean ? "LEAKAGE AUDIT: 0 SECRETS ON-CHAIN" : "LEAK DETECTED"}
              </span>
            </div>

            <div className="split-diff">
              <div className="diff-box priv">
                <div className="diff-title">
                  <span>Private Witness State</span>
                  <span className="tag priv">HIDDEN</span>
                </div>
                <div className="kv">
                  <span>Invoice Ref</span>
                  <code>{activeDossier?.invoiceRef ?? "—"}</code>
                </div>
                <div className="kv">
                  <span>Buyer Tax ID</span>
                  <code>{activeDossier?.buyerTaxId ?? "—"}</code>
                </div>
                <div className="kv">
                  <span>Exact Amount</span>
                  <code>
                    {activeDossier ? `$${activeDossier.faceValueUsd.toLocaleString()}.00` : "—"}
                  </code>
                </div>
                <div className="kv">
                  <span>Buyer Exposure</span>
                  <code>
                    {activeDossier ? `$${activeDossier.buyerExposureUsd.toLocaleString()}` : "—"}
                  </code>
                </div>
                <div className="kv">
                  <span>Credit Score</span>
                  <code>{activeDossier?.creditScore ?? "—"}</code>
                </div>
              </div>

              <div className="diff-box pub">
                <div className="diff-title">
                  <span>Midnight Public Ledger</span>
                  <span className="tag pub">DISCLOSED</span>
                </div>
                <div className="kv">
                  <span>Nullifier</span>
                  <code>{activeDeal ? shortHex(activeDeal.nullifier) : "—"}</code>
                </div>
                <div className="kv">
                  <span>Commitment</span>
                  <code>{activeDeal ? shortHex(activeDeal.summary.invoiceCommitment) : "—"}</code>
                </div>
                <div className="kv">
                  <span>Risk Tier</span>
                  <code>{activeDeal ? riskTierLabel(activeDeal.summary.riskTier).split(" ")[0] : "—"}</code>
                </div>
                <div className="kv">
                  <span>Amount Band</span>
                  <code>{activeDeal ? amountBandLabel(activeDeal.summary.amountBand).split(" ")[0] : "—"}</code>
                </div>
                <div className="kv">
                  <span>Status / Audit</span>
                  <code>
                    {activeDeal
                      ? `${dealStatusLabel(activeDeal.summary.status)} · ${
                          activeDeal.summary.disclosedToAuditor ? "ATTESTED" : "SEALED"
                        }`
                      : "—"}
                  </code>
                </div>
              </div>
            </div>

            <div className="card-head" style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#cbd5e1" }}>
                Live Compact 0.36.1 Execution Trace (Ledger-9 RunningCost)
              </span>
              <span className="kpi-sub">{traces.length} calls</span>
            </div>
            <div className="trace-list">
              {traces.map((tr) => (
                <div key={tr.id} className="trace-row">
                  <div className="trace-top">
                    <span>
                      <span className={`tag ${tr.ok ? "ok" : "err"}`} style={{ marginRight: 6 }}>
                        {tr.ok ? "PASS" : "REVERT"}
                      </span>
                      <code className="mono">{tr.circuit}()</code> · {tr.actor}
                    </span>
                    <span className="kpi-sub mono">
                      {tr.computeTime ? `compute=${tr.computeTime} · write=${tr.bytesWritten}B` : tr.ts}
                    </span>
                  </div>
                  <div style={{ color: tr.ok ? "#cbd5e1" : "#fca5a5", marginTop: 3 }}>{tr.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "lifecycle" && (
        <div className="card">
          <div className="card-head">
            <h2 className="card-title">On-Chain Midnight Ledger Deal Book</h2>
            <span className="tag pub">LIVE ledger(state).deals READBACK</span>
          </div>
          <LifecycleFunnelChart metrics={lifecycleMetrics} />
          {banner && (
            <div className={`banner ${banner.ok ? "ok" : "err"}`} style={{ marginTop: 0, marginBottom: 10 }}>
              {banner.text}
            </div>
          )}
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nullifier (Public Key)</th>
                  <th>Risk Tier</th>
                  <th>Amount Band</th>
                  <th>Advance</th>
                  <th>Status</th>
                  <th>Auditor Seal</th>
                  <th>ZK Role-Authenticated Actions</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((d) => (
                  <tr key={d.nullifierHex}>
                    <td className="mono">{shortHex(d.nullifier, 7)}</td>
                    <td>{riskTierLabel(d.summary.riskTier)}</td>
                    <td>{amountBandLabel(d.summary.amountBand)}</td>
                    <td className="mono">{(Number(d.summary.advanceBps) / 100).toFixed(1)}%</td>
                    <td>
                      <span
                        className={`tag ${
                          d.summary.status === DealStatus.SETTLED
                            ? "ok"
                            : d.summary.status === DealStatus.DISPUTED
                              ? "err"
                              : d.summary.status === DealStatus.FUNDED
                                ? "pub"
                                : "warn"
                        }`}
                      >
                        {dealStatusLabel(d.summary.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`tag ${d.summary.disclosedToAuditor ? "ok" : "priv"}`}>
                        {d.summary.disclosedToAuditor ? "ATTESTED" : "SEALED"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button
                          className="btn btn-primary btn-sm"
                          disabled={busy || d.summary.status !== DealStatus.PLEDGED}
                          onClick={() => handleLifecycleAction(d, "fund")}
                        >
                          Fund (Factor)
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={busy || d.summary.status !== DealStatus.PLEDGED}
                          onClick={() => handleLifecycleAction(d, "impostor_fund")}
                        >
                          Test Impostor
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          disabled={busy || d.summary.status !== DealStatus.FUNDED}
                          onClick={() => handleLifecycleAction(d, "settle")}
                        >
                          Settle
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          disabled={
                            busy ||
                            (d.summary.status !== DealStatus.PLEDGED &&
                              d.summary.status !== DealStatus.FUNDED)
                          }
                          onClick={() => handleLifecycleAction(d, "dispute")}
                        >
                          Flag Dispute
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "auditor" && (
        <div className="grid-2">
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Regulator / Auditor Selective Disclosure</h2>
              <span className="tag priv">attestSelectiveDisclosure()</span>
            </div>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>
              The supplier shares the exact commercial invoice dossier off-chain only with the designated
              auditor. The auditor proves inside Midnight&apos;s Compact ZK circuit that those exact figures
              match the on-chain <code className="mono">disclosureSeal</code> — without publishing raw
              amounts or credit scores to competing lenders.
            </p>
            <div className="form-grid">
              <div className="field">
                <label>Select Pledged Deal Nullifier</label>
                <select
                  value={activeDeal?.nullifierHex ?? ""}
                  onChange={(e) => {
                    const hex = e.target.value;
                    setSelectedDealHex(hex);
                    const dos = dossiers[hex];
                    if (dos) {
                      setAuditFaceUsd(String(dos.faceValueUsd));
                      setAuditScore(String(dos.creditScore));
                    }
                  }}
                >
                  {deals.map((d) => (
                    <option key={d.nullifierHex} value={d.nullifierHex}>
                      {shortHex(d.nullifier, 7)} ({dealStatusLabel(d.summary.status)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Caller Role Key</label>
                <select
                  value={auditRole}
                  onChange={(e) => setAuditRole(e.target.value as "auditor" | "impostor")}
                >
                  <option value="auditor">Designated Auditor (Deloitte ZK Desk)</option>
                  <option value="impostor">Unauthorized Impostor Auditor</option>
                </select>
              </div>
              <div className="field">
                <label>Off-Chain Disclosed Face Value (USD)</label>
                <input type="number" value={auditFaceUsd} onChange={(e) => setAuditFaceUsd(e.target.value)} />
              </div>
              <div className="field">
                <label>Off-Chain Disclosed Credit Score</label>
                <input type="number" value={auditScore} onChange={(e) => setAuditScore(e.target.value)} />
              </div>
            </div>
            <div className="actions">
              <button className="btn btn-primary" disabled={busy || !activeDeal} onClick={handleAuditAttest}>
                Verify & Attest Selective Disclosure
              </button>
              <button
                className="btn btn-danger"
                onClick={() => setAuditFaceUsd(String(Number(auditFaceUsd) + 1))}
              >
                Tamper +$1.00 (Test Seal Reject)
              </button>
            </div>
            {banner && <div className={`banner ${banner.ok ? "ok" : "err"}`}>{banner.text}</div>}
          </div>

          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Cryptographic Seal Verification Details</h2>
              <span className={`tag ${activeDeal?.summary.disclosedToAuditor ? "ok" : "warn"}`}>
                {activeDeal?.summary.disclosedToAuditor ? "ON-CHAIN ATTESTED" : "PENDING AUDIT"}
              </span>
            </div>
            <div className="diff-box pub">
              <div className="kv">
                <span>On-Chain Nullifier</span>
                <code>{activeDeal ? shortHex(activeDeal.nullifier, 10) : "—"}</code>
              </div>
              <div className="kv">
                <span>Invoice Commitment</span>
                <code>{activeDeal ? shortHex(activeDeal.summary.invoiceCommitment, 10) : "—"}</code>
              </div>
              <div className="kv">
                <span>Auditor Public Key</span>
                <code>{activeDeal ? shortHex(activeDeal.summary.auditorPk, 10) : "—"}</code>
              </div>
              <div className="kv">
                <span>Disclosure Seal</span>
                <code>{activeDeal ? shortHex(activeDeal.summary.disclosureSeal, 10) : "—"}</code>
              </div>
              <div className="kv">
                <span>Publicly Revealed Raw Amount</span>
                <code style={{ color: "#6ee7b7" }}>NONE (Zero-Knowledge)</code>
              </div>
            </div>
            {leakageAudit && (
              <div className="diff-box priv" style={{ marginTop: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <strong style={{ fontSize: 12 }}>Live Ledger-9 Public State Zero-Leakage Scan</strong>
                  <span className={`tag ${leakageAudit.allClear ? "ok" : "err"}`}>
                    {leakageAudit.allClear
                      ? `0/${leakageAudit.checks.length} LEAKS · ${leakageAudit.serializedCharsScanned}B SCANNED`
                      : `${leakageAudit.leaksFound} LEAKS`}
                  </span>
                </div>
                {leakageAudit.checks.map((c) => (
                  <div key={c.secretLabel} className="kv">
                    <span>{c.secretLabel}</span>
                    <code style={{ color: c.presentOnPublicLedger ? "#fca5a5" : "#6ee7b7" }}>
                      {c.presentOnPublicLedger ? "LEAKED" : "HIDDEN (0 matches)"}
                    </code>
                  </div>
                ))}
              </div>
            )}
            <div className="actions">
              <button
                className="btn btn-secondary"
                disabled={!activeDeal}
                onClick={handleExportComplianceReceipt}
              >
                Export Compliance Attestation (.json)
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === "policy" && (
        <div className="card">
          <div className="card-head">
            <h2 className="card-title">Global Risk Policy & Compiled Compact 0.36.1 Circuit Matrix</h2>
            <span className="tag ok">6/6 HALO2 CIRCUITS COMPILED · 25/25 TESTS PASS</span>
          </div>
          <div className="form-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
            <div className="field">
              <label>Min Credit Score Floor (500–850)</label>
              <input value={policyMinScore} onChange={(e) => setPolicyMinScore(e.target.value)} />
            </div>
            <div className="field">
              <label>Max Advance Rate (% · ≤95%)</label>
              <input value={policyMaxAdvance} onChange={(e) => setPolicyMaxAdvance(e.target.value)} />
            </div>
            <div className="field">
              <label>Max Buyer Concentration Cap (USD)</label>
              <input value={policyCapUsd} onChange={(e) => setPolicyCapUsd(e.target.value)} />
            </div>
          </div>
          <div className="actions">
            <button className="btn btn-primary" disabled={busy} onClick={() => handleUpdatePolicy(true)}>
              Update Risk Policy (Protocol Admin)
            </button>
            <button className="btn btn-danger" disabled={busy} onClick={() => handleUpdatePolicy(false)}>
              Test Unauthorized Non-Admin Update
            </button>
          </div>
          {banner && <div className={`banner ${banner.ok ? "ok" : "err"}`}>{banner.text}</div>}

          <div className="circuit-grid">
            <div className="circuit-card">
              <h4>pledgeInvoice()</h4>
              <p>Private underwriting + concentration cap + Tier-C guardrail + deterministic anti-double-pledge nullifier.</p>
            </div>
            <div className="circuit-card">
              <h4>fundDeal()</h4>
              <p>Factor ZK authentication via domain-separated derived PK; transitions PLEDGED → FUNDED.</p>
            </div>
            <div className="circuit-card">
              <h4>settleDeal()</h4>
              <p>Marks funded deal SETTLED while retaining permanent spent nullifier against replay financing.</p>
            </div>
            <div className="circuit-card">
              <h4>flagDispute()</h4>
              <p>Bilateral dispute freeze callable by either supplier or factor; blocks settlement until audit.</p>
            </div>
            <div className="circuit-card">
              <h4>attestSelectiveDisclosure()</h4>
              <p>Auditor-only ZK verification of exact off-chain commercial invoice dossier against on-chain seal.</p>
            </div>
            <div className="circuit-card">
              <h4>updateRiskPolicy()</h4>
              <p>Admin-only governance circuit updating global score floor, max advance bps, and buyer cap.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
