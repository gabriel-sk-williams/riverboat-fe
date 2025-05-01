import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import useSpaceRequest from '../hooks/useSpaceRequest';
import SpaceItem from './SpaceItem';
import WagerCard from './WagerCard';

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

import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'
import '../styles/layout.css'


function ListWagers({spaces}) {

    const logDetails = () => {
        console.log("spaces", spaces)
    }

    if (!spaces || spaces.length === 0) {
        return <div className="">No spaces found</div>;
    }

    console.log(spaces)

    return (
        <div className="flex-column">
            <div className="" style={{marginTop:'4rem'}}>
                {spaces.map((space) => (
                    <WagerCard 
                        key={typeof space.pubkey === 'object' ? space.pubkey.toString() : space.pubkey}
                        data={space}
                    />
                ))}
            </div>
        </div>
    );
}

export default ListWagers;