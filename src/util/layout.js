//
// Utility functions for frontend
//


export const getParticipantState = (decision, belief, paid) => { // locked

    //console.log("dec", decision);
    //console.log("bel", belief);
    //console.log("paid", paid);

    return (
        decision > 0 
            ? ParticipantState.APPROVAL_SET // 4
            : belief < 101
            ? ParticipantState.BELIEF_UPDATED // 2
            : paid == true 
            ? ParticipantState.DEPOSIT_SUBMITTED // 
            : ParticipantState.INIT // 0
    );
}

export class ParticipantState {
    // Private Fields
    static #_INIT = 0;
    static #_DEPOSIT_SUBMITTED = 1;
    static #_BELIEF_UPDATED = 2;
    static #_STATUS_LOCKED = 3;
    static #_APPROVAL_SET = 4;
    static #_PAYOUT_RENDERED = 5;
  
    // Accessors for "get" functions only (no "set" functions)
    static get INIT() { return this.#_INIT; }
    static get DEPOSIT_SUBMITTED() { return this.#_DEPOSIT_SUBMITTED; }
    static get BELIEF_UPDATED() { return this.#_BELIEF_UPDATED; }
    static get STATUS_LOCKED() { return this.#_STATUS_LOCKED; }
    static get APPROVAL_SET() { return this.#_APPROVAL_SET; }
    static get PAYOUT_RENDERED() { return this.#_PAYOUT_RENDERED; }
}

export const getNullActionDisplay = () => {
    return false;
}