//
// Utility Functions for interacting with program
//

export class InstructionVariant {
    // Private Fields
    static #_GET = 0;
    static #_CREATE = 1;
    static #_UPDATE = 2;
  
    // Accessors for "get" functions only (no "set" functions)
    static get GET() { return this.#_GET; }
    static get CREATE() { return this.#_CREATE; }
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