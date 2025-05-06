//
// Schema for [de]serialization with borsh
//

export const DualSpaceSchema = {
    struct: {
        terms: 'string',
        wallet_a: { array: { type: 'u8', len: 32 }},
        belief_a: 'f64',
        wallet_b: { array: { type: 'u8', len: 32 }},
        belief_b: 'f64',
    }
}


// test schema pls delet
export const ParagraphSchema = {
    struct: {
      terms: 'string',
    }
}