import { KycCard } from '@components/account/kyc/KycCard';
import getReadableTitleFromAddress, { AddressPageMetadataProps } from '@utils/get-readable-title-from-address';
import { Metadata } from 'next/types';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

export async function generateMetadata(props: AddressPageMetadataProps): Promise<Metadata> {
    return {
        description: `Know Your Customer (KYC) process for the address ${props.params.address} on RENEC`,
        title: `KYC | ${await getReadableTitleFromAddress(props)} | RENEC`,
    };
}

export default function KycPage({ params: { address } }: Props) {
    return <KycCard address={address} />;
}
