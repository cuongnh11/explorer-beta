"use client"

import {ErrorCard} from "@components/common/ErrorCard";
import {LoadingCard} from "@components/common/LoadingCard";
import {simplifyTxHash} from "@components/common/Signature";
import {Slot} from "@components/common/Slot";
import {SolBalance} from "@components/common/SolBalance";
import {TableCardBody} from "@components/common/TableCardBody";
import {useCluster} from "@providers/cluster";
import {Connection} from "@solana/web3.js";
import axios from "axios";
import orderBy from 'lodash/orderBy';
import React, {useEffect, useMemo, useState} from "react";
import {Code} from "react-feather";

const OverallInformation = ({
                                 totalValidator,
                                 weightedSkipRate = 0,
                                 averageStakingAPR,
                                 nodeVersion,
                                 superMinority,
}: {
    totalValidator?: number;
    weightedSkipRate?: number;
    averageStakingAPR: number;
    nodeVersion: string;
    superMinority: number;
}) => {
    return (
        <div className="card p-2">
            <div className="row card-body">
                <div className="col-6 col-xl-3 mb-4 mb-xl-4">
                    <div className="">Validator</div>
                    <h1 className="text-primary my-3">
                        {totalValidator}
                    </h1>
                    <div>superMinority: {superMinority}</div>
                </div>
                <div className="col-6 col-xl-3 mb-4 mb-xl-4">
                    <div className="">Weighted Skip Rate</div>
                    <h1 className="text-primary my-3">
                        {weightedSkipRate}%
                    </h1>
                    <div>Non-Weighted: 0</div>
                </div>
                <div className="col-12 col-xl-3 mb-4 mb-xl-4">
                    <div className="">Average Staking APR</div>
                    <h1 className="text-primary my-3">
                        {averageStakingAPR.toFixed(2)}%
                    </h1>
                </div>
                <div className="col-12 col-xl-3 d-flex gap-4">
                    <div>
                        <div className="mb-2">Node version</div>
                        <h2 className="text-primary">{nodeVersion} (100%)</h2>
                    </div>
                    <div className="node-version ">
                        <h1 className="text-primary pb-0 mb-0">
                            {nodeVersion}
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    )
};

const TableHeader = ({onChangeSort}: {
    onChangeSort: (val: any) => void
}) => {
    return (
        <tr>
            <th>#</th>
            <th>VALIDATOR</th>
            <th>
                <div className="d-flex gap-1">
                    <div>STAKE</div>
                    <Code
                        size={16}
                        onClick={() => onChangeSort("activatedStake")}
                        style={{transform: "rotate(90deg)"}}
                    />
                </div>
            </th>
            <th>CUMULATIVE STAKE</th>
            <th>
                <div className="d-flex gap-1">
                    <div>COMMISSION</div>
                    <Code
                        size={16}
                        onClick={() => onChangeSort("commission")}
                        style={{transform: "rotate(90deg)"}}
                    />
                </div>
            </th>
            <th>LAST VOTE</th>
        </tr>
    )
}

const VoteAccountRow = ({data, idx}: {data: any, idx: number}) => {
    const cummulativeStakeTotal = (Number(data.stakePercent) + data.cumulativeStake).toFixed(2)

    return (
        <tr>
            <td>{idx}</td>
            <td >
                <div className="d-flex gap-3 align-items-center">
                    {!!data.staticInfo?.avatarUrl && (
                        <img width={36} src={data.staticInfo?.avatarUrl} alt="avatar" />
                    )}
                    <div>
                        <div>{data?.staticInfo?.name || simplifyTxHash(data.nodePubkey)}</div>
                        <div>
                            {data.node?.version}
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div className="mb-2">
                    <SolBalance lamports={data.activatedStake} />
                </div>
                <div>
                    {data.stakePercent}%
                </div>
            </td>
            <td>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex validator-stake">
                        <div style={{ width: `${data.cumulativeStake}%`}} className="validator-stake--cummulative" />
                        <div style={{ width: `${data.stakePercent}%`}} className="validator-stake--activated" />
                    </div>
                    <div>{cummulativeStakeTotal}%</div>
                </div>
            </td>
            <td>{data.commission}%</td>
            <td>
                <Slot link slot={data.lastVote} />
            </td>
        </tr>
    )
}

