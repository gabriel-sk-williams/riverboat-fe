//
// Schema for [de]serialization with borsh
//

import { serialize, deserialize } from 'borsh';

export const VersusContractSchema = {
    struct: {
        terms: 'string',
        wallet_a: { array: { type: 'u8', len: 32 }},
        wallet_b: { array: { type: 'u8', len: 32 }},
        stake: 'u64',
    }
}

export const VersusWagerSchema = {
    struct: {
        contract: VersusContractSchema,
        decision_a: 'u8', // ApprovalState as u8
        decision_b: 'u8', // ApprovalState as u8
        belief_a: 'u8',
        belief_b: 'u8',
        paid_a: 'bool',
        paid_b: 'bool',
    }
}

export const deserializeVersusContract = (data) => {
    try {
        const buffer = Buffer.from(data);
        const deserializedData = deserialize(VersusContractSchema, buffer);

        console.log(deserializedData);

        return deserializedData
    } catch (error) {
        console.error("Error decoding contract data:", error);
        return { title: "Error decoding data" };
    }
};

export const deserializeWager = (data) => {
    try {
        const buffer = Buffer.from(data);
        const deserializedData = deserialize(VersusWagerSchema, buffer);
        return deserializedData
    } catch (error) {
        console.error("Error decoding wager data:", error);
        return { title: "Error decoding data" };
    }
}