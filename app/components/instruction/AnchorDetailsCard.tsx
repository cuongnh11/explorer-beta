import { Address } from '@components/common/Address';
import { BorshInstructionCoder, Idl, Instruction, Program } from '@project-serum/anchor';
import { IdlInstruction } from '@project-serum/anchor/dist/cjs/idl';
import { useLanguage } from '@providers/language-provider';
import { SignatureResult, TransactionInstruction } from '@solana/web3.js';
import {
    getAnchorAccountsFromInstruction,
    getAnchorNameForInstruction,
    getAnchorProgramName,
    mapIxArgsToRows,
} from '@utils/anchor';
import { camelToTitleCase } from '@utils/index';
import { useMemo } from 'react';

import { InstructionCard } from './InstructionCard';

export default function AnchorDetailsCard(props: {
    ix: TransactionInstruction;
    index: number;
    result: SignatureResult;
    signature: string;
    innerCards?: JSX.Element[];
    childIndex?: number;
    anchorProgram: Program<Idl>;
}) {
    const { t } = useLanguage();
    const { ix, anchorProgram } = props;
    const programName = getAnchorProgramName(anchorProgram) ?? t('unknown_program');

    const ixName = getAnchorNameForInstruction(ix, anchorProgram) ?? t('unknown_instruction');
    const cardTitle = `${camelToTitleCase(programName)}: ${camelToTitleCase(ixName)}`;

    return (
        <InstructionCard title={cardTitle} {...props}>
            <AnchorDetails ix={ix} anchorProgram={anchorProgram} />
        </InstructionCard>
    );
}

function AnchorDetails({ ix, anchorProgram }: { ix: TransactionInstruction; anchorProgram: Program }) {
    const { t } = useLanguage();
    const { ixAccounts, decodedIxData, ixDef } = useMemo(() => {
        let ixAccounts:
            | {
                  name: string;
                  isMut: boolean;
                  isSigner: boolean;
                  pda?: object;
              }[]
            | null = null;
        let decodedIxData: Instruction | null = null;
        let ixDef: IdlInstruction | undefined;
        if (anchorProgram) {
            const coder = new BorshInstructionCoder(anchorProgram.idl);
            decodedIxData = coder.decode(ix.data);
            if (decodedIxData) {
                ixDef = anchorProgram.idl.instructions.find(ixDef => ixDef.name === decodedIxData?.name);
                if (ixDef) {
                    ixAccounts = getAnchorAccountsFromInstruction(decodedIxData, anchorProgram);
                }
            }
        }

        return {
            decodedIxData,
            ixAccounts,
            ixDef,
        };
    }, [anchorProgram, ix.data]);

    if (!ixAccounts || !decodedIxData || !ixDef) {
        return (
            <tr>
                <td colSpan={3} className="text-lg-center">
                    {t('failed_to_decode_anchor')}
                </td>
            </tr>
        );
    }

    const programName = getAnchorProgramName(anchorProgram) ?? t('unknown_program');

    return (
        <>
            <tr>
                <td>Program</td>
                <td className="text-lg-end" colSpan={2}>
                    <Address pubkey={ix.programId} alignRight link raw overrideText={programName} />
                </td>
            </tr>
            <tr className="table-sep">
                <td>{t('account_name')}</td>
                <td className="text-lg-end" colSpan={2}>
                    {t('address')}
                </td>
            </tr>
            {ix.keys.map(({ pubkey, isSigner, isWritable }, keyIndex) => {
                return (
                    <tr key={keyIndex}>
                        <td>
                            <div className="me-2 d-md-inline">
                                {ixAccounts
                                    ? keyIndex < ixAccounts.length
                                        ? `${camelToTitleCase(ixAccounts[keyIndex].name)}`
                                        : `${t('remaining_account')} #${keyIndex + 1 - ixAccounts.length}`
                                    : `${t('account')} #${keyIndex + 1}`}
                            </div>
                            {isWritable && <span className="badge bg-info-soft me-1">{t('writable')}</span>}
                            {isSigner && <span className="badge bg-info-soft me-1">{t('signer')}</span>}
                        </td>
                        <td className="text-lg-end" colSpan={2}>
                            <Address pubkey={pubkey} alignRight link />
                        </td>
                    </tr>
                );
            })}

            {decodedIxData && ixDef && ixDef.args.length > 0 && (
                <>
                    <tr className="table-sep">
                        <td>{t('argument_name')}</td>
                        <td>{t('type')}</td>
                        <td className="text-lg-end">{t('value')}</td>
                    </tr>
                    {mapIxArgsToRows(decodedIxData.data, ixDef, anchorProgram.idl)}
                </>
            )}
        </>
    );
}
