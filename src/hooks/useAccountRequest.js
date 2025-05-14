import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { connection } from './useSolanaConnection';
import { deserializeWager } from '../util/borsh';


export default function useAccountRequest(pda) {

    const [loading, setLoading] = useState(false); // boolean
    const [status, setStatus] = useState(null); // string || null
    const [account, setAccount] = useState(false); // {}

    async function getAccount() {
        try {
            setStatus(null);
            setLoading(true);
            const response = await connection.getAccountInfo(pda);
            const wagerAccount = deserializeWager(response.data)
            setAccount(wagerAccount);
        } catch (error) {
            setLoading(false);
            setStatus(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAccount();
    }, []);

    return { loading, status, account, refresh: getAccount };
}