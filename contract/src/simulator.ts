// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 VeilFactor Contributors

import {
  type ChargedState,
  type CircuitContext,
  CostModel,
  type RunningCost,
  createCircuitContext,
  createConstructorContext,
  sampleContractAddress,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type DealSummary,
  type Ledger,
  ledger,
  pureCircuits,
} from "./managed/veilfactor/contract/index.js";
import {
  type VeilFactorPrivateState,
  createPrivateState,
  witnesses,
} from "./witnesses.js";

export type PolicyConfig = {
  minCreditScore: bigint;
  maxAdvanceBps: bigint;
  maxBuyerConcentrationCents: bigint;
};

export type PrivateInvoicePayload = {
  invoiceDocHash: Uint8Array;
  buyerTaxHash: Uint8Array;
  faceValueCents: bigint;
  buyerExposureCents: bigint;
  creditScore: bigint;
  invoiceSalt: Uint8Array;
};

export type CircuitExecReceipt<T = void> = {
  result: T;
  ledger: Ledger;
  gasCost: RunningCost;
  circuitId: string;
};

const DUMMY_COIN_PK = "0".repeat(64);

/**
 * Ledger-9 Midnight Compact runtime simulator for VeilFactor.
 * Executes the real compiled Compact 0.36.1 circuits (`compact-runtime 0.21.0`)
 * with strict separation between public Midnight ledger state and local private witnesses.
 */
export class VeilFactorSimulator {
  readonly contract: Contract<VeilFactorPrivateState>;
  readonly contractAddress: string;
  private currentState: ChargedState;
  private currentPrivateState: VeilFactorPrivateState;

  private constructor(
    contract: Contract<VeilFactorPrivateState>,
    contractAddress: string,
    initialState: ChargedState,
    initialPrivateState: VeilFactorPrivateState
  ) {
    this.contract = contract;
    this.contractAddress = contractAddress;
    this.currentState = initialState;
    this.currentPrivateState = initialPrivateState;
  }

  static async create(
    adminSecretKey: Uint8Array,
    policy: PolicyConfig = {
      minCreditScore: 620n,
      maxAdvanceBps: 9000n,
      maxBuyerConcentrationCents: 100_000_000n, // $1,000,000 cap per buyer
    }
  ): Promise<VeilFactorSimulator> {
    const contract = new Contract<VeilFactorPrivateState>(witnesses);
    const initialPrivate = createPrivateState({ secretKey: adminSecretKey });
    const { currentPrivateState, currentContractState } =
      await contract.initialState(
        createConstructorContext(initialPrivate, DUMMY_COIN_PK),
        policy.minCreditScore,
        policy.maxAdvanceBps,
        policy.maxBuyerConcentrationCents
      );

    return new VeilFactorSimulator(
      contract,
      sampleContractAddress(),
      currentContractState.data,
      currentPrivateState
    );
  }

  private buildContext(
    circuitId: string,
    privateState: VeilFactorPrivateState
  ): CircuitContext<VeilFactorPrivateState> {
    return createCircuitContext({
      circuitId,
      contractAddress: this.contractAddress,
      coinPublicKeyOrZswapState: DUMMY_COIN_PK,
      contractState: this.currentState,
      privateState,
      costModel: CostModel.initialCostModel(),
    });
  }

  public getLedger(): Ledger {
    return ledger(this.currentState);
  }

  public getPrivateState(): VeilFactorPrivateState {
    return this.currentPrivateState;
  }

  public async updateRiskPolicy(
    adminSecretKey: Uint8Array,
    policy: PolicyConfig
  ): Promise<CircuitExecReceipt<void>> {
    const ps = createPrivateState({ secretKey: adminSecretKey });
    const ctx = this.buildContext("updateRiskPolicy", ps);
    const res = await this.contract.impureCircuits.updateRiskPolicy(
      ctx,
      policy.minCreditScore,
      policy.maxAdvanceBps,
      policy.maxBuyerConcentrationCents
    );
    this.currentState = res.context.callContext.currentQueryContext.state;
    this.currentPrivateState = res.context.callContext.currentPrivateState ?? ps;
    return {
      result: undefined,
      ledger: this.getLedger(),
      gasCost: res.gasCost,
      circuitId: "updateRiskPolicy",
    };
  }

