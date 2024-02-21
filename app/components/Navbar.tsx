'use client';

import Logo from '@img/logos/logo.png';
import { useLanguage } from '@providers/language-provider';
import { useClusterPath } from '@utils/url';
import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import React from 'react';

import { ClusterStatusButton } from './ClusterStatusButton';
import ToggleLanguage from './ToggleLanguage';

export function Navbar() {
    const [collapse, setCollapse] = React.useState(false);
    const homePath = useClusterPath({ pathname: '/' });
    const validatorsPath = useClusterPath({ pathname: '/validators' });
    const blocksPath = useClusterPath({ pathname: '/blocks' });
    const supplyPath = useClusterPath({ pathname: '/supply' });
    const transactionsPath = useClusterPath({ pathname: '/transactions' });
    const selectedLayoutSegment = useSelectedLayoutSegment();
    const { t } = useLanguage();

    return (
        <nav className="navbar navbar-expand-md navbar-light">
            <div className="container">
                <Link href={homePath}>
                    <Image alt="RENEC Explorer" height={28} src={Logo} />
                </Link>

                <button className="navbar-toggler" type="button" onClick={() => setCollapse(value => !value)}>
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ms-auto me-4 ${collapse ? 'show' : ''}`}>
                    <ul className="navbar-nav me-auto gap-2">
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === null ? ' active' : ''}`}
                                href={homePath}
                            >
                                {t('dashboard')}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'validators' ? ' active' : ''}`}
                                href={validatorsPath}
                            >
                                {t('validators')}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'transactions' ? ' active' : ''}`}
                                href={transactionsPath}
                            >
                                {t('transactions')}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'blocks' ? ' active' : ''}`}
                                href={blocksPath}
                            >
                                {t('blocks')}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'supply' ? ' active' : ''}`}
                                href={supplyPath}
                            >
                                {t('supply')}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <div className="d-md-none d-flex justify-content-start px-3">
                                <ToggleLanguage />
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="d-none d-md-block">
                    <div className="d-flex flex-row">
                        <div className="me-3">
                            <ClusterStatusButton />
                        </div>
                        <ToggleLanguage />
                    </div>
                </div>
            </div>
        </nav>
    );
}
