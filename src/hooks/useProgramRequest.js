import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


import { connection } from './useSolanaConnection';
import { deserializeDualSpace } from '../util/borsh'


export default function useProgramRequest(programId) {

    const [loading, setLoading] = useState(false); // boolean
    const [status, setStatus] = useState(null); // string || null
    const [accounts, setAccounts] = useState([]); // []Space

    async function getAccounts() {
        try {
            setStatus(null);
            setLoading(true);
            const response = await connection.getProgramAccounts(programId);

            const dsAccounts = response.map(obj => ({
                ...obj,
                account: {
                    ...obj.account,
                    data: deserializeDualSpace(obj.account.data)
                }
            }));
            setAccounts(dsAccounts);
        } catch (error) {
            setLoading(false);
            setStatus(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getAccounts();
    }, []);

    return { loading, status, accounts };
}