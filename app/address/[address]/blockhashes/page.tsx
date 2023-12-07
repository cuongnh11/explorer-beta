import RecentBlockhashesPageClient from './page-client';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

export const metadata = {
    description: `Recent blockhashes on RENEC`,
    title: `Recent Blockhashes | RENEC`,
};

export default function RecentBlockhashesPage(props: Props) {
    return <RecentBlockhashesPageClient {...props} />;
}
