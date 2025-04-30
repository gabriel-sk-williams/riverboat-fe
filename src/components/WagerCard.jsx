import React, { useEffect } from 'react';
import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'
import '../styles/layout.css'
import '../styles/entry.css'

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
function WagerCard({ data }) {
    const { account, pubkey } = data;

    console.log(account.data)

    // Helper function to decode the buffer data
    const decodeSpaceData = (buffer) => {
        try {
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
        <div className="wager-card">
            <div>
                {pubkey.toString()}
            </div>
            <div>
                {account.lamports}
            </div>
        </div>
    );
}

export default WagerCard;