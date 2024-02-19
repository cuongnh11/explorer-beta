import './scss/theme-dark.scss';

import { ClusterModal } from '@components/ClusterModal';
import { ClusterStatusBanner } from '@components/ClusterStatusButton';
import Footer from '@components/Footer';
import { MessageBanner } from '@components/MessageBanner';
import { Navbar } from '@components/Navbar';
import { SearchBar } from '@components/SearchBar';
import { ClusterProvider } from '@providers/cluster';
import { LanguageProvider } from '@providers/language-provider';
import { ScrollAnchorProvider } from '@providers/scroll-anchor';
import { Inter } from 'next/font/google';
import { Metadata } from 'next/types';
import React from 'react';

export const metadata: Metadata = {
    description: 'Inspect transactions, accounts, blocks, and more on the RENEC blockchain',
    manifest: '/manifest.json',
    title: 'Explorer | RENEC',
    viewport: {
        initialScale: 1,
        maximumScale: 1,
        width: 'device-width',
    },
};

const rubikFont = Inter({
    display: 'swap',
    subsets: ['vietnamese'],
    variable: '--explorer-default-font',
    weight: ['300', '400', '700'],
});

export default function RootLayout({
    analytics,
    children,
}: {
    analytics?: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${rubikFont.variable}`}>
            <body>
                <ScrollAnchorProvider>
                    <ClusterProvider>
                        <LanguageProvider>
                            <ClusterModal />
                            <div className="main-content d-flex flex-column">
                                <Navbar />
                                <MessageBanner />
                                <ClusterStatusBanner />
                                <SearchBar />
                                <div className="main-body">{children}</div>
                                <Footer />
                            </div>
                        </LanguageProvider>
                    </ClusterProvider>
                </ScrollAnchorProvider>
                {analytics}
            </body>
        </html>
    );
}
