//
// Schema for [de]serialization with borsh
//

import { serialize, deserialize } from 'borsh';

export const DualSpaceSchema = {
    struct: {
        terms: 'string',
        wallet_a: { array: { type: 'u8', len: 32 }},
        wallet_b: { array: { type: 'u8', len: 32 }},
        belief_a: 'f64',
        belief_b: 'f64',
        stake: 'f64',
    }
}

export const WagerSchema = {
    struct: {
        parlor: DualSpaceSchema,
        wallet_a_decision: 'u8', // ApprovalState as u8
        wallet_b_decision: 'u8',  // ApprovalState as u8
    }
}

export const deserializeDualSpace = (data) => {
    try {
        const buffer = Buffer.from(data);
        const deserializedData = deserialize(DualSpaceSchema, buffer);
        return deserializedData
    } catch (error) {
        console.error("Error decoding space data:", error);
        return { title: "Error decoding data" };
    }
};

export const deserializeWager = (data) => {
    try {
        const buffer = Buffer.from(data);
        const deserializedData = deserialize(WagerSchema, buffer);
        return deserializedData
    } catch (error) {
        console.error("Error decoding wager data:", error);
        return { title: "Error decoding data" };
    }
}