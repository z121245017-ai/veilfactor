import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.21.0');

export var DealStatus;
(function (DealStatus) {
  DealStatus[DealStatus['PLEDGED'] = 0] = 'PLEDGED';
  DealStatus[DealStatus['FUNDED'] = 1] = 'FUNDED';
  DealStatus[DealStatus['SETTLED'] = 2] = 'SETTLED';
  DealStatus[DealStatus['DISPUTED'] = 3] = 'DISPUTED';
})(DealStatus || (DealStatus = {}));

export var RiskTier;
(function (RiskTier) {
  RiskTier[RiskTier['TIER_A_PRIME'] = 0] = 'TIER_A_PRIME';
  RiskTier[RiskTier['TIER_B_STANDARD'] = 1] = 'TIER_B_STANDARD';
  RiskTier[RiskTier['TIER_C_ENHANCED'] = 2] = 'TIER_C_ENHANCED';
})(RiskTier || (RiskTier = {}));

export var AmountBand;
(function (AmountBand) {
  AmountBand[AmountBand['BAND_MICRO'] = 0] = 'BAND_MICRO';
  AmountBand[AmountBand['BAND_MID'] = 1] = 'BAND_MID';
  AmountBand[AmountBand['BAND_INSTITUTIONAL'] = 2] = 'BAND_INSTITUTIONAL';
})(AmountBand || (AmountBand = {}));

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_2 = new __compactRuntime.CompactTypeEnum(2, 1);

const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);

const _descriptor_4 = new __compactRuntime.CompactTypeEnum(3, 1);

const _descriptor_5 = __compactRuntime.CompactTypeBoolean;

class _DealSummary_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_3.alignment().concat(_descriptor_4.alignment().concat(_descriptor_5.alignment())))))))));
  }
  fromValue(value_0) {
    return {
      supplierPk: _descriptor_0.fromValue(value_0),
      factorPk: _descriptor_0.fromValue(value_0),
      auditorPk: _descriptor_0.fromValue(value_0),
      invoiceCommitment: _descriptor_0.fromValue(value_0),
      disclosureSeal: _descriptor_0.fromValue(value_0),
      riskTier: _descriptor_1.fromValue(value_0),
      amountBand: _descriptor_2.fromValue(value_0),
      advanceBps: _descriptor_3.fromValue(value_0),
      status: _descriptor_4.fromValue(value_0),
      disclosedToAuditor: _descriptor_5.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.supplierPk).concat(_descriptor_0.toValue(value_0.factorPk).concat(_descriptor_0.toValue(value_0.auditorPk).concat(_descriptor_0.toValue(value_0.invoiceCommitment).concat(_descriptor_0.toValue(value_0.disclosureSeal).concat(_descriptor_1.toValue(value_0.riskTier).concat(_descriptor_2.toValue(value_0.amountBand).concat(_descriptor_3.toValue(value_0.advanceBps).concat(_descriptor_4.toValue(value_0.status).concat(_descriptor_5.toValue(value_0.disclosedToAuditor))))))))));
  }
}

const _descriptor_6 = new _DealSummary_0();

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_8 = new __compactRuntime.CompactTypeVector(5, _descriptor_0);

const _descriptor_9 = new __compactRuntime.CompactTypeVector(2, _descriptor_0);

const _descriptor_10 = new __compactRuntime.CompactTypeVector(3, _descriptor_0);

class _Either_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_5.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_11 = new _Either_0();

const _descriptor_12 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_13 = new _ContractAddress_0();

class _UserAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_14 = new _UserAddress_0();

class _Either_1 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_13.alignment().concat(_descriptor_14.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_5.fromValue(value_0),
      left: _descriptor_13.fromValue(value_0),
      right: _descriptor_14.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.is_left).concat(_descriptor_13.toValue(value_0.left).concat(_descriptor_14.toValue(value_0.right)));
  }
}

const _descriptor_15 = new _Either_1();