export default function ValidatorsPageClient() {
    const {url} = useCluster();
    const [nodeVersion, setNodeVersion] = useState<any>(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false);
    const [averageAPY, setAverageAPY] = useState(0)
    const [totalValidator, setTotalValidator] = useState<number>()
    const [superMinority, setsuperMinority] = useState<number>(0);
    const [allVoteAccounts, setAllVoteAccounts] = useState<any[]>([]);
    const [sort, setSort] = useState<"activatedStake" | "commission">("activatedStake")
    const [orderByRule, setOrderByRule] = useState<"asc" | "desc">("asc")

    const fetchValidatorsData = async () => {
        setLoading(true)
        let voteAccountStatics: any[] = [];
        try {
            voteAccountStatics = (await  axios.get("https://hub.renec.foundation/api/v1/validators")).data
        } catch (e) {
            console.log("fail to get validator static infor")
        }
        try {
            const connection = new Connection(url, {commitment: "confirmed"})
            const [
                versionData,
                voteAccountsData,
                supplyData,
                clusterNodes,
            ] = await Promise.all([
                connection.getVersion(),
                connection.getVoteAccounts(),
                connection.getSupply(),
                connection.getClusterNodes(),
            ]);

            const voteAccounts = voteAccountsData.current;
            const totalSupply = supplyData.value.total

            const delinquentStake = voteAccountsData.delinquent.reduce(
                (prev, current) => prev + current.activatedStake, 0
            );
            const totalActiveStake = delinquentStake + voteAccounts?.reduce(
                (prev, current) => prev + current.activatedStake, 0)

            voteAccounts?.forEach((account: any) => {
                const stakePercent = (
                    (account.activatedStake / totalActiveStake) *
                    100
                ).toFixed(2);

                account.stakePercent = stakePercent;
            });

            setNodeVersion(versionData?.["solana-core"]);
            setTotalValidator(voteAccountsData.current.length);

            const accountsSorted: any = orderBy(voteAccounts, ["stakePercent"], ["desc"]);
            let superMinority = 0;
            for (let i = 0; i < accountsSorted.length; i++) {
                superMinority += Number(accountsSorted[i].stakePercent);
                if (superMinority >= 33) {
                    setsuperMinority(i + 1);
                    break;
                }
            }

            const yearlyRate = 0.045; // (4.5%)
            const totalYearlyBonus = yearlyRate * totalSupply;
            const bonusForEachActiveRenec = totalYearlyBonus / totalActiveStake;

            voteAccounts.forEach((account: any) => {
                const result = bonusForEachActiveRenec * (100 - account.commission);

                account.node = clusterNodes.find(it => it.pubkey === account.nodePubkey);
                account.staticInfo = voteAccountStatics?.find((it: any) => it.voteAddress === account.nodePubkey)
                account.apr = result;
            });
            const averageStakingAPR = voteAccounts.reduce((init, it: any) => init + it.apr, 0) / voteAccounts.length
            setAverageAPY(averageStakingAPR);
            setAllVoteAccounts(voteAccounts)
            setError(false)
        } catch (e) {
            setError(true)
        }  finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchValidatorsData();
    }, []);

    const calculatedData = useMemo(() => {
        const sortedList = orderBy(allVoteAccounts, sort, orderByRule)
        let currentCumulativeStake = 0;
        sortedList.forEach((account) => {
            account.cumulativeStake = currentCumulativeStake;
            currentCumulativeStake += Number(account.stakePercent);
        })

        return sortedList
    }, [allVoteAccounts, orderByRule, sort])

    const toggleOrderByValue = () => {
        setOrderByRule(prev => prev === "asc" ? "desc" : 'asc');
    }

    const onChangeSort = (val: any) => {
        if (val === sort) {
            return toggleOrderByValue();
        }
        setSort(val);
        setOrderByRule("asc");
    }

    if (loading) return <LoadingCard message="Loading validators information" />;

    if (error) return <ErrorCard text="Failed to load validators informations" retry={fetchValidatorsData} />;

    return (
        <>
            <OverallInformation {...{
                averageStakingAPR: averageAPY,
                nodeVersion,
                onChangeSort,
                superMinority,
                totalValidator
            }} />
            <div className="card">
                <TableCardBody>
                    <TableHeader onChangeSort={onChangeSort} />
                    {calculatedData.map((data:any, i) => (
                        <VoteAccountRow key={data.votePubkey} data={data} idx={i + 1} />
                    ))}
                </TableCardBody>
            </div>
        </>
    );
}
