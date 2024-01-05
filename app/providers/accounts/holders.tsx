'use client';

import * as Cache from '@providers/cache';
import { ActionType, FetchStatus } from '@providers/cache';
import { useCluster } from '@providers/cluster';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, ParsedAccountData } from '@solana/web3.js';
import { Cluster } from '@utils/cluster';
import React, { useState } from 'react';

export type TokenHolder = {
    tokenAccount: string;
    account: string;
    amount: string;
    amountUi: string;
};

type TokenHolders = {
    tokenHolders?: TokenHolder[];
};

type TokenHoldersUpdate = {
    tokenHolders?: TokenHolder[];
};

type State = Cache.State<TokenHolders>;
type Dispatch = Cache.Dispatch<TokenHoldersUpdate>;

function reconcile(history: TokenHolders | undefined, update: TokenHoldersUpdate | undefined) {
    if (update?.tokenHolders === undefined) return history;

    return {
        tokenHolders: [...update.tokenHolders],
    };
}

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

type TokenHoldersProviderProps = { children: React.ReactNode };
export function TokenHoldersProvider({ children }: TokenHoldersProviderProps) {
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

async function fetchTokenHolders(dispatch: Dispatch, tokenMint: string, cluster: Cluster, url: string) {
    dispatch({
        key: tokenMint,
        status: FetchStatus.Fetching,
        type: ActionType.Update,
        url,
    });

    let status;
    let tokenHolders: TokenHolder[] = [];
    try {
        const connection = new Connection(url);
        const resp = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
            filters: [
                {
                    dataSize: 165,
                },
                {
                    memcmp: {
                        bytes: tokenMint,
                        offset: 0,
                    },
                },
            ],
        });

        tokenHolders = resp.map(item => {
            const data = item.account.data as ParsedAccountData;
            const tokenAmount = data.parsed.info.tokenAmount;
            return {
                account: data.parsed.info.owner,
                amount: tokenAmount.amount,
                amountUi: tokenAmount.uiAmountString,
                tokenAccount: item.pubkey.toBase58(),
            };
        }).sort((a,b) => {
          const aValue = BigInt(a.amount);
          const bValue = BigInt(b.amount);
          if(bValue > aValue) {
            return 1;
          } else if (bValue < aValue){
            return -1;
          } else {
            return 0;
          }
        });
        status = FetchStatus.Fetched;
    } catch (error) {
        if (cluster !== Cluster.Custom) {
            console.error(error, { url });
        }
        status = FetchStatus.FetchFailed;
    }

    dispatch({
        data: {
            tokenHolders,
        },
        key: tokenMint,
        status,
        type: ActionType.Update,
        url,
    });
}

export function useTokenHolders(address: string): {
  allData: TokenHolder[];
  displayData: TokenHolder[];
  loadMore: () => void;
  isEnd: boolean;
  cacheData?: Cache.CacheEntry<TokenHolders>
} {
    const context = React.useContext(StateContext);
    const [page, setPage] = useState(1);
    const [isEnd, setIsEnd] = useState(false);
    const limit = 25;
    if (!context) {
      throw new Error(`useTokenHolders must be used within a AccountsProvider`);
    }

    const tokenHolders: TokenHolder[] = context.entries[address]?.data?.tokenHolders || [];
    const loadMore = () => {
      setPage(old => {
        if (limit * (old + 1) >= tokenHolders.length) {
          setIsEnd(true);
        } else {
          setIsEnd(false);
        }
        return old + 1;
      })
    };

    return {
      allData: tokenHolders,
      cacheData: context.entries[address],
      displayData: tokenHolders.slice(0, page * limit),
      isEnd,
      loadMore,
    };
}

export function useFetchTokenHolders() {
    const { cluster, url } = useCluster();
    const state = React.useContext(StateContext);
    const dispatch = React.useContext(DispatchContext);
    if (!state || !dispatch) {
        throw new Error(`useFetchTokenHolders must be used within a AccountsProvider`);
    }

    return React.useCallback(
        (tokenMint: string) => {
            fetchTokenHolders(dispatch, tokenMint, cluster, url);
        },
        [state, dispatch, cluster, url]
    );
}
