import { Address } from '@components/common/Address';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { RecoverNestedInfo } from './types';

export function RecoverNestedDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: RecoverNestedInfo;
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
            title={t('associated_token_program_recover_nested')}
            innerCards={innerCards}
            childIndex={childIndex}
        >
            <tr>
                <td>{t('destination')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.destination} alignRight link />
                </td>
            </tr>

            <tr>
                <td>Nested Mint</td>
                <td className="text-lg-end">
                    <Address pubkey={info.nestedMint} alignRight link />
                </td>
            </tr>

            <tr>
                <td>Nested Owner</td>
                <td className="text-lg-end">
                    <Address pubkey={info.nestedOwner} alignRight link />
                </td>
            </tr>

            <tr>
                <td>Nested Source</td>
                <td className="text-lg-end">
                    <Address pubkey={info.nestedSource} alignRight link />
                </td>
            </tr>

            <tr>
                <td>Owner Mint</td>
                <td className="text-lg-end">
                    <Address pubkey={info.ownerMint} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('owner')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.wallet} alignRight link />
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
