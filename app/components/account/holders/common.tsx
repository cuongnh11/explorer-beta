import { PublicKey } from '@solana/web3.js';
import { fetch } from 'cross-fetch';
import { useEffect, useState } from 'react';

import { Cluster } from '@/app/utils/cluster';
import { FullTokenInfo, getTokenInfo } from '@/app/utils/token-info';

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

export const useTokenInfo = (tokenMint: string, cluster: Cluster) => {
    const [tokenInfo, setTokenInfo] = useState<FullTokenInfo | null>(null);
    const [loadingTokenInfo, setLoadingTokenInfo] = useState(true);

    const refresh = async () => {
        try {
            setLoadingTokenInfo(true);
            const tokenInfo = await getTokenInfo(new PublicKey(tokenMint), cluster);

            setTokenInfo(tokenInfo || null);
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
