"use client"

import {ErrorCard} from "@components/common/ErrorCard";
import {LoadingCard} from "@components/common/LoadingCard";
import {useCluster} from "@providers/cluster";
import {Connection} from "@solana/web3.js";
import {useEffect, useState} from "react";

const OverallInformation = ({
                                 totalValidator,
                                 weightedSkipRate = 0,
                                 averageStakingAPR,
                                 nodeVersion,
                                 superMinority
}: {
    totalValidator?: number;
    weightedSkipRate?: number;
    averageStakingAPR: number;
    nodeVersion: string;
    superMinority: number
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
                    <div className="">Average estimated staking APR</div>
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
}

export default function ValidatorsPageClient() {
    const {url} = useCluster();
    const [nodeVersion, setNodeVersion] = useState<any>(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false);
    const [averageAPY, setAverageAPY] = useState(0)
    const [totalValidator, setTotalValidator] = useState<number>()
    const [superMinority, setsuperMinority] = useState<number>(0);

    const fetchValidatorsData = async () => {
        setLoading(true)
        try {
            const connection = new Connection(url, {commitment: "confirmed"})
            const [
                versionData,
                voteAccountsData,
                supplyData,
            ] = await Promise.all([
                connection.getVersion(),
                connection.getVoteAccounts(),
                connection.getSupply()
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

            const accountsSorted: any = [...voteAccounts];
            accountsSorted.sort(
                (a: any, b: any) => Number(b.stakePercent) - Number(a.stakePercent)
            );

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
                account.apr = result;
            });
            const averageStakingAPR = voteAccounts.reduce((init, it: any) => init + it.apr, 0) / voteAccounts.length
            setAverageAPY(averageStakingAPR)
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

    if (loading) return <LoadingCard message="Loading validators information" />

    if (error) return <ErrorCard text="Failed to load validators informations" retry={fetchValidatorsData} />

    return (
        <div>
            <OverallInformation {...{
                averageStakingAPR: averageAPY,
                nodeVersion,
                superMinority,
                totalValidator,
            }} />
        </div>
    )
}
