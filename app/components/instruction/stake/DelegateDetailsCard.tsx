import { Address } from '@components/common/Address';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult, StakeProgram } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { DelegateInfo } from './types';

export function DelegateDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: DelegateInfo;
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
            title={t('stake_program_delegate_stake')}
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
                <td>{t('stake_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.stakeAccount} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('delegated_vote_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.voteAccount} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.stakeAuthority} alignRight link />
                </td>
            </tr>
        </InstructionCard>
    );
}
