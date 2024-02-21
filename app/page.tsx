'use client';

import { ErrorCard } from '@components/common/ErrorCard';
import { LoadingCard } from '@components/common/LoadingCard';
import { LiveTransactionStatsCard } from '@components/LiveTransactionStatsCard';
import { RecentTransactionsCard } from '@components/RecentTransactions';
import { StatsNotReady } from '@components/StatsNotReady';
import { useVoteAccounts } from '@providers/accounts/vote-accounts';
import { useCluster } from '@providers/cluster';
import { useLanguage } from '@providers/language-provider';
import { StatsProvider } from '@providers/stats';
import {
    ClusterStatsStatus,
    useDashboardInfo,
    usePerformanceInfo,
    useStatsProvider,
} from '@providers/stats/solanaClusterStats';
import { Status, SupplyProvider, useFetchSupply, useSupply } from '@providers/supply';
import { ClusterStatus } from '@utils/cluster';
import { abbreviatedNumber, lamportsToSol, slotsToHumanString } from '@utils/index';
import { percentage } from '@utils/math';
import React from 'react';

export default function Page() {
    return (
        <StatsProvider>
            <SupplyProvider>
                <div className="container mt-4">
                    <StatsCardBody />
                    <LiveTransactionStatsCard />
                    <StakingComponent />
                    <RecentTransactionsCard />
                </div>
            </SupplyProvider>
        </StatsProvider>
    );
}

function StakingComponent() {
    const { t } = useLanguage();
    const { status } = useCluster();
    const supply = useSupply();
    const fetchSupply = useFetchSupply();
    const { fetchVoteAccounts, voteAccounts } = useVoteAccounts();

    function fetchData() {
        fetchSupply();
        fetchVoteAccounts();
    }

    React.useEffect(() => {
        if (status === ClusterStatus.Connected) {
            fetchData();
        }
    }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

    const delinquentStake = React.useMemo(() => {
        if (voteAccounts) {
            return voteAccounts.delinquent.reduce((prev, current) => prev + current.activatedStake, BigInt(0));
        }
    }, [voteAccounts]);

    const activeStake = React.useMemo(() => {
        if (voteAccounts && delinquentStake) {
            return (
                voteAccounts.current.reduce((prev, current) => prev + current.activatedStake, BigInt(0)) +
                delinquentStake
            );
        }
    }, [voteAccounts, delinquentStake]);

    if (supply === Status.Disconnected) {
        // we'll return here to prevent flicker
        return null;
    }

    if (supply === Status.Idle || supply === Status.Connecting) {
        return <LoadingCard message={t('loading_supply_and_price_data')} />;
    } else if (typeof supply === 'string') {
        return <ErrorCard text={supply} retry={fetchData} />;
    }

    // Calculate to 2dp for accuracy, then display as 1
    const circulatingPercentage = percentage(supply.circulating, supply.total, 2).toFixed(1);

    let delinquentStakePercentage;
    if (delinquentStake && activeStake) {
        delinquentStakePercentage = percentage(delinquentStake, activeStake, 2).toFixed(1);
    }

    return (
        <div className="row staking-card">
            <div className="col-12 col-xl-6">
                <div className="card">
                    <div className="card-body">
                        <h4>{t('active_stake')}</h4>
                        {activeStake ? (
                            <h1>
                                <em>{displayLamports(activeStake)}</em> / <small>{displayLamports(supply.total)}</small>
                            </h1>
                        ) : null}
                        {delinquentStakePercentage && (
                            <h5>
                                {t('delinquent_stake')}: <em>{delinquentStakePercentage}%</em>
                            </h5>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-12 col-xl-6">
                <div className="card">
                    <div className="card-body">
                        <h4>{t('circulating_supply')}</h4>
                        <h1>
                            <em>{displayLamports(supply.circulating)}</em> /{' '}
                            <small>{displayLamports(supply.total)}</small>
                        </h1>
                        <h5>
                            <em>{circulatingPercentage}%</em> {t('percentage_is_circulating')}
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    );
}

function displayLamports(value: number | bigint) {
    return abbreviatedNumber(lamportsToSol(value));
}

function StatsCardBody() {
    const { t } = useLanguage();
    const dashboardInfo = useDashboardInfo();
    const performanceInfo = usePerformanceInfo();
    const { setActive } = useStatsProvider();
    const { cluster } = useCluster();

    React.useEffect(() => {
        setActive(true);
        return () => setActive(false);
    }, [setActive, cluster]);

    if (performanceInfo.status === ClusterStatsStatus.Loading) {
        return <LoadingCard message={t('loading_epoch_data')} />;
    }

    if (performanceInfo.status !== ClusterStatsStatus.Ready || dashboardInfo.status !== ClusterStatsStatus.Ready) {
        const error =
            performanceInfo.status === ClusterStatsStatus.Error || dashboardInfo.status === ClusterStatsStatus.Error;
        return <StatsNotReady error={error} />;
    }

    const { avgSlotTime_1h, avgSlotTime_1min, epochInfo } = dashboardInfo;
    const hourlySlotTime = Math.round(1000 * avgSlotTime_1h);
    const averageSlotTime = Math.round(1000 * avgSlotTime_1min);
    const { slotIndex, slotsInEpoch } = epochInfo;
    const epochProgress = percentage(slotIndex, slotsInEpoch, 2).toFixed(1) + '%';
    const epochTimeRemaining = slotsToHumanString(Number(slotsInEpoch - slotIndex), hourlySlotTime);
    const { absoluteSlot } = epochInfo;

    return (
        <div className="card epoch-stats">
            <div className="row card-body">
                <div className="col-12 col-xl-3">
                    <div className="mb-2 mb-xl-3">{t('slot_height')}</div>
                    <h1 className="text-primary pb-0 mb-0">{absoluteSlot.toLocaleString()}</h1>
                </div>
                <div className="col-12 col-xl-3 mt-4 mt-xl-0">
                    <div className="mb-2 mb-xl-3">{t('current_slot_time')}</div>
                    <h1 className="text-primary pb-0 mb-0">{averageSlotTime} ms</h1>
                </div>
                <div className="col-12 col-xl-6 mt-4 mt-xl-0">
                    <div className="mb-2 mb-xl-3">{t('epoch')}</div>
                    <div className="d-flex align-items-center">
                        <h1 className="text-primary pb-0 mb-0">{epochInfo.epoch.toLocaleString('en-US')}</h1>
                        <div className="flex-grow-1 mx-5">
                            <div className="w-100 d-flex justify-content-between mb-2">
                                <span>{epochProgress}</span>
                                <span>ETA: {epochTimeRemaining}</span>
                            </div>
                            <div className="progress">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                    style={{ width: epochProgress }}
                                />
                            </div>
                        </div>
                        <h1 className="pb-0 mb-0">{Number(epochInfo.epoch.toLocaleString()) + 1}</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
