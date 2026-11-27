// SPDX-License-Identifier: Apache-2.0
// Pure-SVG Private Covenant Gauges & Ledger-9 Lifecycle Visualizations (zero chart dependencies)

import React from "react";
import type { PortfolioLifecycleMetrics, PreFlightCovenantReport } from "./veilfactorEngine";

export function CovenantGaugeChart({
  report,
  existingExposureUsd,
  faceValueUsd,
  creditScore,
}: {
  report: PreFlightCovenantReport;
  existingExposureUsd: number;
  faceValueUsd: number;
  creditScore: number;
}) {
  const cap = Math.max(report.policyCapUsd, 1);
  // Display scale accommodates overflow up to 135% so breaches visually cross the red cap line
  const scaleMax = cap * 1.35;
  const existPct = Math.min(100, (Math.max(0, existingExposureUsd) / scaleMax) * 100);
  const facePct = Math.min(100 - existPct, (Math.max(0, faceValueUsd) / scaleMax) * 100);
  const capMarkerPct = (cap / scaleMax) * 100;

  const scoreClamp = Math.max(500, Math.min(850, creditScore || 500));
  const scoreX = ((scoreClamp - 500) / 350) * 100;
  const floorX = ((Math.max(500, Math.min(850, report.minCreditScore)) - 500) / 350) * 100;
  const tierBX = ((680 - 500) / 350) * 100;
  const tierAX = ((760 - 500) / 350) * 100;

  return (
    <div className="gauge-box">
      <div className="gauge-head">
        <span>
          <strong>Private Pre-Flight ZK Covenant Simulator</strong>
          <span className="kpi-sub"> (checked locally before proof)</span>
        </span>
        <span className={`tag ${report.willPassCircuit ? "ok" : "err"}`}>
          {report.willPassCircuit ? "CIRCUIT READY: PASS" : "CIRCUIT WILL REVERT"}
        </span>
      </div>

      <svg viewBox="0 0 520 112" width="100%" height={112} role="img" aria-label="Private buyer concentration and credit covenant gauges">
        {/* Gauge 1: Buyer Concentration */}
        <text x="6" y="14" fill="#94a3b8" fontSize="10" fontFamily="monospace">
          BUYER CONCENTRATION: ${(report.totalExposureUsd / 1000).toFixed(1)}k / ${(cap / 1000).toFixed(0)}k CAP ({report.concentrationUtilizationPct.toFixed(0)}%)
        </text>
        <text x="514" y="14" textAnchor="end" fill={report.concentrationPass ? "#6ee7b7" : "#fca5a5"} fontSize="10" fontWeight="700" fontFamily="monospace">
          {report.concentrationPass ? "WITHIN CAP" : "BREACH"}
        </text>

        <rect x="6" y="21" width="508" height="16" rx="4" fill="#050811" stroke="rgba(148,163,184,0.22)" />
        <rect x="6" y="21" width={(508 * existPct) / 100} height="16" rx="4" fill="#6366f1" fillOpacity="0.72" />
        <rect
          x={6 + (508 * existPct) / 100}
          y="21"
          width={(508 * facePct) / 100}
          height="16"
          fill={report.concentrationPass ? "#22d3ee" : "#ef4444"}
          fillOpacity="0.88"
        />
        <line
          x1={6 + (508 * capMarkerPct) / 100}
          y1="18"
          x2={6 + (508 * capMarkerPct) / 100}
          y2="41"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="3 2"
        />
        <text x={6 + (508 * capMarkerPct) / 100} y="51" textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="monospace">
          Policy Cap (${(cap / 1000).toFixed(0)}k)
        </text>

        {/* Gauge 2: Credit Score & Tier-C Advance Guardrail */}
        <text x="6" y="70" fill="#94a3b8" fontSize="10" fontFamily="monospace">
          PRIVATE CREDIT SCORE: {creditScore || 0} (Floor {report.minCreditScore} · Max Adv {report.effectiveMaxAdvancePct}%)
        </text>
        <text x="514" y="70" textAnchor="end" fill={report.creditScorePass && report.advanceRatePass ? "#6ee7b7" : "#fca5a5"} fontSize="10" fontWeight="700" fontFamily="monospace">
          {report.creditScorePass && report.advanceRatePass ? "COVENANT OK" : "GUARDRAIL VIOLATION"}
        </text>

        <rect x="6" y="77" width="508" height="12" rx="4" fill="#050811" stroke="rgba(148,163,184,0.22)" />
        <rect x="6" y="77" width={(508 * floorX) / 100} height="12" rx="4" fill="rgba(239,68,68,0.25)" />
        <rect x={6 + (508 * floorX) / 100} y="77" width={(508 * Math.max(0, tierBX - floorX)) / 100} height="12" fill="rgba(245,158,11,0.25)" />
        <rect x={6 + (508 * tierBX) / 100} y="77" width={(508 * (tierAX - tierBX)) / 100} height="12" fill="rgba(34,211,238,0.22)" />
        <rect x={6 + (508 * tierAX) / 100} y="77" width={(508 * (100 - tierAX)) / 100} height="12" rx="4" fill="rgba(16,185,129,0.25)" />

        <line x1={6 + (508 * floorX) / 100} y1="74" x2={6 + (508 * floorX) / 100} y2="92" stroke="#ef4444" strokeWidth="1.5" />
        <line x1={6 + (508 * tierBX) / 100} y1="74" x2={6 + (508 * tierBX) / 100} y2="92" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
        <line x1={6 + (508 * tierAX) / 100} y1="74" x2={6 + (508 * tierAX) / 100} y2="92" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx={6 + (508 * scoreX) / 100} cy="83" r="5" fill={report.creditScorePass ? "#f8fafc" : "#ef4444"} stroke="#050811" strokeWidth="1.5" />

        <text x="6" y="105" fill="#64748b" fontSize="9" fontFamily="monospace">500</text>
        <text x={6 + (508 * floorX) / 100} y="105" textAnchor="middle" fill="#fca5a5" fontSize="9" fontFamily="monospace">Min {report.minCreditScore}</text>
        <text x={6 + (508 * tierBX) / 100} y="105" textAnchor="middle" fill="#fcd34d" fontSize="9" fontFamily="monospace">680 (Tier-B)</text>
        <text x={6 + (508 * tierAX) / 100} y="105" textAnchor="middle" fill="#6ee7b7" fontSize="9" fontFamily="monospace">760 (Tier-A)</text>
        <text x="514" y="105" textAnchor="end" fill="#64748b" fontSize="9" fontFamily="monospace">850</text>
      </svg>
    </div>
  );
}

