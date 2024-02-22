import { Address } from '@components/common/Address';
import { HexData } from '@components/common/HexData';
import { useLanguage } from '@providers/language-provider';
import { TransactionInstruction } from '@solana/web3.js';
import React from 'react';

export function RawDetails({ ix }: { ix: TransactionInstruction }) {
    const { t } = useLanguage();

    return (
        <>
            {ix.keys.map(({ pubkey, isSigner, isWritable }, keyIndex) => (
                <tr key={keyIndex}>
                    <td>
                        <div className="me-2 d-md-inline">{`${t('account')} ${keyIndex + 1}`}</div>
                        {isWritable && <span className="badge bg-info-soft me-1">{t('writable')}</span>}
                        {isSigner && <span className="badge bg-info-soft me-1">{t('signer')}</span>}
                    </td>
                    <td className="text-lg-end">
                        <Address pubkey={pubkey} alignRight link />
                    </td>
                </tr>
            ))}

            <tr>
                <td>
                    {t('instruction_data')} <span className="text-muted">(Hex)</span>
                </td>
                <td className="text-lg-end">
                    <HexData raw={ix.data} />
                </td>
            </tr>
        </>
    );
}
