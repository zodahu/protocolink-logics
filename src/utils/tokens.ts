import { axios } from './http';
import * as common from '@protocolink/common';

export async function get1InchTokens(chainId: number) {
  const { data } = await axios.get<Record<string, { symbol: string; name: string; decimals: number; address: string }>>(
    `https://tokens.1inch.io/v1.2/${chainId}`
  );

  const nativeToken = common.getNativeToken(chainId);
  const elasticAddress = common.ELASTIC_ADDRESS.toLowerCase();
  const tokens = Object.values(data).map(({ address, decimals, symbol, name }) =>
    address === elasticAddress ? nativeToken : new common.Token(chainId, address, decimals, symbol, name)
  );

  return tokens;
}