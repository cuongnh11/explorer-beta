import StakeHistoryPageClient from './page-client';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

export const metadata = {
    description: `Stake history for each epoch on RENEC`,
    title: `Stake History | RENEC`,
};

export default function StakeHistoryPage(props: Props) {
    return <StakeHistoryPageClient {...props} />;
}
