import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export enum DealStatus { PLEDGED = 0, FUNDED = 1, SETTLED = 2, DISPUTED = 3 }

export enum RiskTier { TIER_A_PRIME = 0,
                       TIER_B_STANDARD = 1,
                       TIER_C_ENHANCED = 2
}

export enum AmountBand { BAND_MICRO = 0, BAND_MID = 1, BAND_INSTITUTIONAL = 2 }

export type DealSummary = { supplierPk: Uint8Array;
                            factorPk: Uint8Array;
                            auditorPk: Uint8Array;
                            invoiceCommitment: Uint8Array;
                            disclosureSeal: Uint8Array;
                            riskTier: RiskTier;
                            amountBand: AmountBand;
                            advanceBps: bigint;
                            status: DealStatus;
                            disclosedToAuditor: boolean
                          };

export type Witnesses<PS> = {
  localSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localInvoiceDocHash(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localBuyerTaxHash(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localFaceValueCents(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localBuyerExposureCents(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localCreditScore(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  localInvoiceSalt(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  localAuditorSecretKey(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  updateRiskPolicy(context: __compactRuntime.CircuitContext<PS>,
                   newMinCreditScore_0: bigint,
                   newMaxAdvanceBps_0: bigint,
                   newMaxBuyerConcentrationCents_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  pledgeInvoice(context: __compactRuntime.CircuitContext<PS>,
                factorPk_0: Uint8Array,
                auditorPk_0: Uint8Array,
                requestedAdvanceBps_0: bigint): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  fundDeal(context: __compactRuntime.CircuitContext<PS>, nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  settleDeal(context: __compactRuntime.CircuitContext<PS>,
             nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  flagDispute(context: __compactRuntime.CircuitContext<PS>,
              nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  attestSelectiveDisclosure(context: __compactRuntime.CircuitContext<PS>,
                            nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
}

export type ProvableCircuits<PS> = {
  updateRiskPolicy(context: __compactRuntime.CircuitContext<PS>,
                   newMinCreditScore_0: bigint,
                   newMaxAdvanceBps_0: bigint,
                   newMaxBuyerConcentrationCents_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  pledgeInvoice(context: __compactRuntime.CircuitContext<PS>,
                factorPk_0: Uint8Array,
                auditorPk_0: Uint8Array,
                requestedAdvanceBps_0: bigint): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  fundDeal(context: __compactRuntime.CircuitContext<PS>, nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  settleDeal(context: __compactRuntime.CircuitContext<PS>,
             nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  flagDispute(context: __compactRuntime.CircuitContext<PS>,
              nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  attestSelectiveDisclosure(context: __compactRuntime.CircuitContext<PS>,
                            nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
}

export type PureCircuits = {
  deriveRolePk(sk_0: Uint8Array, domainTag_0: Uint8Array): Uint8Array;
  deriveAdminPk(sk_0: Uint8Array): Uint8Array;
  deriveSupplierPk(sk_0: Uint8Array): Uint8Array;
  deriveFactorPk(sk_0: Uint8Array): Uint8Array;
  deriveAuditorPk(sk_0: Uint8Array): Uint8Array;
  computeInvoiceNullifier(docHash_0: Uint8Array, buyerTaxHash_0: Uint8Array): Uint8Array;
  computeInvoiceCommitment(docHash_0: Uint8Array,
                           buyerTaxHash_0: Uint8Array,
                           faceValueCents_0: bigint,
                           salt_0: Uint8Array): Uint8Array;
  computeDisclosureSeal(invoiceCommitment_0: Uint8Array,
                        auditorPk_0: Uint8Array,
                        faceValueCents_0: bigint,
                        creditScore_0: bigint): Uint8Array;
}

export type Circuits<PS> = {
  deriveRolePk(context: __compactRuntime.CircuitContext<PS>,
               sk_0: Uint8Array,
               domainTag_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  deriveAdminPk(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  deriveSupplierPk(context: __compactRuntime.CircuitContext<PS>,
                   sk_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  deriveFactorPk(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  deriveAuditorPk(context: __compactRuntime.CircuitContext<PS>, sk_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  computeInvoiceNullifier(context: __compactRuntime.CircuitContext<PS>,
                          docHash_0: Uint8Array,
                          buyerTaxHash_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  computeInvoiceCommitment(context: __compactRuntime.CircuitContext<PS>,
                           docHash_0: Uint8Array,
                           buyerTaxHash_0: Uint8Array,
                           faceValueCents_0: bigint,
                           salt_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  computeDisclosureSeal(context: __compactRuntime.CircuitContext<PS>,
                        invoiceCommitment_0: Uint8Array,
                        auditorPk_0: Uint8Array,
                        faceValueCents_0: bigint,
                        creditScore_0: bigint): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  updateRiskPolicy(context: __compactRuntime.CircuitContext<PS>,
                   newMinCreditScore_0: bigint,
                   newMaxAdvanceBps_0: bigint,
                   newMaxBuyerConcentrationCents_0: bigint): Promise<__compactRuntime.CircuitResults<PS, []>>;
  pledgeInvoice(context: __compactRuntime.CircuitContext<PS>,
                factorPk_0: Uint8Array,
                auditorPk_0: Uint8Array,
                requestedAdvanceBps_0: bigint): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
  fundDeal(context: __compactRuntime.CircuitContext<PS>, nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  settleDeal(context: __compactRuntime.CircuitContext<PS>,
             nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  flagDispute(context: __compactRuntime.CircuitContext<PS>,
              nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, []>>;
  attestSelectiveDisclosure(context: __compactRuntime.CircuitContext<PS>,
                            nullifier_0: Uint8Array): Promise<__compactRuntime.CircuitResults<PS, Uint8Array>>;
}

export type Ledger = {
  readonly protocolAdminPk: Uint8Array;
  readonly minCreditScore: bigint;
  readonly maxAdvanceBps: bigint;
  readonly maxBuyerConcentrationCents: bigint;
  pledgedNullifiers: {
    isEmpty(): boolean;
    size(): bigint;
    member(elem_0: Uint8Array): boolean;
    [Symbol.iterator](): Iterator<Uint8Array>
  };
  deals: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): DealSummary;
    [Symbol.iterator](): Iterator<[Uint8Array, DealSummary]>
  };
  readonly totalPledged: bigint;
  readonly totalFunded: bigint;
  readonly totalSettled: bigint;
  readonly totalDisputed: bigint;
  readonly totalAuditorDisclosures: bigint;
}

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>,
               initMinCreditScore_0: bigint,
               initMaxAdvanceBps_0: bigint,
               initMaxBuyerConcentrationCents_0: bigint): Promise<__compactRuntime.ConstructorResult<PS>>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
export declare const expectedVk: Record<string, string>;
export declare const circuitSignatures: __compactRuntime.CircuitSignatures;
export declare const declaredInterfaces: __compactRuntime.DeclaredInterfaces;
