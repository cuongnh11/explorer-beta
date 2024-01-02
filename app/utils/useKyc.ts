import { useEffect, useState } from 'react';

import { RENEC_HUB_PRODUCTION_URL } from './constants';

export interface KycInfo {
    country: string;
    dob: string;
    document_id: string;
    doe: string;
    gender: string;
    kyc_level: number;
    name: string;
    phone_number: string;
    provider: { pubkey: string; name: string };
}

export function useKycInfo(address: string) {
    const [kycInfo, setKycInfo] = useState<KycInfo>();
    const [loadingKycInfo, setLoadingKycInfo] = useState(true);

    const getKycInfo = async () => {
        try {
            setLoadingKycInfo(true);
            const response = await fetch(
                `
                ${RENEC_HUB_PRODUCTION_URL}/kyc_verifications/kyc_data?wallet_address=${address}`
            );
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text);
            } else {
                const info: KycInfo = await response.json();
                setKycInfo(info);
            }
        } catch (error) {
            setKycInfo(undefined);
            console.log('getKycInfo error:', error);
        } finally {
            setLoadingKycInfo(false);
        }
    };

    useEffect(() => {
        getKycInfo();
    }, [address]);

    return { getKycInfo, kycInfo, loadingKycInfo };
}