  public async pledgeInvoice(
    supplierSecretKey: Uint8Array,
    factorPk: Uint8Array,
    auditorPk: Uint8Array,
    requestedAdvanceBps: bigint,
    privateInvoice: PrivateInvoicePayload
  ): Promise<CircuitExecReceipt<Uint8Array>> {
    const ps = createPrivateState({
      secretKey: supplierSecretKey,
      ...privateInvoice,
    });
    const ctx = this.buildContext("pledgeInvoice", ps);
    const res = await this.contract.impureCircuits.pledgeInvoice(
      ctx,
      factorPk,
      auditorPk,
      requestedAdvanceBps
    );
    this.currentState = res.context.callContext.currentQueryContext.state;
    this.currentPrivateState = res.context.callContext.currentPrivateState ?? ps;
    return {
      result: res.result,
      ledger: this.getLedger(),
      gasCost: res.gasCost,
      circuitId: "pledgeInvoice",
    };
  }

  public async fundDeal(
    factorSecretKey: Uint8Array,
    nullifier: Uint8Array
  ): Promise<CircuitExecReceipt<void>> {
    const ps = createPrivateState({ secretKey: factorSecretKey });
    const ctx = this.buildContext("fundDeal", ps);
    const res = await this.contract.impureCircuits.fundDeal(ctx, nullifier);
    this.currentState = res.context.callContext.currentQueryContext.state;
    this.currentPrivateState = res.context.callContext.currentPrivateState ?? ps;
    return {
      result: undefined,
      ledger: this.getLedger(),
      gasCost: res.gasCost,
      circuitId: "fundDeal",
    };
  }

  public async settleDeal(
    factorSecretKey: Uint8Array,
    nullifier: Uint8Array
  ): Promise<CircuitExecReceipt<void>> {
    const ps = createPrivateState({ secretKey: factorSecretKey });
    const ctx = this.buildContext("settleDeal", ps);
    const res = await this.contract.impureCircuits.settleDeal(ctx, nullifier);
    this.currentState = res.context.callContext.currentQueryContext.state;
    this.currentPrivateState = res.context.callContext.currentPrivateState ?? ps;
    return {
      result: undefined,
      ledger: this.getLedger(),
      gasCost: res.gasCost,
      circuitId: "settleDeal",
    };
  }

  public async flagDispute(
    callerSecretKey: Uint8Array,
    nullifier: Uint8Array
  ): Promise<CircuitExecReceipt<void>> {
    const ps = createPrivateState({ secretKey: callerSecretKey });
    const ctx = this.buildContext("flagDispute", ps);
    const res = await this.contract.impureCircuits.flagDispute(ctx, nullifier);
    this.currentState = res.context.callContext.currentQueryContext.state;
    this.currentPrivateState = res.context.callContext.currentPrivateState ?? ps;
    return {
      result: undefined,
      ledger: this.getLedger(),
      gasCost: res.gasCost,
      circuitId: "flagDispute",
    };
  }

  public async attestSelectiveDisclosure(
    auditorSecretKey: Uint8Array,
    nullifier: Uint8Array,
    offchainFaceValueCents: bigint,
    offchainCreditScore: bigint
  ): Promise<CircuitExecReceipt<Uint8Array>> {
    const ps = createPrivateState({
      secretKey: auditorSecretKey,
      auditorSecretKey,
      faceValueCents: offchainFaceValueCents,
      creditScore: offchainCreditScore,
    });
    const ctx = this.buildContext("attestSelectiveDisclosure", ps);
    const res = await this.contract.impureCircuits.attestSelectiveDisclosure(
      ctx,
      nullifier
    );
    this.currentState = res.context.callContext.currentQueryContext.state;
    this.currentPrivateState = res.context.callContext.currentPrivateState ?? ps;
    return {
      result: res.result,
      ledger: this.getLedger(),
      gasCost: res.gasCost,
      circuitId: "attestSelectiveDisclosure",
    };
  }

  public lookupDeal(nullifier: Uint8Array): DealSummary {
    return this.getLedger().deals.lookup(nullifier);
  }
}

export { pureCircuits };
