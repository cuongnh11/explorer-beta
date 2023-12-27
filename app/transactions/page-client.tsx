"use client"

import {ErrorCard} from "@components/common/ErrorCard";
import {LoadingCard} from "@components/common/LoadingCard";
import {Signature} from "@components/common/Signature";
import {Slot} from "@components/common/Slot";
import {SolBalance} from "@components/common/SolBalance";
import {TableCardBody} from "@components/common/TableCardBody";
import {useCluster} from "@providers/cluster";
import {ConfirmedTransactionMeta, Connection, Message} from "@solana/web3.js";
import {useEffect, useState} from "react";

const Header = () => {
    return (
        <tr>
            <th>SLOT</th>
            <th>TRANSACTION HASH</th>
            <th>STATUS</th>
            <th>FEE</th>
            <th>TIME</th>
        </tr>
    );
};

const Footer = ({
                    fetching,
                    loadMore,
                }: {
    fetching: boolean;
    loadMore: () => void;
}) => {
    return (
        <div className="card-footer">
            <button className="btn btn-primary w-100" onClick={() => loadMore()}>
                {fetching ? (
                    <>
                        <span className="spinner-grow spinner-grow-sm me-2"></span>
                        Loading transactions
                    </>
                ) : (
                    "Load more"
                )}
            </button>
        </div>
    );
};

const TransactionRow = ({ data }: { data: TransactionResponse }) => {
    const signature = data.transaction.signatures[0];
    const statusText = data?.meta?.err ? "failed" : "success";
    const statusClass = data?.meta?.err ? "warning" : "success";
    const fee = data?.meta?.fee || 0;

    return (
        <tr>
            <td>
                <Slot slot={data.slot} link />
            </td>
            <td>
                <Signature signature={signature} truncate link minimized />
            </td>
            <td>
                <span className={`badge bg-${statusClass}-soft`}>{statusText}</span>
            </td>
            <td>
        <span>
          <SolBalance lamports={fee} />
        </span>
            </td>
            <td>{new Date(data.blockTime).toLocaleString()}</td>
        </tr>
    );
};

type TransactionResponse = {
    transaction: {
        message: Message;
        signatures: string[];
    };
    meta: ConfirmedTransactionMeta | null;
    slot: number;
    blockTime: number;
};

type BlockTransactionReponse = TransactionResponse[];

let currentTransactions = Array<TransactionResponse>();
let lastSlot: number;

const convertArray = (data: any, slot: number) => {
    return data?.transactions.map((it: any) => ({
        ...it,
        blockTime: 1000 * (data?.blockTime || 0),
        slot,
    }));
};

const useRecentTransaction = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [fetched, setFetched] = useState(false);
    const { url } = useCluster();
    const connection = new Connection(url, {commitment: "confirmed"})
    const [transactions, setTransactions] = useState<BlockTransactionReponse>();

    const fetchTransaction = async (loadMode = false) => {
        try {
            loadMode ? setFetched(false) : setLoading(true);
            setError(false);
            const epochInfo = await connection.getEpochInfo()
            lastSlot = lastSlot || Number(epochInfo.absoluteSlot);
            const dataResponse = await Promise.all(
                [0, 1, 2].map((slotNumber) =>
                    connection?.getBlock(lastSlot - slotNumber)
                )
            );
            const data = dataResponse.map((el, index) =>
                convertArray(el, lastSlot - index)
            );
            currentTransactions = currentTransactions.concat(data.flat(1));
            lastSlot = lastSlot - 3;

            setFetched(true);
            setTransactions(currentTransactions);
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
        if (!fetched) {
            fetchTransaction();
        }
    }, [fetched]);

    const retry = () => {
        lastSlot = 0;
        currentTransactions = [];
        fetchTransaction();
    };

    const loadMore = () => {
        fetchTransaction(true);
    };

    return { error, fetched, loadMore, loading, retry, transactions };
};

 const ListTransactionsCard = () => {
    const { transactions, retry, loading, loadMore, fetched, error } =
        useRecentTransaction();

    const render = () => {
        if (error) {
            return <ErrorCard retry={retry} text="Failed to fetch tratransactions" />;
        }
        if (loading) {
            return <LoadingCard message="Loading recent transactions" />;
        }
        return (
            <div className="card">
                <TableCardBody>
                    <Header />
                    {transactions?.map((data) => (
                        <TransactionRow key={data.transaction.signatures[0]} data={data} />
                    ))}
                </TableCardBody>
                {transactions?.length && (
                    <Footer loadMore={loadMore} fetching={!fetched} />
                )}
            </div>
        );
    };

    return (
        <div className="mt-4 mb-4 transaction-card">
            <div className="mb-3 cursor-pointer" onClick={retry}>
                Recent transactions <i className="fe fe-repeat text-primary" />
            </div>
            {render()}
        </div>
    );
};

 export default ListTransactionsCard
