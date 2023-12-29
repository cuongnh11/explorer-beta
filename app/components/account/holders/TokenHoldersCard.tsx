'use client';

import { Address } from '@components/common/Address';
import { ErrorCard } from '@components/common/ErrorCard';
import { LoadingCard } from '@components/common/LoadingCard';
import { FetchStatus } from '@providers/cache';
import { PublicKey } from '@solana/web3.js';
import React from 'react';

import { useAccountInfo } from '@/app/providers/accounts';
import { useFetchTokenHolders, useTokenHolders } from '@/app/providers/accounts/holders';
import { useCluster } from '@/app/providers/cluster';

import { useTokenInfo, useTokenPrices } from './common';
import { TokenHolderCardFooter, TokenHolderCardHeader } from './TokenHolderCardComponents';

type HolderRow = {
    tokenAccount: string;
    account: string;
    quantity: string;
    percentage?: string;
    value?: string;
};

export function TokenHoldersCard({ address }: { address: string }) {
    const cluster = useCluster();
    const { displayData, loadMore, cacheData, isEnd } = useTokenHolders(address);
    const fetchTokenHolders = useFetchTokenHolders();
    const refresh = () => fetchTokenHolders(address);
    const { prices } = useTokenPrices();
    const { tokenInfo } = useTokenInfo(address, cluster.cluster);
    const info = useAccountInfo(address);

    const holdersRows: HolderRow[] = React.useMemo(() => {
        if (!info?.data) return [];
        const tokenAccount = info?.data.data.parsed?.parsed;
        let supply: string | undefined;
        if (tokenAccount) {
            supply = tokenAccount.info?.supply;
        }
        const price = tokenInfo ? prices[tokenInfo.symbol.toLocaleUpperCase()] : undefined;

        return displayData.map(({ tokenAccount, account, amount, amountUi }) => {
            const percentage =
                !supply || supply === '0' ? undefined : ((100 * Number(amount)) / Number(supply)).toFixed(4);
            return {
                account,
                percentage,
                quantity: amountUi,
                tokenAccount,
                value: price ? ((Number(amountUi) || 0) * price).toFixed(2) : undefined,
            };
        });
    }, [info, displayData, prices, tokenInfo]);

    React.useEffect(() => {
        if (!displayData.length) {
            refresh();
        }
    }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

    const detailsList = React.useMemo(() => {
        return holdersRows.map(({ account, percentage, quantity, tokenAccount, value }, index) => {
            return (
                <tr key={tokenAccount}>
                    <td>{index + 1}</td>

                    <td>
                        <Address pubkey={new PublicKey(tokenAccount)} link truncateChars={16} />
                    </td>

                    <td>
                        <Address pubkey={new PublicKey(account)} link truncateChars={16} />
                    </td>
                    <td>{quantity}</td>
                    <td>{percentage ? `${percentage}%` : '-'}</td>

                    <td>{value ? `$${value}` : '-'}</td>
                </tr>
            );
        });
    }, [holdersRows]);

    if (!history) {
        return null;
    }

    if (cacheData?.data === undefined) {
        if (cacheData?.status === FetchStatus.Fetching) {
            return <LoadingCard message="Loading token holders" />;
        }

        return <ErrorCard retry={refresh} text="Failed to fetch token holders" />;
    }

    const fetching = cacheData.status === FetchStatus.Fetching;
    return (
        <div className="card">
            <TokenHolderCardHeader fetching={fetching} refresh={() => refresh()} title="Token Holders" />
            <div className="table-responsive mb-0">
                <table className="table table-sm table-nowrap card-table">
                    <thead>
                        <tr>
                            <th className="text-muted">#</th>
                            <th className="text-muted">Token Account</th>
                            <th className="text-muted">Account</th>
                            <th className="text-muted">Quantity</th>
                            <th className="text-muted">Percentage</th>
                            <th className="text-muted">Value</th>
                        </tr>
                    </thead>
                    <tbody className="list">{detailsList}</tbody>
                </table>
            </div>
            <TokenHolderCardFooter fetching={fetching} foundOldest={isEnd} loadMore={() => loadMore()} />
        </div>
    );
}
