// SPDX-License-Identifier: Apache-2.0
// Copyright (C) 2026 VeilFactor Contributors

import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger, Witnesses } from "./managed/veilfactor/contract/index.js";

/**
 * Private witness state kept strictly inside the local prover.
 * None of these fields are ever written directly to Midnight's public ledger.
 */
export type VeilFactorPrivateState = {
  readonly secretKey: Uint8Array;
  readonly auditorSecretKey: Uint8Array;
  readonly invoiceDocHash: Uint8Array;
  readonly buyerTaxHash: Uint8Array;
  readonly faceValueCents: bigint;
  readonly buyerExposureCents: bigint;
  readonly creditScore: bigint;
  readonly invoiceSalt: Uint8Array;
};

export const ZERO_BYTES_32 = new Uint8Array(32);

export function createPrivateState(
  overrides: Partial<VeilFactorPrivateState> & { secretKey: Uint8Array }
): VeilFactorPrivateState {
  return {
    secretKey: overrides.secretKey,
    auditorSecretKey: overrides.auditorSecretKey ?? ZERO_BYTES_32,
    invoiceDocHash: overrides.invoiceDocHash ?? ZERO_BYTES_32,
    buyerTaxHash: overrides.buyerTaxHash ?? ZERO_BYTES_32,
    faceValueCents: overrides.faceValueCents ?? 0n,
    buyerExposureCents: overrides.buyerExposureCents ?? 0n,
    creditScore: overrides.creditScore ?? 0n,
    invoiceSalt: overrides.invoiceSalt ?? ZERO_BYTES_32,
  };
}

export const witnesses: Witnesses<VeilFactorPrivateState> = {
  localSecretKey({
    privateState,
  }: WitnessContext<Ledger, VeilFactorPrivateState>): [
    VeilFactorPrivateState,
    Uint8Array,
  ] {
    return [privateState, privateState.secretKey];
  },

  localInvoiceDocHash({
    privateState,
  }: WitnessContext<Ledger, VeilFactorPrivateState>): [
    VeilFactorPrivateState,
    Uint8Array,
  ] {
    return [privateState, privateState.invoiceDocHash];
  },

  localBuyerTaxHash({
    privateState,
  }: WitnessContext<Ledger, VeilFactorPrivateState>): [
    VeilFactorPrivateState,
    Uint8Array,
  ] {
    return [privateState, privateState.buyerTaxHash];
  },

  localFaceValueCents({
    privateState,
  }: WitnessContext<Ledger, VeilFactorPrivateState>): [
    VeilFactorPrivateState,
    bigint,
  ] {
    return [privateState, privateState.faceValueCents];
  },

  localBuyerExposureCents({
    privateState,
  }: WitnessContext<Ledger, VeilFactorPrivateState>): [
    VeilFactorPrivateState,
    bigint,
  ] {
    return [privateState, privateState.buyerExposureCents];
  },

  localCreditScore({
    privateState,
  }: WitnessContext<Ledger, VeilFactorPrivateState>): [
    VeilFactorPrivateState,
    bigint,
  ] {
    return [privateState, privateState.creditScore];
  },

  localInvoiceSalt({
    privateState,
  }: WitnessContext<Ledger, VeilFactorPrivateState>): [
    VeilFactorPrivateState,
    Uint8Array,
  ] {
    return [privateState, privateState.invoiceSalt];
  },

  localAuditorSecretKey({
    privateState,
  }: WitnessContext<Ledger, VeilFactorPrivateState>): [
    VeilFactorPrivateState,
    Uint8Array,
  ] {
    return [privateState, privateState.auditorSecretKey];
  },
};
