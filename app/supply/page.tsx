import SupplyPageClient from './page-client';

export const metadata = {
    description: `Overview of the native token supply on RENEC`,
    title: `Supply Overview | RENEC`,
};

export default function SupplyPage() {
    return <SupplyPageClient />;
}
