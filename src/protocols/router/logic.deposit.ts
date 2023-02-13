import * as rt from 'src/router';

export type RouterDepositLogicGetLogicOptions = Pick<rt.RouterGlobalOptions, 'funds'>;

export class RouterDepositLogic extends rt.logics.LogicBase {
  spenderAddress: string;

  constructor(options: rt.logics.LogicBaseOptions<{ spenderAddress?: string }>) {
    const { spenderAddress, ...others } = options;
    super(others);
    this.spenderAddress = spenderAddress ?? rt.config.getContractAddress(this.chainId, 'SpenderERC20Approval');
  }

  async getLogic({ funds }: RouterDepositLogicGetLogicOptions) {
    const to = this.spenderAddress;
    const iface = rt.contracts.SpenderERC20Approval__factory.createInterface();
    const data =
      funds.length === 1
        ? iface.encodeFunctionData('pullToken', funds.at(0).toValues())
        : iface.encodeFunctionData('pullTokens', funds.toValues());

    return rt.logics.newLogic({ to, data });
  }
}
