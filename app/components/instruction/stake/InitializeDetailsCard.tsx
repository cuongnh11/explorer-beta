import { Address } from '@components/common/Address';
import { Epoch } from '@components/common/Epoch';
import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction, SignatureResult, StakeProgram, SystemProgram } from '@solana/web3.js';
import { displayTimestampUtc } from '@utils/date';
import React from 'react';

import { InstructionCard } from '../InstructionCard';
import { InitializeInfo } from './types';

export function InitializeDetailsCard(props: {
    ix: ParsedInstruction;
    index: number;
    result: SignatureResult;
    info: InitializeInfo;
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
            title={t('stake_program_initialize_stake')}
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
                <td>{t('stake_authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.authorized.staker} alignRight link />
                </td>
            </tr>

            <tr>
                <td>{t('withdraw_authority_address')}</td>
                <td className="text-lg-end">
                    <Address pubkey={info.authorized.withdrawer} alignRight link />
                </td>
            </tr>

            {info.lockup.epoch > 0 && (
                <tr>
                    <td>{t('lockup_expiry_epoch')}</td>
                    <td className="text-lg-end">
                        <Epoch epoch={info.lockup.epoch} link />
                    </td>
                </tr>
            )}

            {info.lockup.unixTimestamp > 0 && (
                <tr>
                    <td>{t('lockup_expiry_timestamp')}</td>
                    <td className="text-lg-end font-monospace">
                        {displayTimestampUtc(info.lockup.unixTimestamp * 1000)}
                    </td>
                </tr>
            )}

            {!info.lockup.custodian.equals(SystemProgram.programId) && (
                <tr>
                    <td>{t('lockup_custodian_address')}</td>
                    <td className="text-lg-end">
                        <Address pubkey={info.lockup.custodian} alignRight link />
                    </td>
                </tr>
            )}
        </InstructionCard>
    );
}
