import { Address } from '@components/common/Address';
import { Copyable } from '@components/common/Copyable';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult, SystemProgram } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { AssignWithSeedInfo } from './types';

export function AssignWithSeedDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: AssignWithSeedInfo;
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
            title={t('system_program_assign_account_seed')}
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
                <td>{t('account_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.account} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('base_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.base} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('seed')}</td>
                <td className="text-lg-end">
                    <Copyable text={info.seed}>
                        <code>{info.seed}</code>
                    </Copyable>
                </td>
            </tr>

            <tr>
                <td>{t('assigned_program_id')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.owner} alignRight link />
                </td>
            </tr>
        </InstructionCard>
    );
}
