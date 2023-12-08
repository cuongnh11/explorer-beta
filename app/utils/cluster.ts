export enum ClusterStatus {
    Connected,
    Connecting,
    Failure,
}

export enum Cluster {
    MainnetBeta,
    Testnet,
    Custom,
}

export const CLUSTERS = [Cluster.MainnetBeta, Cluster.Testnet, Cluster.Custom];

export function clusterSlug(cluster: Cluster): string {
    switch (cluster) {
        case Cluster.MainnetBeta:
            return 'mainnet-beta';
        case Cluster.Testnet:
            return 'testnet';
        case Cluster.Custom:
            return 'custom';
    }
}

export function clusterName(cluster: Cluster): string {
    switch (cluster) {
        case Cluster.MainnetBeta:
            return 'Mainnet Beta';
        case Cluster.Testnet:
            return 'Testnet';
        case Cluster.Custom:
            return 'Custom';
    }
}

export const MAINNET_BETA_URL = 'https://api-mainnet-beta.renec.foundation:8899';
export const TESTNET_URL = 'https://api-testnet.renec.foundation:8899';

export function clusterUrl(cluster: Cluster, customUrl: string): string {
    switch (cluster) {
        case Cluster.MainnetBeta:
            return process.env.NEXT_PUBLIC_MAINNET_RPC_URL ?? MAINNET_BETA_URL
        case Cluster.Testnet:
            return process.env.NEXT_PUBLIC_TESTNET_RPC_URL ?? TESTNET_URL
        case Cluster.Custom:
            return customUrl;
    }
}

export const DEFAULT_CLUSTER = Cluster.MainnetBeta;
