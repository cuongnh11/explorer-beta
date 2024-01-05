'use client';
import {ErrorCard} from '@components/common/ErrorCard';
import {LoadingCard} from '@components/common/LoadingCard';
import {PublicKey} from '@solana/web3.js';
import React, {useMemo} from 'react';

import {useKycInfo} from '@/app/utils/useKyc';

import {Address} from '../../common/Address';
import {TableCardBody} from '../../common/TableCardBody';

const defaultValue = 'N/A';

export function KycCard({ address }: { address: string }) {
    const { kycInfo, loadingKycInfo, getKycInfo } = useKycInfo(address);

    const country = useMemo(() => {
      if (!kycInfo?.country) return defaultValue;
      const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
      return regionNames.of(kycInfo.country.toUpperCase());
    }, [kycInfo?.country])

    if (!history) {
        return null;
    }

    if (kycInfo === undefined) {
        if (loadingKycInfo) {
            return <LoadingCard message="Loading KYC" />;
        }

        return <ErrorCard retry={getKycInfo} text="Failed to fetch kyc information" />;
    }

    return (
        <div className="card">
            <div className="card-header align-items-center">
                <h3 className="card-header-title">KYC Overview</h3>
            </div>
            <TableCardBody>
                <tr>
                    <td>Name (encrypted)</td>
                    <td className="text-lg-end">
                        {kycInfo.name || defaultValue}
                    </td>
                </tr>
                <tr>
                    <td>Document ID (encrypted)</td>
                    <td className="text-lg-end">{kycInfo.document_id || defaultValue}</td>
                </tr>
                <tr>
                    <td>Date of birth (encrypted)</td>
                    <td className="text-lg-end">{kycInfo.dob || defaultValue}</td>
                </tr>
                <tr>
                    <td>Date of expiry (encrypted)</td>
                    <td className="text-lg-end">{defaultValue}</td>
                </tr>
                <tr>
                    <td>Gender (encrypted)</td>
                    <td className="text-lg-end">{defaultValue}</td>
                </tr>
                <tr>
                    <td>Phone Number (encrypted)</td>
                    <td className="text-lg-end">{kycInfo.phone_number || defaultValue}</td>
                </tr>
                <tr>
                    <td>Country</td>
                    <td className="text-lg-end">{country}</td>
                </tr>
                <tr>
                    <td>KYC Status</td>
                    <td className="text-lg-end"><div className='d-flex justify-content-end align-items-end'>
                      {
                        kycInfo.kyc_level? <div className='badge bg-success-soft'>Verified</div>:<div className='badge bg-warning-soft'>Unverified</div>
                      }
                      <span className='ms-2'>{`KYC level ${kycInfo.kyc_level || 0}`}</span>
                      </div></td>
                </tr>
                <tr>
                    <td>KYC Provider</td>
                    <td className="text-lg-end">{
                      kycInfo.provider? <div className='d-flex justify-content-end align-items-end'>
                        <span className='me-2'>{kycInfo.provider.name}</span>
                        <Address  pubkey={new PublicKey(kycInfo.provider.pubkey)} link truncate truncateChars={8} />
                      </div>: defaultValue
                    }</td>
                </tr>
            </TableCardBody>
        </div>
    );
}
