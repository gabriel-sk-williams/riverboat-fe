import { useState, useEffect, useCallback } from 'react';

import {
    Box,
    Button,
    Select,
} from 'theme-ui'

import { ApprovalState, PayoutStatus } from '../util/solana';


function ClaimPayout({ decision, activePlayerWins, payout, claimPayout }) {

    const handleClaimPayout = () => {
        claimPayout();
    }

    const outcome = ApprovalState.getApprovalState(decision);
    const headline = `The Wager's Event has ${outcome}`;
    const stake = 0.1;

    const personalMessage = outcome === ApprovalState.PUSH
        ? `We'll call it a draw. Click to recover ${payout} SOL`
        : activePlayerWins 
        ? `Congratulations, you win ${payout} SOL`
        : `Sorry for your loss. Click to recover ${payout} SOL`;

    return (
        <div className='flex-column center' style={{gap:'1rem'}}>

            <Box sx={{margin:'auto', width:'48rem'}}>
                
                <h3 style={{margin:'0.5rem'}}>{headline}</h3>
                <h4 style={{margin:'0.5rem'}}>{personalMessage}</h4>
                {/*<h3 style={{margin:'0.5rem'}}>{activeCopy}</h3>*/}
            </Box>

            <div>
                <Button
                    onClick={handleClaimPayout}
                    sx={{cursor:'pointer'}}>
                    Claim Payout
                </Button>
            </div>
        </div>

    );
}

export default ClaimPayout;