import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';


import { connection } from './useSolanaConnection';
import { deserializeVersusContract, deserializeWager } from '../util/borsh'


export default function useProgramRequest(programId) {

    const [loading, setLoading] = useState(false); // boolean
    const [status, setStatus] = useState(null); // string || null
    const [accounts, setAccounts] = useState([]); // []Space

    async function getAccounts() {
        try {
            setStatus(null);
            setLoading(true);
            const response = await connection.getProgramAccounts(programId);

            // const accountMap = response.map(obj => obj.pubkey.toBase58());
            // console.log("map", accountMap);
            

            const dsAccounts = response
                .filter(obj => obj.account.data.length > 0 ) // ignore vaults
                .map(obj => ({
                ...obj,
                account: {
                    ...obj.account,
                    data: {
                        ...deserializeWager(obj.account.data),
                        dateCreated: new Date().toLocaleString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })
                    }
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

    return { loading, status, accounts, refresh: getAccounts };
}

/*
previously: 
const dsAccounts = response
    .filter(obj => obj.account.data.length > 0 ) // ignore vaults
    .map(obj => ({
    ...obj,
    account: {
        ...obj.account,
        data: deserializeWager(obj.account.data)
    }
}));
*/