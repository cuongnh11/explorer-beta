import { Address } from '@components/common/Address';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult, StakeProgram } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { AuthorizeInfo } from './types';

export function AuthorizeDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: AuthorizeInfo;
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
            title={t('stake_program_authorize')}
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
                <td>{t('old_authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.authority} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('new_authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.newAuthority} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('authority_type')}</td>
                <td className="text-lg-end">{info.authorityType}</td>
            </tr>
        </InstructionCard>
    );
}
