import { useLanguage } from '@providers/language-provider';
import { ParsedInstruction } from '@solana/web3.js';
import React from 'react';

export function RawParsedDetails({ ix, children }: { ix: ParsedInstruction; children?: React.ReactNode }) {
    const { t } = useLanguage();

    return (
        <>
            {children}

            <tr>
                <td>
                    {t('instruction_data')} <span className="text-muted">(JSON)</span>
                </td>
                <td className="text-lg-end">
                    <pre className="d-inline-block text-start json-wrap">{JSON.stringify(ix.parsed, null, 2)}</pre>
                </td>
            </tr>
        </>
    );
}
