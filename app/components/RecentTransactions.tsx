"use client"

import {ErrorCard} from "@components/common/ErrorCard";
import {LoadingCard} from "@components/common/LoadingCard";
import {Signature} from "@components/common/Signature";
import {useCluster} from "@providers/cluster";
import {useDashboardInfo} from "@providers/stats/solanaClusterStats";
import {ConfirmedTransactionMeta, Connection, Message} from "@solana/web3.js";
import React, {useEffect, useState} from "react";

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
  const {epochInfo} = useDashboardInfo();
  const {url} = useCluster();
  const connection = new Connection(url, {commitment: "confirmed"});
  const [transactions, setTransactions] = useState<BlockTransactionReponse>();

  const fetchTransaction = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await connection?.getBlock(Number(epochInfo.absoluteSlot));
      setFetched(true);
      setTransactions(data?.transactions.map(it => ({
        ...it,
        blockTime: 1000 * (data?.blockTime || 0),
        epoch: Number(epochInfo.absoluteSlot),
      })))
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

  return {error, loading, retry, transactions};
};

const RecentTransactionRow = ({data}: { data: TransactionResponse }) => {
  const signature = data.transaction.signatures[0];
  const statusClass = data?.meta?.err ? "warning" : "success";
  const statusText = data?.meta?.err ? "failed" : "success"
  return (
    <tr>
      <td>
        <Signature signature={signature} truncate link/>
      </td>
      <td>
        <span className={`badge bg-${statusClass}-soft`}>{statusText}</span>
      </td>
      <td>{data.epoch}</td>
      <td>{new Date(data.blockTime).toLocaleString()}</td>
    </tr>
  );
}

export const RecentTransactionsCard = () => {
  const {error, loading, retry, transactions} = useRecentTransaction()


  const onRetry = () => {
    if (!loading) retry();
  }

  const render = () => {

    if (loading) return <LoadingCard message="Loading recent transactions"/>;

    if (error) return <ErrorCard text="Failed to load transactions" retry={retry}/>;

    return (
      <div className="card">
        <div className="table-responsive mb-0">
          <table className="table table-sm table-nowrap card-table">
            <thead>
            <tr>
              <th>TX HASH</th>
              <th>STATUS</th>
              <th>SLOT</th>
              <th>TIME</th>
            </tr>
            </thead>
            <tbody className="list">
            {transactions?.map(data => (
              <RecentTransactionRow key={data.transaction.signatures[0]} data={data}/>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 d-flex align-items-center">
        <div>Recent Transactions</div>
        <div className="mx-1"/>
        <div onClick={onRetry}>
          <i className="fe fe-repeat text-primary"/>
        </div>
      </div>
      {render()}
    </div>
  )
}
