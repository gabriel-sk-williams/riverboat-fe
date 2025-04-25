import { clusterApiUrl, Connection } from '@solana/web3.js';

const RPC_URL = clusterApiUrl(import.meta.env.VITE_SOLANA_NETWORK);

export const connection = new Connection(RPC_URL, 'confirmed');
