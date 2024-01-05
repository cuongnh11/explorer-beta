import BlockPageClient from './page-client';

export const metadata = {
    description: `Show current blocks on RENEC network`,
    title: `Recent Blocks | RENEC`,
};

export default function BlocksPage() {
    return (
        <div className="container">
            <BlockPageClient />
        </div>
    );
}
