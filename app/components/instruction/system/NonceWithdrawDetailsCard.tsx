import { Address } from '@components/common/Address';
import { SolBalance } from '@components/common/SolBalance';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult, SystemProgram } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { WithdrawNonceInfo } from './types';

export function NonceWithdrawDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: WithdrawNonceInfo;
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
            title={t('system_program_withdraw_nonce')}
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
                <td>{t('authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.nonceAuthority} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('to_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.destination} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('withdraw_amount')} (RENEC)</td>
                <td className="text-lg-end">
                    <SolBalance lamports={info.lamports} />
                </td>
            </tr>
        </InstructionCard>
    );
}
