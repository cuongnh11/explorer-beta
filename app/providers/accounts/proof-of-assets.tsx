'use client';

import * as Cache from '@providers/cache';
import { ActionType, FetchStatus } from '@providers/cache';
import { useCluster } from '@providers/cluster';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { Cluster } from '@utils/cluster';
import { TokenAccountInfo } from '@utils/validators/accounts/token';
import React from 'react';
import { create } from 'superstruct';

import { TokenInfoWithPubkey } from './tokens';

function isCheckAccountBalance(api: string) {
  try {
    // check valid public key
    new PublicKey(api);
    return true;
  } catch {
    return false;
  }
}

const PROOF_OF_ASSETS: {
    [cluster in Cluster]?: {
        [tokenAddress: string]: {
            address: string;
            api: string;
            balanceField: string;
            decimals: number;
            link: string;
            symbol: string;
        }[];
    };
} = {
    [Cluster.MainnetBeta]: {
        '2kNzm2v6KR5dpzgavS2nssLV9RxogVP6py2S6doJEfuZ': [
            {
                // reVND
                address: '977HycG4LHMYNw3Toe9y5dZuokTNJfWye3QaLyNV4zeH',
                api: '977HycG4LHMYNw3Toe9y5dZuokTNJfWye3QaLyNV4zeH',
                balanceField: '4Q89182juiadeFgGw3fupnrwnnDmBhf7e7fHWxnUP3S3',
                decimals: 0,
                link: '/address/977HycG4LHMYNw3Toe9y5dZuokTNJfWye3QaLyNV4zeH/tokens',
                symbol: 'reUSD',
            },
        ],
        '4Q89182juiadeFgGw3fupnrwnnDmBhf7e7fHWxnUP3S3': [
            {
                // reUSD
                address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
                api: 'https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xdac17f958d2ee523a2206206994597c13d831ec7&address=0x506bf5765f67eb3a5b8ab1419853cb87171509ff&tag=latest&apikey=AHKTCY9QTH21P4QYNVDAA288S46ZY5AT82',
                balanceField: 'result',
                decimals: 6,
                link: 'https://etherscan.io/token/0xdac17f958d2ee523a2206206994597c13d831ec7?a=0x506bf5765f67eb3a5b8ab1419853cb87171509ff',
                symbol: 'USDT',
            },
        ],
        BfSYryW6Q93iUKE4uNsUtAdxQT9uU4GSVg2si3outLk1: [
            {
                // reNGN
                address: 'HaxxjjE7tneYL82oZH8b7bs5WmTyM2z1iDYpbrGX5nJj',
                api: 'HaxxjjE7tneYL82oZH8b7bs5WmTyM2z1iDYpbrGX5nJj',
                balanceField: '4Q89182juiadeFgGw3fupnrwnnDmBhf7e7fHWxnUP3S3',
                decimals: 9,
                link: '/address/HaxxjjE7tneYL82oZH8b7bs5WmTyM2z1iDYpbrGX5nJj/tokens',
                symbol: 'reUSD',
            },
        ],
        GwGh3b7iNibT3gpGn6SwZA9xZme7Th4NZmuGVD75jpZL: [
            {
                // reETH
                address: '0x506BF5765F67eB3a5B8AB1419853cb87171509Ff',
                api: 'https://api.etherscan.io/api?module=account&action=balance&address=0x506bf5765f67eb3a5b8ab1419853cb87171509ff&tag=latest&apikey=AHKTCY9QTH21P4QYNVDAA288S46ZY5AT82',
                balanceField: 'result',
                decimals: 18,
                link: 'https://etherscan.io/address/0x506BF5765F67eB3a5B8AB1419853cb87171509Ff',
                symbol: 'ETH',
            },
        ],
        GwPQTMg3eMVpDTEE3daZDtGsBtNHBK3X47dbBJvXUzF4: [
            {
                // reBTC
                address: '3CJZhg7LaAUpWMwpeDHrNAp5YzJTQBrax8',
                api: 'https://blockchain.info/q/addressbalance/3CJZhg7LaAUpWMwpeDHrNAp5YzJTQBrax8',
                balanceField: '',
                decimals: 8,
                link: 'https://www.blockchain.com/explorer/addresses/btc/3CJZhg7LaAUpWMwpeDHrNAp5YzJTQBrax8',
                symbol: 'BTC',
            },
        ],
    },
};

export type ProofOfAsset = {
    address: string;
    balanceUI: string;
    balance: string;
    link: string;
    symbol: string;
};

type ProofOfAssets = {
    proofOfAssets?: ProofOfAsset[];
};

type ProofOfAssetsUpdate = {
    proofOfAssets?: ProofOfAsset[];
};

type State = Cache.State<ProofOfAssets>;
type Dispatch = Cache.Dispatch<ProofOfAssetsUpdate>;

