//
// Utility Functions for interacting with program
//

export class InstructionVariant {
    // Private Fields
    static #_CREATE = 0;
    static #_GET = 1;
    static #_UPDATE = 2;
  
    // Accessors for "get" functions only (no "set" functions)
    static get CREATE() { return this.#_CREATE; }
    static get GET() { return this.#_GET; }
    static get UPDATE() { return this.#_UPDATE; }
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
            return "Pending";
        case this.LANDED:
            return "Landed";
        case this.MISSED:
            return "Missed";
        case this.PUSH:
            return "Push";
        default:
            return "Unknown";
        }
    }
}