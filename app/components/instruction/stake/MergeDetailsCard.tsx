import { Address } from '@components/common/Address';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult, StakeProgram } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { MergeInfo } from './types';

export function MergeDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: MergeInfo;
    innerCards?: JSX.Element[];
    childIndex?: number;
}) {
    const { t } = useLanguage();
    const { ix, index, result, info, innerCards, childIndex } = props;

    return (
        <InstructionCard
            ix={ix}
            index={index}
            result={result}
            title={t('stake_program_merge_stake')}
            innerCards={innerCards}
            childIndex={childIndex}
        >
            <tr>
                <td>{t('program')}</td>
                <td className="text-lg-end">
                    <Address pubkey={StakeProgram.programId} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('stake_source')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.source} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('stake_destination')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.destination} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.stakeAuthority} alignRight link />
                </td>
            </tr>

            <tr>
                <td>Clock Sysvar</td>
                <td className="text-lg-end">
                    <Address pubkey={info.clockSysvar} alignRight link />
                </td>
            </tr>

            <tr>
                <td>Stake History Sysvar</td>
                <td className="text-lg-end">
                    <Address pubkey={info.stakeHistorySysvar} alignRight link />
                </td>
            </tr>
        </InstructionCard>
    );
}
