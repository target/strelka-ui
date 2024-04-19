// hooks/useVirusTotalApiKey.js
import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../config';
import { fetchWithTimeout } from '../util';

const useVirusTotalApiKey = () => {
    const [isApiKeyAvailable, setIsApiKeyAvailable] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkApiKey = async () => {
            try {
                const response = await fetchWithTimeout(`${APP_CONFIG.BACKEND_URL}/strelka/check_vt_api_key`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    credentials: 'include'
                }, APP_CONFIG.API_TIMEOUT);  // Using timeout from config
                const data = await response.json();
                setIsApiKeyAvailable(data.apiKeyAvailable);
            } catch (error) {
                console.error('Error checking API key:', error);
                setIsApiKeyAvailable(false);
            }
            setLoading(false);
        };

        checkApiKey();
    }, []);

    return { isApiKeyAvailable, loading };
};

export default useVirusTotalApiKey;
