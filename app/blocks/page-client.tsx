"use client"
import {Address} from "@components/common/Address";
import {ErrorCard} from "@components/common/ErrorCard";
import {LoadingCard} from "@components/common/LoadingCard";
import {Slot} from "@components/common/Slot";
import {SolBalance} from "@components/common/SolBalance";
import {TableCardBody} from "@components/common/TableCardBody";
import {useCluster} from "@providers/cluster";
import {Connection, PublicKey} from "@solana/web3.js";
import {displayTimestampUtc} from "@utils/date";
import {useEffect, useState} from "react";

const FETCH_BLOCK_NUMBER = 20;

const Header = () => {
    return (
        <tr>
            <th>BLOCK</th>
            <th>BLOCKHASH</th>
            <th>VALIDATOR</th>
            <th>TXS</th>
            <th>TOTAL FEE</th>
            <th>TIMESTAMP</th>
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
    if (fetching) return null;

    return (
        <div className="card-footer">
            <button className="btn btn-primary w-100" onClick={loadMore}>
                Load more
            </button>
        </div>
    );
};

const BlockRow = ({ block }: any) => {
    const totalFee = block.transactions.reduce(
        (total: number, transaction: { meta: { fee: any } }) =>
            total + transaction.meta.fee,
        0
    );

    return (
        <tr>
            <td>
                <Slot slot={block.slot} link />
            </td>
            <td className="forced-truncate">
                <Address pubkey={new PublicKey(block.blockhash)} link truncate />
            </td>
            <td className="forced-truncate">
                <Address
                    pubkey={new PublicKey(block.rewards[0].pubkey)}
                    link
                    truncate
                />
            </td>
            <td>
                <span>{block.transactions.length}</span>
            </td>
            <td>
        <span>
          <SolBalance lamports={totalFee} />
        </span>
            </td>
            <td>{displayTimestampUtc(block.blockTime * 1000, true)}</td>
        </tr>
    );
};

const BlockPageClient = () => {
    const { url, clusterInfo } = useCluster();
    const connection = new Connection(url);
    const [error, setError] = useState(false);
    const [blocks, setBlocks] = useState<any>([]);
    const [slots, setSlots] = useState<any>([]);
    const [fetching, setFetching] = useState<boolean>(false);
    const lastSlot = Number(clusterInfo?.epochInfo.absoluteSlot) || 0;
    const [lastFetchedSlot, setLastFetchedSlot] = useState<number>(lastSlot);

    useEffect(() => {
        setLastFetchedSlot(lastSlot);
    }, [lastSlot]);

    const fetchSlots = async () => {
        try {
            const data = await connection?.getBlocks(
                lastFetchedSlot - FETCH_BLOCK_NUMBER,
                lastFetchedSlot - 1
            );
            setSlots(data);
        } catch (e) {
            setError(true);
        }
    };

    const fetchBlocks = async () => {
        try {
            setFetching(true);
            const data = await Promise.all(
                slots.map((slot: number) => connection?.getBlock(slot))
            );
            const blocksList = data.map((elm, index) => {
                return { ...elm, slot: slots[index] };
            });
            setBlocks([...blocks, ...blocksList.reverse()]);
        } catch (e) {
            setError(true)
        } finally {
            setFetching(false);
        }
    };

    const retry = () => {
        fetchSlots();
        setBlocks([]);
        setSlots([]);
        setLastFetchedSlot(lastSlot);
    };

    const loadMore = () => {
        setLastFetchedSlot(lastFetchedSlot - FETCH_BLOCK_NUMBER);
    };

    useEffect(() => {
        if (lastFetchedSlot && lastFetchedSlot >= FETCH_BLOCK_NUMBER) {
            fetchSlots();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastFetchedSlot]);

    useEffect(() => {
        setFetching(true);
        fetchBlocks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slots]);

    const render = () => {
        if (fetching) return <LoadingCard message="Loading recent blocks" />;

        if (error) return <ErrorCard text="Failed to fetch blocks" retry={retry} />

        return (
            <div className="card">
                <TableCardBody>
                    <Header />
                    {blocks.map((block: any, index: any) => {
                        return <BlockRow key={index} block={block}/>;
                    })}
                </TableCardBody>
                {!!blocks?.length && (
                    <Footer loadMore={loadMore} fetching={fetching}></Footer>
                )}
            </div>
        )
    }


    return (
        <div className="mt-4 mb-4">
            <div className="mb-3" onClick={retry}>
                Recent blocks <i className="fe fe-repeat text-primary" />
            </div>
            {render()}
        </div>
    );
};

export default BlockPageClient;
