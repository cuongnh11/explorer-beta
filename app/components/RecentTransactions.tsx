'use client';

import { ErrorCard } from '@components/common/ErrorCard';
import { LoadingCard } from '@components/common/LoadingCard';
import { Signature } from '@components/common/Signature';
import { TableCardBody } from '@components/common/TableCardBody';
import { useCluster } from '@providers/cluster';
import { useLanguage } from '@providers/language-provider';
import { useDashboardInfo } from '@providers/stats/solanaClusterStats';
import { ConfirmedTransactionMeta, Connection, Message } from '@solana/web3.js';
import React, { useEffect, useState } from 'react';
import { Repeat } from 'react-feather';

type TransactionResponse = {
    transaction: {
        message: Message;
        signatures: string[];
    };
    meta: ConfirmedTransactionMeta | null;
    epoch: number;
    blockTime: number;
};

type BlockTransactionReponse = TransactionResponse[];

const useRecentTransaction = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [fetched, setFetched] = useState(false);
    const { epochInfo } = useDashboardInfo();
    const { url } = useCluster();
    const connection = new Connection(url, { commitment: 'confirmed' });
    const [transactions, setTransactions] = useState<BlockTransactionReponse>();

    const fetchTransaction = async () => {
        try {
            setLoading(true);
            setError(false);
            const data = await connection?.getBlock(Number(epochInfo.absoluteSlot));
            setFetched(true);
            setTransactions(
                data?.transactions.map(it => ({
                    ...it,
                    blockTime: 1000 * (data?.blockTime || 0),
                    epoch: Number(epochInfo.absoluteSlot),
                }))
            );
        } catch (err) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setFetched(false);
        // eslint-disable-next-line
    }, [url]);

    useEffect(() => {
        if (epochInfo.absoluteSlot && !fetched) {
            fetchTransaction();
        }
        // eslint-disable-next-line
    }, [epochInfo.absoluteSlot]);

    const retry = () => {
        fetchTransaction();
    };

    return { error, loading, retry, transactions };
};

const RecentTransactionRow = ({ data }: { data: TransactionResponse }) => {
    const signature = data.transaction.signatures[0];
    const statusClass = data?.meta?.err ? 'warning' : 'success';
    const statusText = data?.meta?.err ? 'failed' : 'success';
    return (
        <tr>
            <td>
                <Signature signature={signature} truncate link />
            </td>
            <td>
                <span className={`badge bg-${statusClass}-soft`}>{statusText}</span>
            </td>
            <td>{data.epoch}</td>
            <td>{new Date(data.blockTime).toLocaleString()}</td>
        </tr>
    );
};

export const RecentTransactionsCard = () => {
    const { t } = useLanguage();
    const { error, loading, retry, transactions } = useRecentTransaction();

    const onRetry = () => {
        if (!loading) retry();
    };

    const render = () => {
        if (loading) return <LoadingCard message={t('loading_recent_transactions')} />;

        if (error) return <ErrorCard text={t('failed_to_fetch_transaction')} retry={retry} />;

        return (
            <div className="card">
                <TableCardBody>
                    <tr>
                        <th>TX HASH</th>
                        <th>{t('status').toUpperCase()}</th>
                        <th>{t('slot').toUpperCase()}</th>
                        <th>{t('time').toUpperCase()}</th>
                    </tr>
                    {transactions?.map(data => (
                        <RecentTransactionRow key={data.transaction.signatures[0]} data={data} />
                    ))}
                </TableCardBody>
            </div>
        );
    };

    return (
        <div>
            <div className="mb-3">
                {t('recent_transaction')} <Repeat size={18} onClick={onRetry} className="text-primary" />
            </div>
            {render()}
        </div>
    );
};
