import { ProofOfAssetsCard } from '@components/account/proof-of-assets/ProofOfAssetsCard';
import getReadableTitleFromAddress, { AddressPageMetadataProps } from '@utils/get-readable-title-from-address';
import { Metadata } from 'next/types';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

export async function generateMetadata(props: AddressPageMetadataProps): Promise<Metadata> {
    return {
        description: `Proof of Assets involving the address ${props.params.address} on RENEC`,
        title: `Proof of Assets | ${await getReadableTitleFromAddress(props)} | RENEC`,
    };
}

export default function ProofOfAssetsPage({ params: { address } }: Props) {
    return <ProofOfAssetsCard address={address} />;
}
