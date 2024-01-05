import { PublicKey } from '@solana/web3.js';
import { Cluster } from '@utils/cluster';

import { getTokenInfo } from './token-info';

export type AddressPageMetadataProps = Readonly<{
    params: {
        address: string;
    };
    searchParams: {
        cluster: string;
        customUrl?: string;
    };
}>;

export default async function getReadableTitleFromAddress(props: AddressPageMetadataProps): Promise<string> {
    const {
        params: { address },
        searchParams: { cluster: clusterParam },
    } = props;

    let cluster: Cluster;
    switch (clusterParam) {
        case 'custom':
            cluster = Cluster.Custom;
            break;
        case 'testnet':
            cluster = Cluster.Testnet;
            break;
        default:
            cluster = Cluster.MainnetBeta;
    }

    try {
        const tokenInfo = await getTokenInfo(new PublicKey(address), cluster);
        const tokenName = tokenInfo?.name;
        if (tokenName == null) {
            return address;
        }
        const tokenDisplayAddress = address.slice(0, 2) + '\u2026' + address.slice(-2);
        return `Token | ${tokenName} (${tokenDisplayAddress})`;
    } catch {
        return address;
    }
}
