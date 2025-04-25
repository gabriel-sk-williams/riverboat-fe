import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { Connection } from '@solana/web3.js';

import { serialize } from 'borsh';
import { connection } from './useSolanaConnection';


export default function useSpaceRequest(programId) {

    const [loading, setLoading] = useState(false); // boolean
    const [status, setStatus] = useState(null); // string || null
    const [spaces, setSpaces] = useState([]); // []Space

    async function getSpaces() {
        try {
            setStatus(null);
            setLoading(true);
            const response = await connection.getProgramAccounts(programId);
            setSpaces(response);
        } catch (error) {
            setLoading(false);
            setStatus(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getSpaces();
    }, []);

    return { loading, status, spaces };
}