import ValidatorsPageClient from './page-client';

export const metadata = {
    description: `Show current status of all validators on RENEC network`,
    title: `Validators stats | RENEC`,
};

export default function TransactionsPage() {
    return (
        <div className="container pt-4">
            <ValidatorsPageClient />
        </div>
    );
}
