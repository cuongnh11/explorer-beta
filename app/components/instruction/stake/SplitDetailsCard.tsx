import { Address } from '@components/common/Address';
import { SolBalance } from '@components/common/SolBalance';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult, StakeProgram } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { SplitInfo } from './types';

export function SplitDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: SplitInfo;
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
            title={t('stake_program_split_stake')}
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
                <td>{t('authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.stakeAuthority} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('new_stake_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.newSplitAccount} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('split_amount')} (RENEC)</td>
                <td className="text-lg-end">
                    <SolBalance lamports={info.lamports} />
                </td>
            </tr>
        </InstructionCard>
    );
}
