import SlotHashesPageClient from './page-client';

type Props = Readonly<{
    params: {
        address: string;
    };
}>;

export const metadata = {
    description: `Hashes of each slot on RENEC`,
    title: `Slot Hashes | RENEC`,
};

export default function SlotHashesPage(props: Props) {
    return <SlotHashesPageClient {...props} />;
}
