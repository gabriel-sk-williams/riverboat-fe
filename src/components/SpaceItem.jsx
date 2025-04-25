import React, { useEffect } from 'react';

/*
Example Space object:
{
    "account": {
      "data": {
        "type": "Buffer",
        "data": [ 38, 0, 0, 0 ]
      },
      "executable": false,
      "lamports": 1740000,
      "owner": "HPQKvAZrphgoifPai59wsYHDRtfd2ESsa4bJPDi9AnK4",
      "rentEpoch": 18446744073709552000,
      "space": 122
    },
    "pubkey": "Gjrp7PJ8LnpRTnHst9iQ5CyySfsXzdtTvMxy1R27Yv6n"
}
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

import { serialize, deserialize } from 'borsh';

// Component to display a single space
function SpaceItem({ data }) {
    const { account, pubkey } = data;

    console.log(account.data)

    
    // Helper function to decode the buffer data
    const decodeSpaceData = (buffer) => {
        try {
            //const titleLength = buffer.readUInt32LE(0);
            //const title = buffer.slice(4, 4 + titleLength).toString('utf8');
            //return { title };
            //const buffer = Buffer.from(account.data.data);
            const deserializedData = deserialize(DualSpaceSchema, buffer);
            console.log("dd", deserializedData)
        } catch (error) {
            console.error("Error decoding space data:", error);
            return { title: "Error decoding data" };
        }
    };
    
    // Parse the data
    const bufferData = Buffer.from(account.data);
    decodeSpaceData(bufferData);
    

    return (
        <div>
            <div>
                {pubkey.toString()}
            </div>
            <div>
                {account.lamports}
            </div>
        </div>
    );

    /*
    return (
        <div className="p-4 border rounded-lg mb-4 shadow-sm">
            <h3 className="text-lg font-medium">{title}</h3>
            <div className="mt-2 text-sm text-gray-500">
                <p>Public Key: {pubkey.toString()}</p>
                <p>Lamports: {account.lamports}</p>
                <p>Owner: {typeof account.owner === 'object' ? account.owner.toString() : account.owner}</p>
                <p>Space Size: {account.space} bytes</p>
            </div>
        </div>
    );
    */
}

export default SpaceItem;