import {useCluster} from "@providers/cluster";
import {SignatureResult, TransactionInstruction} from '@solana/web3.js';
import {addressLabel} from "@utils/tx";
import React from 'react';

import {InstructionCard} from './InstructionCard';

export function GasslessDetailsCard({
                                        ix,
                                        index,
                                        result,
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
    const {cluster} = useCluster()
    const programName = addressLabel(ix.programId.toString(), cluster) || "Gasless Program"

    return (
        <InstructionCard
            ix={ix}
            index={index}
            result={result}
            title={`${programName}: Gasless Instruction`}
            innerCards={innerCards}
            childIndex={childIndex}
            defaultRaw
        />
    );
}
