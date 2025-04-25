import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import useSpaceRequest from '../hooks/useSpaceRequest';
import SpaceItem from './SpaceItem';

import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    TransactionInstruction,
    clusterApiUrl,
    sendAndConfirmTransaction,
  } from '@solana/web3.js';
import { serialize } from 'borsh';


function ListSpaces({spaces}) {

    const logDetails = () => {
        console.log("spaces", spaces)
    }

    if (!spaces || spaces.length === 0) {
        return <div className="">No spaces found</div>;
    }

    return (
        <div className="flex-column">
            <div className="">
                {spaces.map((space) => (
                    <SpaceItem 
                        key={typeof space.pubkey === 'object' ? space.pubkey.toString() : space.pubkey}
                        data={space}
                    />
                ))}
            </div>
        </div>
    );
}

export default ListSpaces;