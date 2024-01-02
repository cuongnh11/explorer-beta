import { TokenInfo,TokenListProvider } from '@renec-foundation/rpl-token-registry';
import { PublicKey } from '@solana/web3.js';
import { ChainId } from '@solflare-wallet/utl-sdk';

import { Cluster } from './cluster';

export type FullLegacyTokenInfo = TokenInfo;

export interface FullTokenInfo extends FullLegacyTokenInfo {
    verified?: boolean;
}

function getChainId(cluster: Cluster): ChainId | undefined {
    if (cluster === Cluster.MainnetBeta) return ChainId.MAINNET;
    else if (cluster === Cluster.Testnet) return ChainId.TESTNET;
    else return undefined;
}

export function getTokenInfoSwrKey(address: string, cluster: Cluster, connectionUrl: string) {
    return ['get-token-info', address, cluster, connectionUrl];
}

export const fetchTokensInfo = async (addresses: string[], chainId: number): Promise<TokenInfo[]> => {
    try {
        const tokens = await new TokenListProvider().resolve();
        const tokenList = tokens.filterByChainId(chainId).getList();

      return tokenList.filter(item => addresses.includes(item.address));
    } catch (error) {
        console.log('fetchTokensInfo', error);
        return [];
    }
};

export async function getTokenInfo(address: PublicKey, cluster: Cluster): Promise<FullTokenInfo | undefined> {
    const chainId = getChainId(cluster);
    if (!chainId) return undefined;

    const data = await fetchTokensInfo([address.toBase58()], chainId);
    return data?.[0];
}

export async function getTokenInfos(addresses: PublicKey[], cluster: Cluster): Promise<FullTokenInfo[] | undefined> {
    const chainId = getChainId(cluster);
    if (!chainId) return undefined;
  
    const data = await fetchTokensInfo(addresses.map(item => item.toBase58()), chainId);
    return data;
}
