//
// Utility Functions for interacting with program
//

export class InstructionVariant {
    // Private Fields
    static #_CREATE = 0;
    static #_GET = 1;
  
    // Accessors for "get" functions only (no "set" functions)
    static get CREATE() { return this.#_CREATE; }
    static get GET() { return this.#_GET; }
}

export const addVariant = (variant, serializedArray) => {
    const variantArray = new Uint8Array([variant]);
    const mergedArray = new Uint8Array(serializedArray.length + 1);
    mergedArray.set(variantArray)
    mergedArray.set(serializedArray, 1); // byteOffset

    return mergedArray
}

        