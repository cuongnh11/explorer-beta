'use client';

import { ErrorCard } from '@components/common/ErrorCard';
import { LoadingCard } from '@components/common/LoadingCard';
import { FetchStatus } from '@providers/cache';
import React from 'react';

import { useFetchProofOfAssets, useProofOfAssets } from '@/app/providers/accounts/proof-of-assets';

import { ProofAddress, ProofOfAssetsCardHeader } from './ProofOfAssetsCardComponents';

export function ProofOfAssetsCard({ address }: { address: string }) {
    const { proofOfAssets, cacheData } = useProofOfAssets(address);
    const fetchProofOfAssets = useFetchProofOfAssets();
    const refresh = () => fetchProofOfAssets(address);

    React.useEffect(() => {
        if (!proofOfAssets.length) {
            refresh();
        }
    }, [address]); // eslint-disable-line react-hooks/exhaustive-deps

    const detailsList = React.useMemo(() => {
        return proofOfAssets.map(({ balanceUI, address, link, symbol }, index) => {
            return (
                <tr key={`${address}-${balanceUI}`}>
                    <td>{index + 1}</td>

                    <td>
                        <ProofAddress address={address} link={link} />
                    </td>

                    <td>{`${balanceUI} ${symbol}`}</td>
                </tr>
            );
        });
    }, [proofOfAssets]);

    if (!history) {
        return null;
    }

    if (cacheData?.data === undefined) {
        if (cacheData?.status === FetchStatus.Fetching) {
            return <LoadingCard message="Loading proof of assets" />;
        }

        return <ErrorCard retry={refresh} text="Failed to fetch proof of assets" />;
    }

    return (
        <div className="card">
            <ProofOfAssetsCardHeader title="Proof of Assets" />
            <div className="table-responsive mb-0">
                <table className="table table-sm table-nowrap card-table">
                    <thead>
                        <tr>
                            <th className="text-muted">Rank</th>
                            <th className="text-muted">Address</th>
                            <th className="text-muted">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="list">{detailsList}</tbody>
                </table>
            </div>
        </div>
    );
}
