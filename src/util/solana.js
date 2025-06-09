//
// Utility Functions for interacting with program
//

export class InstructionVariant {
    // Private Fields
    static #_GET_WAGER = 0;
    static #_CREATE_WAGER = 1;
    static #_SUBMIT_DEPOSIT = 2;
    static #_UPDATE_BELIEF = 3;
    static #_LOCK_SUBMISSION = 4;
    static #_SET_APPROVAL = 5;
    static #_CLAIM_PAYOUT = 6;
  
    // Accessors for "get" functions only (no "set" functions)
    static get GET_WAGER() { return this.#_GET_WAGER; }
    static get CREATE_WAGER() { return this.#_CREATE_WAGER; }
    static get SUBMIT_DEPOSIT() { return this.#_SUBMIT_DEPOSIT; }
    static get UPDATE_BELIEF() { return this.#_UPDATE_BELIEF; }
    static get LOCK_SUBMISSION() { return this.#_LOCK_SUBMISSION; }
    static get SET_APPROVAL() { return this.#_SET_APPROVAL; }
    static get CLAIM_PAYOUT() { return this.#_CLAIM_PAYOUT; }
}

export const addVariant = (variant, serializedArray) => {
    const variantArray = new Uint8Array([variant]);
    const mergedArray = new Uint8Array(serializedArray.length + 1);
    mergedArray.set(variantArray)
    mergedArray.set(serializedArray, 1); // byteOffset

    return mergedArray
}

export class ApprovalState {

    static #_PENDING = 0;
    static #_LANDED = 1;
    static #_MISSED = 2;
    static #_PUSH = 3;
  
    static get PENDING() { return this.#_PENDING; }
    static get LANDED() { return this.#_LANDED; }
    static get MISSED() { return this.#_MISSED; }
    static get PUSH() { return this.#_PUSH; }

    static getApprovalState(state) {
        switch (state) {
        case this.PENDING:
            return "PENDING";
        case this.LANDED:
            return "LANDED";
        case this.MISSED:
            return "MISSED";
        case this.PUSH:
            return "PUSH";
        default:
            return "Unknown";
        }
    }

    static getApprovalIndex(state) {
        switch (state) {
        case "Pending":
            return this.PENDING;
        case "Landed":
            return this.LANDED;
        case "Missed":
            return this.MISSED;
        case "Push":
            return this.PUSH;
        default:
            return 0;
        }
    }
}

export class PayoutStatus {

    static #_NOT_STAKED = 0;
    static #_STAKED = 1;
    static #_LOCKED = 2;
    static #_CLAIMED_PARTIAL = 3;
    static #_SETTLED = 4;
  
    static get NOT_STAKED() { return this.#_NOT_STAKED; }
    static get STAKED() { return this.#_STAKED; }
    static get LOCKED() { return this.#_LOCKED; }
    static get CLAIMED_PARTIAL() { return this.#_CLAIMED_PARTIAL; }
    static get SETTLED() { return this.#_SETTLED; }
}