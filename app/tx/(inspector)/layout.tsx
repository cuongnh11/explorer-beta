import { Metadata } from 'next/types';
import React from 'react';

type Props = Readonly<{
    children: React.ReactNode;
    params: Readonly<{
        signature: string;
    }>;
}>;

export async function generateMetadata({ params: { signature } }: Props): Promise<Metadata> {
    if (signature) {
        return {
            description: `Interactively inspect the RENEC transaction with signature ${signature}`,
            title: `Transaction Inspector | ${signature} | RENEC`,
        };
    } else {
        return {
            description: `Interactively inspect RENEC transactions`,
            title: `Transaction Inspector | RENEC`,
        };
    }
}

export default function TransactionInspectorLayout({ children }: Props) {
    return children;
}
