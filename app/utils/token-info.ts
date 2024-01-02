import { PublicKey } from '@solana/web3.js';
import { ChainId } from '@solflare-wallet/utl-sdk';

import { Cluster } from './cluster';
import { RENEC_HUB_PRODUCTION_V2_URL } from './constants';

type TokenExtensions = {
    readonly website?: string;
    readonly bridgeContract?: string;
    readonly assetContract?: string;
    readonly address?: string;
    readonly explorer?: string;
    readonly twitter?: string;
    readonly github?: string;
    readonly medium?: string;
    readonly tgann?: string;
    readonly tggroup?: string;
    readonly discord?: string;
    readonly serumV3Usdt?: string;
    readonly serumV3Usdc?: string;
    readonly coingeckoId?: string;
    readonly imageUrl?: string;
    readonly description?: string;
};
export type FullLegacyTokenInfo = {
    readonly chainId: number;
    readonly address: string;
    readonly name: string;
    readonly decimals: number;
    readonly symbol: string;
    readonly logoURI?: string;
    readonly tags?: string[];
    readonly extensions?: TokenExtensions;
};

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

interface TokenListsResponse {
    meta?: {
        current_page: number;
        next_page: number | null;
        total_pages: number;
        per_page: number;
    };
    tokens: FullLegacyTokenInfo[];
}

export const fetchTokensInfo = async (params: {
    keyword?: string;
    coin_addresses?: string[];
    chainId: number;
    page?: number;
    per?: number;
}): Promise<TokenListsResponse> => {
    const query: any = {
        ...params,
        chainId: undefined,
        chain_id: params.chainId === ChainId.TESTNET ? 'testnet' : 'mainnet',
        coin_addresses: params.coin_addresses?.length ? params.coin_addresses.join(',') : undefined,
        per: params.per || 20,
    };

    const queryString = Object.keys(query)
    .filter(key => query[key] !== undefined)
    .map(key => `${key}=${query[key]}`)
    .join('&');

    try {
        const resp = await fetch(`${RENEC_HUB_PRODUCTION_V2_URL}/token_lists?${queryString}`);
        if (resp.ok) {
            return await resp.json();
        } else {
            const text = await resp.text();
            throw new Error(text);
        }
    } catch (error) {
        console.log('fetchTokensInfo', error);
        return {
            tokens: [],
        };
    }
};

export async function getTokenInfo(address: PublicKey, cluster: Cluster): Promise<FullTokenInfo | undefined> {
    const chainId = getChainId(cluster);
    if (!chainId) return undefined;

    const data = await fetchTokensInfo({
        chainId,
        coin_addresses: [address.toBase58()],
        per: 1,
    });
    return data.tokens?.[0];
}

export async function getTokenInfos(addresses: PublicKey[], cluster: Cluster): Promise<FullTokenInfo[] | undefined> {
    const chainId = getChainId(cluster);
    if (!chainId) return undefined;
  
    const data = await fetchTokensInfo({
        chainId,
        coin_addresses: addresses.map(item => item.toBase58()),
        per: addresses.length,
    });
    return data.tokens;
}
