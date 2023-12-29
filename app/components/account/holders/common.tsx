import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { fetch } from 'cross-fetch';
import { useEffect, useState } from 'react';

import { Cluster } from '@/app/utils/cluster';

export type MintDetails = {
    decimals: number;
    mint: string;
};

export function extractMintDetails(transactionWithMeta: ParsedTransactionWithMeta, mintMap: Map<string, MintDetails>) {
    if (transactionWithMeta.meta?.preTokenBalances) {
        transactionWithMeta.meta.preTokenBalances.forEach(balance => {
            const account = transactionWithMeta.transaction.message.accountKeys[balance.accountIndex];
            mintMap.set(account.pubkey.toBase58(), {
                decimals: balance.uiTokenAmount.decimals,
                mint: balance.mint,
            });
        });
    }

    if (transactionWithMeta.meta?.postTokenBalances) {
        transactionWithMeta.meta.postTokenBalances.forEach(balance => {
            const account = transactionWithMeta.transaction.message.accountKeys[balance.accountIndex];
            mintMap.set(account.pubkey.toBase58(), {
                decimals: balance.uiTokenAmount.decimals,
                mint: balance.mint,
            });
        });
    }
}

interface PriceInfo {
    [symbol: string]: number;
}

export const useTokenPrices = () => {
    const [prices, setPrices] = useState<PriceInfo>({});
    const [loadingTokenPrices, setLoadingTokenPrices] = useState(true);

    const refresh = async () => {
        try {
            setLoadingTokenPrices(true);
            const resp: any = await fetch('https://price.renec.foundation/api/quotes');
            if (resp.ok) {
                const tokensPrice: PriceInfo = await resp.json();
                const parsedTokenPrices: PriceInfo = {};
                Object.entries(tokensPrice).forEach(([key, value]) => {
                    const parsedKey = key.toLocaleUpperCase();
                    parsedTokenPrices[parsedKey] = value;

                    if (!parsedKey.startsWith('RE')) {
                        parsedTokenPrices[`RE${parsedKey}`] = value;
                    }
                });
                setPrices(parsedTokenPrices);
            } else {
                setPrices({});
            }
        } catch (error) {
            console.log(`Error at getTokensPrices: ${error}`);
            setPrices({});
        } finally {
            setLoadingTokenPrices(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { loadingTokenPrices, prices };
};

interface TokenInfo {
    readonly chainId: string;
    readonly address: string;
    readonly name: string;
    readonly decimals: number;
    readonly symbol: string;
    readonly logoURI?: string;
    readonly tags?: string[];
    readonly extensions?: any;
}

export const useTokenInfo = (tokenMint: string, cluster: Cluster) => {
    const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
    const [loadingTokenInfo, setLoadingTokenInfo] = useState(true);

    const refresh = async () => {
        try {
            let chain_id;
            if (cluster === Cluster.MainnetBeta) {
                chain_id = 'mainnet';
            } else if (cluster === Cluster.Testnet) {
                chain_id = 'testnet';
            }
            if (!chain_id) throw new Error('Not support slug custom!');

            setLoadingTokenInfo(true);
            const query: any = {
                chain_id,
                coin_addresses: [tokenMint],
                per: 1,
            };
            const queryString = Object.keys(query)
                .filter(key => query[key] !== undefined)
                .map(key => `${key}=${query[key]}`)
                .join('&');
                const resp: any = await fetch(`https://hub.renec.foundation/api/v2/token_lists?${queryString}`);
            if (resp.ok) {
                const tokens = await resp.json();

                setTokenInfo(tokens?.tokens?.[0]);
            } else {
                setTokenInfo(null);
            }
        } catch (error) {
            console.log(`Error at getTokenInfo: ${error}`);
            setTokenInfo(null);
        } finally {
            setLoadingTokenInfo(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return { loadingTokenInfo, tokenInfo };
};
