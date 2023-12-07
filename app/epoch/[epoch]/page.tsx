import { Metadata } from 'next/types';

import EpochDetailsPageClient from './page-client';

type Props = Readonly<{
    params: {
        epoch: string;
    };
}>;

export async function generateMetadata({ params: { epoch } }: Props): Promise<Metadata> {
    return {
        description: `Summary of ${epoch} on RENEC`,
        title: `Epoch | ${epoch} | RENEC`,
    };
}

export default function EpochDetailsPage(props: Props) {
    return <EpochDetailsPageClient {...props} />;
}
