import TransactionsPageClient from './page-client';

export const metadata = {
    description: `Show current transactions on RENEC network`,
    title: `Recent Transactions | RENEC`,
};

export default function TransactionsPage() {
    return (
        <div className="container">
            <TransactionsPageClient />
        </div>
    );
}