function reconcile(history: ProofOfAssets | undefined, update: ProofOfAssetsUpdate | undefined) {
    if (!update?.proofOfAssets) return history;

    return {
        proofOfAssets: update.proofOfAssets ? [...update.proofOfAssets] : history?.proofOfAssets,
    };
}

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

type ProofOfAssetsProviderProps = { children: React.ReactNode };
export function ProofOfAssetsProvider({ children }: ProofOfAssetsProviderProps) {
    const { url } = useCluster();
    const [state, dispatch] = Cache.useCustomReducer(url, reconcile);

    React.useEffect(() => {
        dispatch({ type: ActionType.Clear, url });
    }, [dispatch, url]);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
}

function numberWithComma(value: string) {
    let result = value;
    if (result.includes('.')) {
        result = result.replace(/\.?0+$/, '').replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } else {
        result = result.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    }
    return result;
}

async function fetchProofOfAssets(dispatch: Dispatch, tokenMint: string, cluster: Cluster, url: string) {
    const infos = PROOF_OF_ASSETS[cluster]?.[tokenMint];
    if (!infos?.length) {
        return dispatch({
            data: {
                proofOfAssets: [],
            },
            key: tokenMint,
            status: FetchStatus.Fetched,
            type: ActionType.Update,
            url,
        });
    }
    dispatch({
        key: tokenMint,
        status: FetchStatus.Fetching,
        type: ActionType.Update,
        url,
    });

    let status;
    let proofOfAssets: ProofOfAsset[] = [];
    try {
        const proofInfos = await Promise.all(
            infos.map(async info => {
                try {
                    if (isCheckAccountBalance(info.api)) {
                        const { value } = await new Connection(url, 'processed').getParsedTokenAccountsByOwner(new PublicKey(info.api), {
                            programId: TOKEN_PROGRAM_ID,
                        });
    
                        const tokens: TokenInfoWithPubkey[] = value.slice(0, 101).map(accountInfo => {
                            const parsedInfo = accountInfo.account.data.parsed.info;
                            const info = create(parsedInfo, TokenAccountInfo);
                            return { info, pubkey: accountInfo.pubkey };
                        });
                        const findToken = tokens.find(token => token.info.mint.toBase58() === info.balanceField);
                        if (findToken) {
                          return {
                            address: info.address,
                            balance: findToken.info.tokenAmount.amount,
                            balanceUI: findToken.info.tokenAmount.uiAmountString,
                            link: info.link,
                            symbol: info.symbol,
                        };
                        }
                    } else {
                        const resp: any = await fetch(info.api);
                        if (resp.ok) {
                            const data = await resp.json();
                            const balance = info.balanceField ? data[info.balanceField] : data;
                            const balanceUi = info.decimals && balance ? Number(balance) / 10 ** info.decimals : 0;
                            return {
                                address: info.address,
                                balance: String(balance) || '0',
                                balanceUI: numberWithComma(balanceUi.toString()),
                                link: info.link,
                                symbol: info.symbol,
                            };
                        }
                    }
                } catch (error) {
                    console.log('getProofOfAsset error:', error);
                }
            })
        );
        proofOfAssets = proofInfos.filter(Boolean).sort((a, b) => {
            const aValue = BigInt(a!.balance);
            const bValue = BigInt(b!.balance);
            if (bValue > aValue) {
                return 1;
            } else if (bValue < aValue) {
                return -1;
            } else {
                return 0;
            }
        }) as ProofOfAsset[];
        status = FetchStatus.Fetched;
    } catch (error) {
        if (cluster !== Cluster.Custom) {
            console.error(error, { url });
        }
        status = FetchStatus.FetchFailed;
    }

    dispatch({
        data: {
            proofOfAssets,
        },
        key: tokenMint,
        status,
        type: ActionType.Update,
        url,
    });
}

export function useProofOfAssets(address: string): {
    proofOfAssets: ProofOfAsset[];
    cacheData?: Cache.CacheEntry<ProofOfAssets>;
} {
    const context = React.useContext(StateContext);
    if (!context) {
        throw new Error(`useTokenHolders must be used within a AccountsProvider`);
    }

    return {
        cacheData: context.entries[address],
        proofOfAssets: context.entries[address]?.data?.proofOfAssets || [],
    };
}

export function useFetchProofOfAssets() {
    const { cluster, url } = useCluster();
    const state = React.useContext(StateContext);
    const dispatch = React.useContext(DispatchContext);
    if (!state || !dispatch) {
        throw new Error(`useFetchProofOfAssets must be used within a AccountsProvider`);
    }

    return React.useCallback(
        (tokenMint: string) => {
            fetchProofOfAssets(dispatch, tokenMint, cluster, url);
        },
        [state, dispatch, cluster, url]
    );
}
