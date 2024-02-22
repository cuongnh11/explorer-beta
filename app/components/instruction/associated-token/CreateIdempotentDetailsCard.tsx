import { Address } from '@components/common/Address';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { CreateIdempotentInfo } from './types';

export function CreateIdempotentDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: CreateIdempotentInfo;
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
            title={t('associated_token_program_create_idempotent')}
            innerCards={innerCards}
            childIndex={childIndex}
        >
            <tr>
                <td>{t('source')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.source} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('account')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.account} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('wallet')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.wallet} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('mint')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.mint} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('system_program')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.systemProgram} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('token_program')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.tokenProgram} alignRight link />
                </td>
            </tr>
        </InstructionCard>
    );
}
