import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { WalletButton } from './solana/solana-provider';

import { getAccessToken, usePrivy, useLogin, useConnectWallet, useSolanaWallets } from "@privy-io/react-auth";
import { PrivyWalletButton } from './PrivyWalletButton';

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

/*
function unshiftVariant(array, ...elements) {
  const newArray = new Uint8Array(elements.length + 1);
  newArray.set(elements);
  newArray.set(array, elements.length);
  return newArray;
}

let newArray = unshiftVariant(originalArray, 1, 2);
*/

const DualSpaceSchema = {
  struct: {
    terms: 'string',
    wallet_a: { array: { type: 'u8', len: 32 }},
    belief_a: 'f64',
    wallet_b: { array: { type: 'u8', len: 32 }},
    belief_b: 'f64',
  }
}

function CreateDualSpace({ variant, terms }) {

  const createSpace = async () => {
    try {
      console.log("var", variant);
      console.log("terms", terms);

      const connection = new Connection(clusterApiUrl('devnet'));
      console.log("connection", connection);

      const programId = new PublicKey('7JiTvmnVTBHXisWWiFVpM1Ca8NAjBY2GgUGexL8AWr8q');
      console.log(programId);

      const wa = new PublicKey("HWeDsoC6T9mCfaGKvoF7v6WdZyfEFhU2VaPEMzEjCq3J").toBytes();
      const wb = new PublicKey("7V4wLNxUvejyeZ5Bmr2GpvfBL1mZxzQMhsyR7noiM3uD").toBytes();
      
      const dualSpace = {
        terms: "Trump switches to Regular Coke in 2025",
        wallet_a: wa, // switch to user_account
        belief_a: 0.65,
        wallet_b: wb,
        belief_b: 0.88,
      };

      const serializedData = serialize(DualSpaceSchema, dualSpace);
      // const instructionData = serializedData.unshift(variant); // add variant to beginning
      console.log("serialized", serializedData);

    } catch (error) {
      alert(`create space failed: ${error?.message}`);
    }
  }

  return (
    <div className="item center">
      <button onClick={createSpace}>
        Create Space
      </button>
    </div>
  )
}

export default CreateDualSpace;