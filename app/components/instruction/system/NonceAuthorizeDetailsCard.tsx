import { Address } from '@components/common/Address';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult, SystemProgram } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { AuthorizeNonceInfo } from './types';

export function NonceAuthorizeDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: AuthorizeNonceInfo;
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
            title={t('system_program_authorize_nonce')}
            innerCards={innerCards}
            childIndex={childIndex}
        >
            <tr>
                <td>{t('program')}</td>
                <td className="text-lg-end">
                    <Address pubkey={SystemProgram.programId} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('nonce_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.nonceAccount} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('old_authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.nonceAuthority} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('new_authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.newAuthorized} alignRight link />
                </td>
            </tr>
        </InstructionCard>
    );
}