class _Maybe_0 {
  alignment() {
    return _descriptor_5.alignment().concat(_descriptor_15.alignment());
  }
  fromValue(value_0) {
    return {
      is_some: _descriptor_5.fromValue(value_0),
      value: _descriptor_15.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_5.toValue(value_0.is_some).concat(_descriptor_15.toValue(value_0.value));
  }
}

const _descriptor_16 = new _Maybe_0();

const _descriptor_17 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_18 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof(witnesses_0.localSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localSecretKey');
    }
    if (typeof(witnesses_0.localInvoiceDocHash) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localInvoiceDocHash');
    }
    if (typeof(witnesses_0.localBuyerTaxHash) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localBuyerTaxHash');
    }
    if (typeof(witnesses_0.localFaceValueCents) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localFaceValueCents');
    }
    if (typeof(witnesses_0.localBuyerExposureCents) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localBuyerExposureCents');
    }
    if (typeof(witnesses_0.localCreditScore) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localCreditScore');
    }
    if (typeof(witnesses_0.localInvoiceSalt) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localInvoiceSalt');
    }
    if (typeof(witnesses_0.localAuditorSecretKey) !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named localAuditorSecretKey');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      async deriveRolePk(context, ...args_1) {
        return { result: pureCircuits.deriveRolePk(...args_1), context };
      },
      async deriveAdminPk(context, ...args_1) {
        return { result: pureCircuits.deriveAdminPk(...args_1), context };
      },
      async deriveSupplierPk(context, ...args_1) {
        return { result: pureCircuits.deriveSupplierPk(...args_1), context };
      },
      async deriveFactorPk(context, ...args_1) {
        return { result: pureCircuits.deriveFactorPk(...args_1), context };
      },
      async deriveAuditorPk(context, ...args_1) {
        return { result: pureCircuits.deriveAuditorPk(...args_1), context };
      },
      async computeInvoiceNullifier(context, ...args_1) {
        return { result: pureCircuits.computeInvoiceNullifier(...args_1), context };
      },
      async computeInvoiceCommitment(context, ...args_1) {
        return { result: pureCircuits.computeInvoiceCommitment(...args_1), context };
      },
      async computeDisclosureSeal(context, ...args_1) {
        return { result: pureCircuits.computeDisclosureSeal(...args_1), context };
      },
      updateRiskPolicy: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`updateRiskPolicy: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const newMinCreditScore_0 = args_1[1];
        const newMaxAdvanceBps_0 = args_1[2];
        const newMaxBuyerConcentrationCents_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('updateRiskPolicy',
                                     'argument 1 (as invoked from Typescript)',
                                     'veilfactor.compact line 159 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(typeof(newMinCreditScore_0) === 'bigint' && newMinCreditScore_0 >= 0n && newMinCreditScore_0 <= 65535n)) {
          __compactRuntime.typeError('updateRiskPolicy',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'veilfactor.compact line 159 char 1',
                                     'Uint<0..65536>',
                                     newMinCreditScore_0)
        }
        if (!(typeof(newMaxAdvanceBps_0) === 'bigint' && newMaxAdvanceBps_0 >= 0n && newMaxAdvanceBps_0 <= 65535n)) {
          __compactRuntime.typeError('updateRiskPolicy',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'veilfactor.compact line 159 char 1',
                                     'Uint<0..65536>',
                                     newMaxAdvanceBps_0)
        }
        if (!(typeof(newMaxBuyerConcentrationCents_0) === 'bigint' && newMaxBuyerConcentrationCents_0 >= 0n && newMaxBuyerConcentrationCents_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('updateRiskPolicy',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'veilfactor.compact line 159 char 1',
                                     'Uint<0..18446744073709551616>',
                                     newMaxBuyerConcentrationCents_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_3.toValue(newMinCreditScore_0).concat(_descriptor_3.toValue(newMaxAdvanceBps_0).concat(_descriptor_7.toValue(newMaxBuyerConcentrationCents_0))),
            alignment: _descriptor_3.alignment().concat(_descriptor_3.alignment().concat(_descriptor_7.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._updateRiskPolicy_0(context,
                                                        partialProofData,
                                                        newMinCreditScore_0,
                                                        newMaxAdvanceBps_0,
                                                        newMaxBuyerConcentrationCents_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      pledgeInvoice: async (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`pledgeInvoice: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const factorPk_0 = args_1[1];
        const auditorPk_0 = args_1[2];
        const requestedAdvanceBps_0 = args_1[3];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('pledgeInvoice',
                                     'argument 1 (as invoked from Typescript)',
                                     'veilfactor.compact line 178 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(factorPk_0.buffer instanceof ArrayBuffer && factorPk_0.BYTES_PER_ELEMENT === 1 && factorPk_0.length === 32)) {
          __compactRuntime.typeError('pledgeInvoice',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'veilfactor.compact line 178 char 1',
                                     'Bytes<32>',
                                     factorPk_0)
        }
        if (!(auditorPk_0.buffer instanceof ArrayBuffer && auditorPk_0.BYTES_PER_ELEMENT === 1 && auditorPk_0.length === 32)) {
          __compactRuntime.typeError('pledgeInvoice',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'veilfactor.compact line 178 char 1',
                                     'Bytes<32>',
                                     auditorPk_0)
        }
        if (!(typeof(requestedAdvanceBps_0) === 'bigint' && requestedAdvanceBps_0 >= 0n && requestedAdvanceBps_0 <= 65535n)) {
          __compactRuntime.typeError('pledgeInvoice',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'veilfactor.compact line 178 char 1',
                                     'Uint<0..65536>',
                                     requestedAdvanceBps_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(factorPk_0).concat(_descriptor_0.toValue(auditorPk_0).concat(_descriptor_3.toValue(requestedAdvanceBps_0))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment()))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._pledgeInvoice_0(context,
                                                     partialProofData,
                                                     factorPk_0,
                                                     auditorPk_0,
                                                     requestedAdvanceBps_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      fundDeal: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`fundDeal: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const nullifier_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('fundDeal',
                                     'argument 1 (as invoked from Typescript)',
                                     'veilfactor.compact line 252 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(nullifier_0.buffer instanceof ArrayBuffer && nullifier_0.BYTES_PER_ELEMENT === 1 && nullifier_0.length === 32)) {
          __compactRuntime.typeError('fundDeal',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'veilfactor.compact line 252 char 1',
                                     'Bytes<32>',
                                     nullifier_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(nullifier_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._fundDeal_0(context,
                                                partialProofData,
                                                nullifier_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      settleDeal: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`settleDeal: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const nullifier_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('settleDeal',
                                     'argument 1 (as invoked from Typescript)',
                                     'veilfactor.compact line 282 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(nullifier_0.buffer instanceof ArrayBuffer && nullifier_0.BYTES_PER_ELEMENT === 1 && nullifier_0.length === 32)) {
          __compactRuntime.typeError('settleDeal',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'veilfactor.compact line 282 char 1',
                                     'Bytes<32>',
                                     nullifier_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(nullifier_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._settleDeal_0(context,
                                                  partialProofData,
                                                  nullifier_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      flagDispute: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`flagDispute: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const nullifier_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('flagDispute',
                                     'argument 1 (as invoked from Typescript)',
                                     'veilfactor.compact line 312 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(nullifier_0.buffer instanceof ArrayBuffer && nullifier_0.BYTES_PER_ELEMENT === 1 && nullifier_0.length === 32)) {
          __compactRuntime.typeError('flagDispute',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'veilfactor.compact line 312 char 1',
                                     'Bytes<32>',
                                     nullifier_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(nullifier_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._flagDispute_0(context,
                                                   partialProofData,
                                                   nullifier_0);
        partialProofData.output = { value: [], alignment: [] };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      },
      attestSelectiveDisclosure: async (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`attestSelectiveDisclosure: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const nullifier_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.callContext.currentQueryContext != undefined)) {
          __compactRuntime.typeError('attestSelectiveDisclosure',
                                     'argument 1 (as invoked from Typescript)',
                                     'veilfactor.compact line 349 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(nullifier_0.buffer instanceof ArrayBuffer && nullifier_0.BYTES_PER_ELEMENT === 1 && nullifier_0.length === 32)) {
          __compactRuntime.typeError('attestSelectiveDisclosure',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'veilfactor.compact line 349 char 1',
                                     'Bytes<32>',
                                     nullifier_0)
        }
        const context = __compactRuntime.copyCircuitContext(contextOrig_0);
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(nullifier_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = await this._attestSelectiveDisclosure_0(context,
                                                                 partialProofData,
                                                                 nullifier_0);
        partialProofData.output = { value: _descriptor_0.toValue(result_0), alignment: _descriptor_0.alignment() };
        __compactRuntime.finalizeCallProofData(context, partialProofData);
        return { result: result_0, context: context, gasCost: context.callContext.currentGasCost };
      }
    };
    this.impureCircuits = {
      updateRiskPolicy: this.circuits.updateRiskPolicy,
      pledgeInvoice: this.circuits.pledgeInvoice,
      fundDeal: this.circuits.fundDeal,
      settleDeal: this.circuits.settleDeal,
      flagDispute: this.circuits.flagDispute,
      attestSelectiveDisclosure: this.circuits.attestSelectiveDisclosure
    };
    this.provableCircuits = {
      updateRiskPolicy: this.circuits.updateRiskPolicy,
      pledgeInvoice: this.circuits.pledgeInvoice,
      fundDeal: this.circuits.fundDeal,
      settleDeal: this.circuits.settleDeal,
      flagDispute: this.circuits.flagDispute,
      attestSelectiveDisclosure: this.circuits.attestSelectiveDisclosure
    };
  }
  async initialState(...args_0) {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const initMinCreditScore_0 = args_0[1];
    const initMaxAdvanceBps_0 = args_0[2];
    const initMaxBuyerConcentrationCents_0 = args_0[3];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialPrivateState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialPrivateState' in argument 1 (as invoked from Typescript)`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!(typeof(initMinCreditScore_0) === 'bigint' && initMinCreditScore_0 >= 0n && initMinCreditScore_0 <= 65535n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 1 (argument 2 as invoked from Typescript)',
                                 'veilfactor.compact line 141 char 1',
                                 'Uint<0..65536>',
                                 initMinCreditScore_0)
    }
    if (!(typeof(initMaxAdvanceBps_0) === 'bigint' && initMaxAdvanceBps_0 >= 0n && initMaxAdvanceBps_0 <= 65535n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 2 (argument 3 as invoked from Typescript)',
                                 'veilfactor.compact line 141 char 1',
                                 'Uint<0..65536>',
                                 initMaxAdvanceBps_0)
    }
    if (!(typeof(initMaxBuyerConcentrationCents_0) === 'bigint' && initMaxBuyerConcentrationCents_0 >= 0n && initMaxBuyerConcentrationCents_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('Contract state constructor',
                                 'argument 3 (argument 4 as invoked from Typescript)',
                                 'veilfactor.compact line 141 char 1',
                                 'Uint<0..18446744073709551616>',
                                 initMaxBuyerConcentrationCents_0)
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('updateRiskPolicy', new __compactRuntime.ContractOperation());
    state_0.setOperation('pledgeInvoice', new __compactRuntime.ContractOperation());
    state_0.setOperation('fundDeal', new __compactRuntime.ContractOperation());
    state_0.setOperation('settleDeal', new __compactRuntime.ContractOperation());
    state_0.setOperation('flagDispute', new __compactRuntime.ContractOperation());
    state_0.setOperation('attestSelectiveDisclosure', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext({circuitId: 'constructor', contractAddress: __compactRuntime.dummyContractAddress(), coinPublicKeyOrZswapState: constructorContext_0.initialZswapLocalState.coinPublicKey, contractState: state_0.data, privateState: constructorContext_0.initialPrivateState});
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(0n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(new Uint8Array(32)),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(1n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(2n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(0n),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(3n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(4n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(5n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(6n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(7n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(8n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(9n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(10n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.assert(initMinCreditScore_0 >= 500n
                            &&
                            initMinCreditScore_0 <= 850n,
                            'Invalid credit score floor');
    __compactRuntime.assert(initMaxAdvanceBps_0 >= 5000n
                            &&
                            initMaxAdvanceBps_0 <= 9500n,
                            'Invalid max advance bps');
    __compactRuntime.assert(initMaxBuyerConcentrationCents_0 >= 1000000n,
                            'Concentration cap must be >= $10,000');
    const tmp_0 = this._deriveAdminPk_0(this._localSecretKey_0(context,
                                                               partialProofData));
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(0n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(tmp_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(1n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(initMinCreditScore_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(2n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(initMaxAdvanceBps_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(3n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(initMaxBuyerConcentrationCents_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.callContext.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.callContext.currentPrivateState,
      currentZswapLocalState: context.callContext.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_9, value_0);
    return result_0;
  }
  _persistentHash_1(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_10, value_0);
    return result_0;
  }
  _persistentHash_2(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_8, value_0);
    return result_0;
  }
  _localSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localSecretKey(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localSecretKey',
                                 'return value',
                                 'veilfactor.compact line 61 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _localInvoiceDocHash_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localInvoiceDocHash(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localInvoiceDocHash',
                                 'return value',
                                 'veilfactor.compact line 62 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _localBuyerTaxHash_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localBuyerTaxHash(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localBuyerTaxHash',
                                 'return value',
                                 'veilfactor.compact line 63 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _localFaceValueCents_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localFaceValueCents(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('localFaceValueCents',
                                 'return value',
                                 'veilfactor.compact line 64 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_7.toValue(result_0),
      alignment: _descriptor_7.alignment()
    });
    return result_0;
  }
  _localBuyerExposureCents_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localBuyerExposureCents(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('localBuyerExposureCents',
                                 'return value',
                                 'veilfactor.compact line 65 char 1',
                                 'Uint<0..18446744073709551616>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_7.toValue(result_0),
      alignment: _descriptor_7.alignment()
    });
    return result_0;
  }
  _localCreditScore_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localCreditScore(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(typeof(result_0) === 'bigint' && result_0 >= 0n && result_0 <= 65535n)) {
      __compactRuntime.typeError('localCreditScore',
                                 'return value',
                                 'veilfactor.compact line 66 char 1',
                                 'Uint<0..65536>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_3.toValue(result_0),
      alignment: _descriptor_3.alignment()
    });
    return result_0;
  }
  _localInvoiceSalt_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localInvoiceSalt(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localInvoiceSalt',
                                 'return value',
                                 'veilfactor.compact line 67 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _localAuditorSecretKey_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.callContext.currentQueryContext.state), context.callContext.currentPrivateState, context.callContext.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.localAuditorSecretKey(witnessContext_0);
    context.callContext.currentPrivateState = nextPrivateState_0;
    if (!(result_0.buffer instanceof ArrayBuffer && result_0.BYTES_PER_ELEMENT === 1 && result_0.length === 32)) {
      __compactRuntime.typeError('localAuditorSecretKey',
                                 'return value',
                                 'veilfactor.compact line 68 char 1',
                                 'Bytes<32>',
                                 result_0)
    }
    partialProofData.privateTranscriptOutputs.push({
      value: _descriptor_0.toValue(result_0),
      alignment: _descriptor_0.alignment()
    });
    return result_0;
  }
  _deriveRolePk_0(sk_0, domainTag_0) {
    return this._persistentHash_0([domainTag_0, sk_0]);
  }
  _deriveAdminPk_0(sk_0) {
    return this._deriveRolePk_0(sk_0,
                                new Uint8Array([118, 101, 105, 108, 102, 97, 99, 116, 111, 114, 58, 97, 100, 109, 105, 110, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  }
  _deriveSupplierPk_0(sk_0) {
    return this._deriveRolePk_0(sk_0,
                                new Uint8Array([118, 101, 105, 108, 102, 97, 99, 116, 111, 114, 58, 115, 117, 112, 112, 108, 105, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  }
  _deriveFactorPk_0(sk_0) {
    return this._deriveRolePk_0(sk_0,
                                new Uint8Array([118, 101, 105, 108, 102, 97, 99, 116, 111, 114, 58, 102, 97, 99, 116, 111, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  }
  _deriveAuditorPk_0(sk_0) {
    return this._deriveRolePk_0(sk_0,
                                new Uint8Array([118, 101, 105, 108, 102, 97, 99, 116, 111, 114, 58, 97, 117, 100, 105, 116, 111, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
  }
  _computeInvoiceNullifier_0(docHash_0, buyerTaxHash_0) {
    return this._persistentHash_1([new Uint8Array([118, 101, 105, 108, 102, 97, 99, 116, 111, 114, 58, 110, 117, 108, 108, 105, 102, 105, 101, 114, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   docHash_0,
                                   buyerTaxHash_0]);
  }
  _computeInvoiceCommitment_0(docHash_0,
                              buyerTaxHash_0,
                              faceValueCents_0,
                              salt_0)
  {
    return this._persistentHash_2([new Uint8Array([118, 101, 105, 108, 102, 97, 99, 116, 111, 114, 58, 99, 111, 109, 109, 105, 116, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   docHash_0,
                                   buyerTaxHash_0,
                                   __compactRuntime.convertBigintToBytes(32,
                                                                         faceValueCents_0,
                                                                         'veilfactor.compact line 117 char 5'),
                                   salt_0]);
  }
  _computeDisclosureSeal_0(invoiceCommitment_0,
                           auditorPk_0,
                           faceValueCents_0,
                           creditScore_0)
  {
    return this._persistentHash_2([new Uint8Array([118, 101, 105, 108, 102, 97, 99, 116, 111, 114, 58, 97, 117, 100, 105, 116, 45, 115, 101, 97, 108, 58, 118, 49, 0, 0, 0, 0, 0, 0, 0, 0]),
                                   invoiceCommitment_0,
                                   auditorPk_0,
                                   __compactRuntime.convertBigintToBytes(32,
                                                                         faceValueCents_0,
                                                                         'veilfactor.compact line 133 char 5'),
                                   __compactRuntime.convertBigintToBytes(32,
                                                                         creditScore_0,
                                                                         'veilfactor.compact line 134 char 5')]);
  }
  async _updateRiskPolicy_0(context,
                            partialProofData,
                            newMinCreditScore_0,
                            newMaxAdvanceBps_0,
                            newMaxBuyerConcentrationCents_0)
  {
    const callerAdminPk_0 = this._deriveAdminPk_0(this._localSecretKey_0(context,
                                                                         partialProofData));
    __compactRuntime.assert(this._equal_0(callerAdminPk_0,
                                          _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                                    partialProofData,
                                                                                                    [
                                                                                                     { dup: { n: 0 } },
                                                                                                     { idx: { cached: false,
                                                                                                              pushPath: false,
                                                                                                              path: [
                                                                                                                     { tag: 'value',
                                                                                                                       value: { value: _descriptor_17.toValue(0n),
                                                                                                                                alignment: _descriptor_17.alignment() } }] } },
                                                                                                     { popeq: { cached: false,
                                                                                                                result: undefined } }]).value)),
                            'Unauthorized: caller is not protocol admin');
    __compactRuntime.assert(newMinCreditScore_0 >= 500n
                            &&
                            newMinCreditScore_0 <= 850n,
                            'Credit score floor out of range');
    __compactRuntime.assert(newMaxAdvanceBps_0 >= 5000n
                            &&
                            newMaxAdvanceBps_0 <= 9500n,
                            'Max advance bps out of range');
    __compactRuntime.assert(newMaxBuyerConcentrationCents_0 >= 1000000n,
                            'Concentration cap must be >= $10,000');
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(1n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(newMinCreditScore_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(2n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_3.toValue(newMaxAdvanceBps_0),
                                                                                              alignment: _descriptor_3.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_17.toValue(3n),
                                                                                              alignment: _descriptor_17.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(newMaxBuyerConcentrationCents_0),
                                                                                              alignment: _descriptor_7.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    return [];
  }
  async _pledgeInvoice_0(context,
                         partialProofData,
                         factorPk_0,
                         auditorPk_0,
                         requestedAdvanceBps_0)
  {
    const supplierPk_0 = this._deriveSupplierPk_0(this._localSecretKey_0(context,
                                                                         partialProofData));
    const docHash_0 = this._localInvoiceDocHash_0(context, partialProofData);
    const buyerTaxHash_0 = this._localBuyerTaxHash_0(context, partialProofData);
    const faceValue_0 = this._localFaceValueCents_0(context, partialProofData);
    const existingExposure_0 = this._localBuyerExposureCents_0(context,
                                                               partialProofData);
    const creditScore_0 = this._localCreditScore_0(context, partialProofData);
    const salt_0 = this._localInvoiceSalt_0(context, partialProofData);
    __compactRuntime.assert(faceValue_0 >= 100000n,
                            'Invoice face value below $1,000 minimum');
    __compactRuntime.assert(faceValue_0 <= 500000000n,
                            'Invoice face value exceeds $5,000,000 maximum');
    __compactRuntime.assert(creditScore_0
                            >=
                            _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(1n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'Private credit score below policy floor');
    __compactRuntime.assert(creditScore_0 <= 850n,
                            'Private credit score exceeds 850 ceiling');
    __compactRuntime.assert(requestedAdvanceBps_0 >= 5000n,
                            'Advance rate below 50% minimum');
    __compactRuntime.assert(requestedAdvanceBps_0
                            <=
                            _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(2n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'Advance rate exceeds global policy ceiling');
    __compactRuntime.assert(existingExposure_0
                            <=
                            _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(3n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { popeq: { cached: false,
                                                                                                  result: undefined } }]).value),
                            'Existing buyer exposure already exceeds cap');
    let t_0;
    __compactRuntime.assert(faceValue_0
                            <=
                            (t_0 = _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                             partialProofData,
                                                                                             [
                                                                                              { dup: { n: 0 } },
                                                                                              { idx: { cached: false,
                                                                                                       pushPath: false,
                                                                                                       path: [
                                                                                                              { tag: 'value',
                                                                                                                value: { value: _descriptor_17.toValue(3n),
                                                                                                                         alignment: _descriptor_17.alignment() } }] } },
                                                                                              { popeq: { cached: false,
                                                                                                         result: undefined } }]).value),
                             (__compactRuntime.assert(t_0 >= existingExposure_0,
                                                      'result of subtraction would be negative'),
                              t_0 - existingExposure_0)),
                            'Buyer concentration covenant breached');
    const riskTier_0 = creditScore_0 >= 760n ? 0 : creditScore_0 >= 680n ? 1 : 2;
    if (riskTier_0 === 2) {
      __compactRuntime.assert(requestedAdvanceBps_0 <= 8000n,
                              'Tier C invoices capped at 80% advance rate');
    }
    const amountBand_0 = faceValue_0 < 2500000n ?
                         0 :
                         faceValue_0 < 25000000n ? 1 : 2;
    const nullifier_0 = this._computeInvoiceNullifier_0(docHash_0,
                                                        buyerTaxHash_0);
    __compactRuntime.assert(!_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_17.toValue(4n),
                                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'Double-pledge blocked: invoice already financed');
    const commitment_0 = this._computeInvoiceCommitment_0(docHash_0,
                                                          buyerTaxHash_0,
                                                          faceValue_0,
                                                          salt_0);
    const disclosureSeal_0 = this._computeDisclosureSeal_0(commitment_0,
                                                           auditorPk_0,
                                                           faceValue_0,
                                                           creditScore_0);
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(4n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newNull().encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_0 = { supplierPk: supplierPk_0,
                    factorPk: factorPk_0,
                    auditorPk: auditorPk_0,
                    invoiceCommitment: commitment_0,
                    disclosureSeal: disclosureSeal_0,
                    riskTier: riskTier_0,
                    amountBand: amountBand_0,
                    advanceBps: requestedAdvanceBps_0,
                    status: 0,
                    disclosedToAuditor: false };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(5n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(nullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(tmp_0),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(6n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_3.toValue(tmp_1),
                                                                alignment: _descriptor_3.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return nullifier_0;
  }
  async _fundDeal_0(context, partialProofData, nullifier_0) {
    const pubNullifier_0 = nullifier_0;
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(5n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(pubNullifier_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Deal not found');
    const current_0 = _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_17.toValue(5n),
                                                                                                            alignment: _descriptor_17.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(pubNullifier_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    __compactRuntime.assert(current_0.status === 0,
                            'Deal is not in PLEDGED state');
    const callerFactorPk_0 = this._deriveFactorPk_0(this._localSecretKey_0(context,
                                                                           partialProofData));
    __compactRuntime.assert(this._equal_1(callerFactorPk_0, current_0.factorPk),
                            'Unauthorized: caller is not designated factor');
    const tmp_0 = { supplierPk: current_0.supplierPk,
                    factorPk: current_0.factorPk,
                    auditorPk: current_0.auditorPk,
                    invoiceCommitment: current_0.invoiceCommitment,
                    disclosureSeal: current_0.disclosureSeal,
                    riskTier: current_0.riskTier,
                    amountBand: current_0.amountBand,
                    advanceBps: current_0.advanceBps,
                    status: 1,
                    disclosedToAuditor: current_0.disclosedToAuditor };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(5n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(pubNullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(tmp_0),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(7n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_3.toValue(tmp_1),
                                                                alignment: _descriptor_3.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _settleDeal_0(context, partialProofData, nullifier_0) {
    const pubNullifier_0 = nullifier_0;
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(5n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(pubNullifier_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Deal not found');
    const current_0 = _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_17.toValue(5n),
                                                                                                            alignment: _descriptor_17.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(pubNullifier_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    __compactRuntime.assert(current_0.status === 1,
                            'Deal must be FUNDED before settlement');
    const callerFactorPk_0 = this._deriveFactorPk_0(this._localSecretKey_0(context,
                                                                           partialProofData));
    __compactRuntime.assert(this._equal_2(callerFactorPk_0, current_0.factorPk),
                            'Unauthorized: only funding factor can settle');
    const tmp_0 = { supplierPk: current_0.supplierPk,
                    factorPk: current_0.factorPk,
                    auditorPk: current_0.auditorPk,
                    invoiceCommitment: current_0.invoiceCommitment,
                    disclosureSeal: current_0.disclosureSeal,
                    riskTier: current_0.riskTier,
                    amountBand: current_0.amountBand,
                    advanceBps: current_0.advanceBps,
                    status: 2,
                    disclosedToAuditor: current_0.disclosedToAuditor };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(5n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(pubNullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(tmp_0),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(8n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_3.toValue(tmp_1),
                                                                alignment: _descriptor_3.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _flagDispute_0(context, partialProofData, nullifier_0) {
    const pubNullifier_0 = nullifier_0;
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(5n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(pubNullifier_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Deal not found');
    const current_0 = _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_17.toValue(5n),
                                                                                                            alignment: _descriptor_17.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(pubNullifier_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    __compactRuntime.assert(current_0.status === 0 || current_0.status === 1,
                            'Only active PLEDGED or FUNDED deals can be disputed');
    const callerSk_0 = this._localSecretKey_0(context, partialProofData);
    const isSupplier_0 = this._equal_3(this._deriveSupplierPk_0(callerSk_0),
                                       current_0.supplierPk);
    const isFactor_0 = this._equal_4(this._deriveFactorPk_0(callerSk_0),
                                     current_0.factorPk);
    __compactRuntime.assert(isSupplier_0 || isFactor_0,
                            'Unauthorized: caller is neither supplier nor factor');
    const tmp_0 = { supplierPk: current_0.supplierPk,
                    factorPk: current_0.factorPk,
                    auditorPk: current_0.auditorPk,
                    invoiceCommitment: current_0.invoiceCommitment,
                    disclosureSeal: current_0.disclosureSeal,
                    riskTier: current_0.riskTier,
                    amountBand: current_0.amountBand,
                    advanceBps: current_0.advanceBps,
                    status: 3,
                    disclosedToAuditor: current_0.disclosedToAuditor };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(5n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(pubNullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(tmp_0),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(9n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_3.toValue(tmp_1),
                                                                alignment: _descriptor_3.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  async _attestSelectiveDisclosure_0(context, partialProofData, nullifier_0) {
    const pubNullifier_0 = nullifier_0;
    __compactRuntime.assert(_descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_17.toValue(5n),
                                                                                                                  alignment: _descriptor_17.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(pubNullifier_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'Deal not found');
    const current_0 = _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                partialProofData,
                                                                                [
                                                                                 { dup: { n: 0 } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_17.toValue(5n),
                                                                                                            alignment: _descriptor_17.alignment() } }] } },
                                                                                 { idx: { cached: false,
                                                                                          pushPath: false,
                                                                                          path: [
                                                                                                 { tag: 'value',
                                                                                                   value: { value: _descriptor_0.toValue(pubNullifier_0),
                                                                                                            alignment: _descriptor_0.alignment() } }] } },
                                                                                 { popeq: { cached: false,
                                                                                            result: undefined } }]).value);
    __compactRuntime.assert(!current_0.disclosedToAuditor,
                            'Deal already attested by auditor');
    const callerAuditorPk_0 = this._deriveAuditorPk_0(this._localAuditorSecretKey_0(context,
                                                                                    partialProofData));
    __compactRuntime.assert(this._equal_5(callerAuditorPk_0, current_0.auditorPk),
                            'Unauthorized: caller is not designated auditor');
    const verifiedFaceValue_0 = this._localFaceValueCents_0(context,
                                                            partialProofData);
    const verifiedCreditScore_0 = this._localCreditScore_0(context,
                                                           partialProofData);
    const recomputedSeal_0 = this._computeDisclosureSeal_0(current_0.invoiceCommitment,
                                                           current_0.auditorPk,
                                                           verifiedFaceValue_0,
                                                           verifiedCreditScore_0);
    __compactRuntime.assert(this._equal_6(recomputedSeal_0,
                                          current_0.disclosureSeal),
                            'Selective disclosure seal mismatch');
    const tmp_0 = { supplierPk: current_0.supplierPk,
                    factorPk: current_0.factorPk,
                    auditorPk: current_0.auditorPk,
                    invoiceCommitment: current_0.invoiceCommitment,
                    disclosureSeal: current_0.disclosureSeal,
                    riskTier: current_0.riskTier,
                    amountBand: current_0.amountBand,
                    advanceBps: current_0.advanceBps,
                    status: current_0.status,
                    disclosedToAuditor: true };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(5n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(pubNullifier_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_6.toValue(tmp_0),
                                                                                              alignment: _descriptor_6.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    const tmp_1 = 1n;
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_17.toValue(10n),
                                                                  alignment: _descriptor_17.alignment() } }] } },
                                       { addi: { immediate: parseInt(__compactRuntime.valueToBigInt(
                                                              { value: _descriptor_3.toValue(tmp_1),
                                                                alignment: _descriptor_3.alignment() }
                                                                .value
                                                            )) } },
                                       { ins: { cached: true, n: 1 } }]);
    return current_0.disclosureSeal;
  }
  _equal_0(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_4(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_5(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_6(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    callContext: { currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() },
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    get protocolAdminPk() {
      return _descriptor_0.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(0n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get minCreditScore() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(1n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get maxAdvanceBps() {
      return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(2n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    get maxBuyerConcentrationCents() {
      return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(3n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: false,
                                                                                   result: undefined } }]).value);
    },
    pledgedNullifiers: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(4n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                 alignment: _descriptor_7.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(4n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const elem_0 = args_0[0];
        if (!(elem_0.buffer instanceof ArrayBuffer && elem_0.BYTES_PER_ELEMENT === 1 && elem_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'veilfactor.compact line 50 char 1',
                                     'Bytes<32>',
                                     elem_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(4n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(elem_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[4];
        return self_0.asMap().keys().map((elem) => _descriptor_0.fromValue(elem.value))[Symbol.iterator]();
      }
    },
    deals: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(5n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_7.toValue(0n),
                                                                                                                                 alignment: _descriptor_7.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(5n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'veilfactor.compact line 51 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_5.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(5n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'veilfactor.compact line 51 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_6.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_17.toValue(5n),
                                                                                                     alignment: _descriptor_17.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[5];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_6.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    },
    get totalPledged() {
      return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(6n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get totalFunded() {
      return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(7n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get totalSettled() {
      return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(8n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get totalDisputed() {
      return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(9n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    },
    get totalAuditorDisclosures() {
      return _descriptor_7.fromValue(__compactRuntime.queryLedgerState(context,
                                                                       partialProofData,
                                                                       [
                                                                        { dup: { n: 0 } },
                                                                        { idx: { cached: false,
                                                                                 pushPath: false,
                                                                                 path: [
                                                                                        { tag: 'value',
                                                                                          value: { value: _descriptor_17.toValue(10n),
                                                                                                   alignment: _descriptor_17.alignment() } }] } },
                                                                        { popeq: { cached: true,
                                                                                   result: undefined } }]).value);
    }
  };
}
const _emptyContext = {
  callContext: { currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress()), currentGasCost: __compactRuntime.emptyRunningCost() }
};
const _dummyContract = new Contract({
  localSecretKey: (...args) => undefined,
  localInvoiceDocHash: (...args) => undefined,
  localBuyerTaxHash: (...args) => undefined,
  localFaceValueCents: (...args) => undefined,
  localBuyerExposureCents: (...args) => undefined,
  localCreditScore: (...args) => undefined,
  localInvoiceSalt: (...args) => undefined,
  localAuditorSecretKey: (...args) => undefined
});
export const pureCircuits = {
  deriveRolePk: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`deriveRolePk: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    const domainTag_0 = args_0[1];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('deriveRolePk',
                                 'argument 1',
                                 'veilfactor.compact line 73 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    if (!(domainTag_0.buffer instanceof ArrayBuffer && domainTag_0.BYTES_PER_ELEMENT === 1 && domainTag_0.length === 32)) {
      __compactRuntime.typeError('deriveRolePk',
                                 'argument 2',
                                 'veilfactor.compact line 73 char 1',
                                 'Bytes<32>',
                                 domainTag_0)
    }
    return _dummyContract._deriveRolePk_0(sk_0, domainTag_0);
  },
  deriveAdminPk: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveAdminPk: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('deriveAdminPk',
                                 'argument 1',
                                 'veilfactor.compact line 77 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._deriveAdminPk_0(sk_0);
  },
  deriveSupplierPk: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveSupplierPk: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('deriveSupplierPk',
                                 'argument 1',
                                 'veilfactor.compact line 81 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._deriveSupplierPk_0(sk_0);
  },
  deriveFactorPk: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveFactorPk: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('deriveFactorPk',
                                 'argument 1',
                                 'veilfactor.compact line 85 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._deriveFactorPk_0(sk_0);
  },
  deriveAuditorPk: (...args_0) => {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`deriveAuditorPk: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const sk_0 = args_0[0];
    if (!(sk_0.buffer instanceof ArrayBuffer && sk_0.BYTES_PER_ELEMENT === 1 && sk_0.length === 32)) {
      __compactRuntime.typeError('deriveAuditorPk',
                                 'argument 1',
                                 'veilfactor.compact line 89 char 1',
                                 'Bytes<32>',
                                 sk_0)
    }
    return _dummyContract._deriveAuditorPk_0(sk_0);
  },
  computeInvoiceNullifier: (...args_0) => {
    if (args_0.length !== 2) {
      throw new __compactRuntime.CompactError(`computeInvoiceNullifier: expected 2 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const docHash_0 = args_0[0];
    const buyerTaxHash_0 = args_0[1];
    if (!(docHash_0.buffer instanceof ArrayBuffer && docHash_0.BYTES_PER_ELEMENT === 1 && docHash_0.length === 32)) {
      __compactRuntime.typeError('computeInvoiceNullifier',
                                 'argument 1',
                                 'veilfactor.compact line 95 char 1',
                                 'Bytes<32>',
                                 docHash_0)
    }
    if (!(buyerTaxHash_0.buffer instanceof ArrayBuffer && buyerTaxHash_0.BYTES_PER_ELEMENT === 1 && buyerTaxHash_0.length === 32)) {
      __compactRuntime.typeError('computeInvoiceNullifier',
                                 'argument 2',
                                 'veilfactor.compact line 95 char 1',
                                 'Bytes<32>',
                                 buyerTaxHash_0)
    }
    return _dummyContract._computeInvoiceNullifier_0(docHash_0, buyerTaxHash_0);
  },
  computeInvoiceCommitment: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`computeInvoiceCommitment: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const docHash_0 = args_0[0];
    const buyerTaxHash_0 = args_0[1];
    const faceValueCents_0 = args_0[2];
    const salt_0 = args_0[3];
    if (!(docHash_0.buffer instanceof ArrayBuffer && docHash_0.BYTES_PER_ELEMENT === 1 && docHash_0.length === 32)) {
      __compactRuntime.typeError('computeInvoiceCommitment',
                                 'argument 1',
                                 'veilfactor.compact line 107 char 1',
                                 'Bytes<32>',
                                 docHash_0)
    }
    if (!(buyerTaxHash_0.buffer instanceof ArrayBuffer && buyerTaxHash_0.BYTES_PER_ELEMENT === 1 && buyerTaxHash_0.length === 32)) {
      __compactRuntime.typeError('computeInvoiceCommitment',
                                 'argument 2',
                                 'veilfactor.compact line 107 char 1',
                                 'Bytes<32>',
                                 buyerTaxHash_0)
    }
    if (!(typeof(faceValueCents_0) === 'bigint' && faceValueCents_0 >= 0n && faceValueCents_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('computeInvoiceCommitment',
                                 'argument 3',
                                 'veilfactor.compact line 107 char 1',
                                 'Uint<0..18446744073709551616>',
                                 faceValueCents_0)
    }
    if (!(salt_0.buffer instanceof ArrayBuffer && salt_0.BYTES_PER_ELEMENT === 1 && salt_0.length === 32)) {
      __compactRuntime.typeError('computeInvoiceCommitment',
                                 'argument 4',
                                 'veilfactor.compact line 107 char 1',
                                 'Bytes<32>',
                                 salt_0)
    }
    return _dummyContract._computeInvoiceCommitment_0(docHash_0,
                                                      buyerTaxHash_0,
                                                      faceValueCents_0,
                                                      salt_0);
  },
  computeDisclosureSeal: (...args_0) => {
    if (args_0.length !== 4) {
      throw new __compactRuntime.CompactError(`computeDisclosureSeal: expected 4 arguments (as invoked from Typescript), received ${args_0.length}`);
    }
    const invoiceCommitment_0 = args_0[0];
    const auditorPk_0 = args_0[1];
    const faceValueCents_0 = args_0[2];
    const creditScore_0 = args_0[3];
    if (!(invoiceCommitment_0.buffer instanceof ArrayBuffer && invoiceCommitment_0.BYTES_PER_ELEMENT === 1 && invoiceCommitment_0.length === 32)) {
      __compactRuntime.typeError('computeDisclosureSeal',
                                 'argument 1',
                                 'veilfactor.compact line 123 char 1',
                                 'Bytes<32>',
                                 invoiceCommitment_0)
    }
    if (!(auditorPk_0.buffer instanceof ArrayBuffer && auditorPk_0.BYTES_PER_ELEMENT === 1 && auditorPk_0.length === 32)) {
      __compactRuntime.typeError('computeDisclosureSeal',
                                 'argument 2',
                                 'veilfactor.compact line 123 char 1',
                                 'Bytes<32>',
                                 auditorPk_0)
    }
    if (!(typeof(faceValueCents_0) === 'bigint' && faceValueCents_0 >= 0n && faceValueCents_0 <= 18446744073709551615n)) {
      __compactRuntime.typeError('computeDisclosureSeal',
                                 'argument 3',
                                 'veilfactor.compact line 123 char 1',
                                 'Uint<0..18446744073709551616>',
                                 faceValueCents_0)
    }
    if (!(typeof(creditScore_0) === 'bigint' && creditScore_0 >= 0n && creditScore_0 <= 65535n)) {
      __compactRuntime.typeError('computeDisclosureSeal',
                                 'argument 4',
                                 'veilfactor.compact line 123 char 1',
                                 'Uint<0..65536>',
                                 creditScore_0)
    }
    return _dummyContract._computeDisclosureSeal_0(invoiceCommitment_0,
                                                   auditorPk_0,
                                                   faceValueCents_0,
                                                   creditScore_0);
  }
};
export const expectedVk = {
  'attestSelectiveDisclosure': 'c3bdd0df157ce13689e747be9210ef0381ee3a3c93e1d6dc325601aa4b5b6919',
  'flagDispute': '0a72abc03d5e2c5860170a85998f07f8fef5e6104c816627b0361e1758c32950',
  'fundDeal': 'efefddfac7685b3592af4f4d6991b863104381c3a4a6680c8c49ffe4ad04862b',
  'pledgeInvoice': '6fe0ee9b55348204373143cd66364c772c0fc0c958cc68105c5eac7698a18ca5',
  'settleDeal': '494d1f1fdb8e61e05977cbf8bbe901367c280cca2e4b95746dcbbf7009ec5aa0',
  'updateRiskPolicy': '31963019ad23e7687ae01c7ffc67f1afb72e945a6a6d2806c203af4c8a194f76',
};

export const circuitSignatures = {
  'deriveRolePk': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'deriveAdminPk': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'deriveSupplierPk': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'deriveFactorPk': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'deriveAuditorPk': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'computeInvoiceNullifier': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'computeInvoiceCommitment': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Bytes', length: 32}, {tag: 'Uint', maxval: '18446744073709551615'}, {tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
  'computeDisclosureSeal': {pure: true, provable: false, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Bytes', length: 32}, {tag: 'Uint', maxval: '18446744073709551615'}, {tag: 'Uint', maxval: '65535'}], resultType: {tag: 'Bytes', length: 32}},
  'updateRiskPolicy': {pure: false, provable: true, argumentTypes: [{tag: 'Uint', maxval: '65535'}, {tag: 'Uint', maxval: '65535'}, {tag: 'Uint', maxval: '18446744073709551615'}], resultType: {tag: 'Tuple', types: []}},
  'pledgeInvoice': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}, {tag: 'Bytes', length: 32}, {tag: 'Uint', maxval: '65535'}], resultType: {tag: 'Bytes', length: 32}},
  'fundDeal': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Tuple', types: []}},
  'settleDeal': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Tuple', types: []}},
  'flagDispute': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Tuple', types: []}},
  'attestSelectiveDisclosure': {pure: false, provable: true, argumentTypes: [{tag: 'Bytes', length: 32}], resultType: {tag: 'Bytes', length: 32}},
};

export const declaredInterfaces = {};

//# sourceMappingURL=index.js.map
