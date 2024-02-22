import { useCluster } from '@providers/cluster';
import { useLanguage } from '@providers/language-provider';
import { SignatureResult, TransactionInstruction } from '@solana/web3.js';
import React from 'react';

import { InstructionCard } from './InstructionCard';
import { parseTokenSwapInstructionTitle } from './token-swap/types';

export function TokenSwapDetailsCard({
    ix,
    index,
    result,
    signature,
    innerCards,
    childIndex,
}: {
    ix: TransactionInstruction;
    index: number;
    result: SignatureResult;
    signature: string;
    innerCards?: JSX.Element[];
    childIndex?: number;
}) {
    const { t } = useLanguage();
    const { url } = useCluster();

    let title;
    try {
        title = parseTokenSwapInstructionTitle(ix);
    } catch (error) {
        console.error(error, {
            signature: signature,
            url: url,
        });
    }

    return (
        <InstructionCard
            ix={ix}
            index={index}
            result={result}
            title={t('token_swap', { title: title || 'Unknown' })}
            innerCards={innerCards}
            childIndex={childIndex}
            defaultRaw
        />
    );
}
