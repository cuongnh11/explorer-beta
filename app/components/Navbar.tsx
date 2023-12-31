'use client';

import Logo from '@img/logos/logo.png';
import {useClusterPath} from '@utils/url';
import Image from 'next/image';
import Link from 'next/link';
import {useSelectedLayoutSegment} from 'next/navigation';
import React from 'react';

import {ClusterStatusButton} from './ClusterStatusButton';

export function Navbar() {
    const [collapse, setCollapse] = React.useState(false);
    const homePath = useClusterPath({pathname: '/'});
    const validatorsPath = useClusterPath({pathname: "/validators"})
    const blocksPath = useClusterPath({pathname: "/blocks"})
    const supplyPath = useClusterPath({pathname: '/supply'});
    const transactionsPath = useClusterPath({pathname: '/transactions'});
    const selectedLayoutSegment = useSelectedLayoutSegment();

    return (
        <nav className="navbar navbar-expand-md navbar-light">
            <div className="container">
                <Link href={homePath}>
                    <Image alt="RENEC Explorer" height={28} src={Logo}/>
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
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === "validators" ? ' active' : ''}`}
                                href={validatorsPath}
                            >
                                Validators
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'transactions' ? ' active' : ''}`}
                                href={transactionsPath}
                            >
                                Transactions
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'blocks' ? ' active' : ''}`}
                                href={blocksPath}
                            >
                                Blocks
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className={`nav-link${selectedLayoutSegment === 'supply' ? ' active' : ''}`}
                                href={supplyPath}
                            >
                                Supply
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="d-none d-md-block">
                    <ClusterStatusButton/>
                </div>
            </div>
        </nav>
    );
}
