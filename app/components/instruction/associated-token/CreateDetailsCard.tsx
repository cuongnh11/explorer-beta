import { Address } from '@components/common/Address';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, PublicKey, SignatureResult } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';

export function CreateDetailsCard({
    ix,
    index,
    result,
    innerCards,
    childIndex,
}: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    innerCards?: JSX.Element[];
    childIndex?: number;
}) {
    const { t } = useLanguage();
    const info = ix.parsed.info;
    return (
        <InstructionCard
            ix={ix}
            index={index}
            result={result}
            title={t('associated_token_program_create')}
            innerCards={innerCards}
            childIndex={childIndex}
        >
            <tr>
                <td>{t('program')}</td>
                <td className="text-lg-end">
                    <Address pubkey={ix.programId} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('account')}</td>
                <td className="text-lg-end">
                    <Address pubkey={new PublicKey(info.account)} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('mint')}</td>
                <td className="text-lg-end">
                    <Address pubkey={new PublicKey(info.mint)} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('wallet')}</td>
                <td className="text-lg-end">
                    <Address pubkey={new PublicKey(info.wallet)} alignRight link />
                </td>
            </tr>
        </InstructionCard>
    );
}
