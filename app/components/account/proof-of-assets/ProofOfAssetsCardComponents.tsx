import Link from 'next/link';
import React from 'react';

import { Copyable } from '../../common/Copyable';

export function ProofOfAssetsCardHeader({ title }: { title: string }) {
    return (
        <div className="card-header align-items-center">
            <h3 className="card-header-title">{title}</h3>
        </div>
    );
}

export function ProofAddress({ address, link }: { address: string; link: string }) {
    const alignRight = false;

    const content = (
        <Copyable text={address} replaceText={alignRight}>
            <span className="font-monospace">
                <Link href={link} target={link.startsWith('http')? '_blank': undefined}>{address}</Link>
            </span>
        </Copyable>
    );

    return (
        <>
            <div className={`d-none d-lg-flex align-items-center ${alignRight ? 'justify-content-end' : ''}`}>
                {content}
            </div>
            <div className="d-flex d-lg-none align-items-center">{content}</div>
        </>
    );
}
