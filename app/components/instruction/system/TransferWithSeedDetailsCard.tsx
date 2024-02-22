import { Address } from '@components/common/Address';
import { Copyable } from '@components/common/Copyable';
import { SolBalance } from '@components/common/SolBalance';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult, SystemProgram } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { TransferWithSeedInfo } from './types';

export function TransferWithSeedDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: TransferWithSeedInfo;
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
            title={t('system_program_transfer_seed')}
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
                <td>{t('from_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.source} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('destination_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.destination} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('base_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.sourceBase} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('transfer_amount')} (RENEC)</td>
                <td className="text-lg-end">
                    <SolBalance lamports={info.lamports} />
                </td>
            </tr>

            <tr>
                <td>Seed</td>
                <td className="text-lg-end">
                    <Copyable text={info.sourceSeed}>
                        <code>{info.sourceSeed}</code>
                    </Copyable>
                </td>
            </tr>

            <tr>
                <td>{t('source_owner')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.sourceOwner} alignRight link />
                </td>
            </tr>
        </InstructionCard>
    );
}