export function LifecycleFunnelChart({ metrics }: { metrics: PortfolioLifecycleMetrics }) {
  const rows = [
    { label: "Pledged", val: metrics.pledged, color: "#f59e0b" },
    { label: "Funded", val: metrics.funded, color: "#22d3ee" },
    { label: "Settled", val: metrics.settled, color: "#10b981" },
    { label: "Disputed", val: metrics.disputed, color: "#ef4444" },
    { label: "Auditor Attested", val: metrics.attested, color: "#a78bfa" },
  ];
  const maxVal = Math.max(1, metrics.totalDeals, ...rows.map((r) => r.val));

  return (
    <div className="gauge-box" style={{ marginBottom: 12 }}>
      <div className="gauge-head">
        <span><strong>On-Chain Nullifier Lifecycle &amp; Ledger-9 RunningCost Telemetry</strong></span>
        <span className="mono" style={{ fontSize: 11, color: "#94a3b8" }}>
          Circuits: <strong style={{ color: "#6ee7b7" }}>{metrics.passCalls} PASS</strong> /{" "}
          <strong style={{ color: "#fca5a5" }}>{metrics.blockedCalls} BLOCKED</strong> ·{" "}
          Compute <strong style={{ color: "#67e8f9" }}>{metrics.totalComputeTime.toLocaleString()}</strong> ·{" "}
          Writes <strong style={{ color: "#c4b5fd" }}>{metrics.totalBytesWritten.toLocaleString()}B</strong>
        </span>
      </div>
      <svg viewBox="0 0 680 96" width="100%" height={96} role="img" aria-label="On-chain deal lifecycle distribution chart">
        {rows.map((r, idx) => {
          const y = 8 + idx * 17;
          const barW = Math.max(r.val > 0 ? 18 : 2, (r.val / maxVal) * 480);
          return (
            <g key={r.label}>
              <text x="4" y={y + 10} fill="#cbd5e1" fontSize="10.5" fontFamily="monospace">
                {r.label}
              </text>
              <rect x="130" y={y + 1} width="480" height="11" rx="3" fill="#050811" />
              <rect x="130" y={y + 1} width={barW} height="11" rx="3" fill={r.color} fillOpacity="0.85" />
              <text x="622" y={y + 10} fill="#f8fafc" fontSize="10.5" fontWeight="700" fontFamily="monospace">
                {r.val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
