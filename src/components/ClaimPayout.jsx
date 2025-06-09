import { useState, useEffect, useCallback } from 'react';

import {
    Box,
    Button,
    Select,
} from 'theme-ui'

import { ApprovalState, PayoutStatus } from '../util/solana';


function ClaimPayout({ decision_a, decision_b, claimPayout }) {

    const handleClaimPayout = () => {
        claimPayout();
    }

    return (
        <div className='flex-column center' style={{gap:'1rem'}}>

            <Box sx={{margin:'auto', width:'42rem'}}>
                <h5 style={{margin:0}}>{headline}</h5>
                <h5 style={{margin:0}}>{activeCopy}</h5>
            </Box>

            <div>
                <Button
                    onClick={handleClaimPayout}
                    sx={{cursor:'pointer'}}>
                    Claim
                </Button>
            </div>
        </div>

    );
}

export default ClaimPayout;