import { TokenHoldersCard } from '@components/account/holders/TokenHoldersCard';
import getReadableTitleFromAddress, { AddressPageMetadataProps } from '@utils/get-readable-title-from-address';
import { Metadata } from 'next/types';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

export async function generateMetadata(props: AddressPageMetadataProps): Promise<Metadata> {
    return {
        description: `History of all token holders involving the address ${props.params.address} on RENEC`,
        title: `Holders | ${await getReadableTitleFromAddress(props)} | RENEC`,
    };
}

export default function TokenHoldersPage({ params: { address } }: Props) {
    return <TokenHoldersCard address={address} />;
}
