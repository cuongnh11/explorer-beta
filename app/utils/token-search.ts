import { TokenListProvider } from '@renec-foundation/rpl-token-registry';

import { Cluster } from './cluster';

type SearchElement = {
    label: string;
    value: string[];
    pathname: string;
};

export async function searchTokens(search: string, cluster: Cluster): Promise<SearchElement[]> {
    if (process.env.NEXT_PUBLIC_DISABLE_TOKEN_SEARCH || !search) {
        return [];
    }

    // See https://github.com/solflare-wallet/utl-sdk/blob/master/src/types.ts#L5
    let chainId: number;
    if (cluster === Cluster.MainnetBeta) chainId = 101;
    else if (cluster === Cluster.Testnet) chainId = 102;
    else {
        return [];
    }

    const tokens = await new TokenListProvider().resolve();
    const tokenList = tokens.filterByChainId(chainId).getList();

    const searchValue = search.trim().toLocaleLowerCase();
    return tokenList.filter(item => {
        const searchFields = ['name', 'symbol', 'address'];
        return searchFields.some(field => (item as any)[field].toLocaleLowerCase().includes(searchValue) )
    }).map(token => ({
        label: token.name,
        pathname: '/address/' + token.address,
        value: [token.name, token.symbol, token.address],
    }));
}
