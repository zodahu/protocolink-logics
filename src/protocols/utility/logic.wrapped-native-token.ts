import { BigNumberish, constants } from 'ethers';
import * as common from '@composable-router/common';
import * as core from '@composable-router/core';

export type WrappedNativeTokenLogicParams = core.TokenToTokenExactInParams;

export type WrappedNativeTokenLogicFields = core.TokenToTokenFields;

@core.LogicDefinitionDecorator()
export class WrappedNativeTokenLogic
  extends core.Logic
  implements core.LogicInterfaceGetSupportedTokens, core.LogicInterfaceGetPrice
{
  static readonly supportedChainIds = [
    common.ChainId.mainnet,
    common.ChainId.polygon,
    common.ChainId.arbitrum,
    common.ChainId.optimism,
    common.ChainId.avalanche,
    common.ChainId.fantom,
  ];

  getSupportedTokens() {
    return [
      [this.nativeToken, this.wrappedNativeToken],
      [this.wrappedNativeToken, this.nativeToken],
    ];
  }

  getPrice(params: WrappedNativeTokenLogicParams) {
    const { input, tokenOut } = params;
    const output = new common.TokenAmount(tokenOut, input.amount);
    return output;
  }

  async getLogic(fields: WrappedNativeTokenLogicFields) {
    const { input, amountBps } = fields;

    const to = this.wrappedNativeToken.address;
    const iface = common.WETH__factory.createInterface();
    let data: string;
    let amountOffset: BigNumberish | undefined;
    if (input.token.isNative()) {
      data = iface.encodeFunctionData('deposit');
      if (amountBps) amountOffset = constants.MaxUint256;
    } else {
      data = iface.encodeFunctionData('withdraw', [input.amountWei]);
      if (amountBps) amountOffset = common.getParamOffset(0);
    }
    const inputs = [core.newLogicInput({ input, amountBps, amountOffset })];

    return core.newLogic({ to, data, inputs });
  }
}
