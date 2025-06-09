import { useState, useEffect, useCallback } from 'react';

import {
    Box,
    Button,
    Select,
} from 'theme-ui'

import { ApprovalState, PayoutStatus } from '../util/solana';


function DisplayOutcome({ decision_a, decision_b }) {

    const headline = "";
    const activeCopy = "";

    return (
        <div className='flex-column center' style={{gap:'1rem'}}>

            <Box sx={{margin:'auto', width:'42rem'}}>
                <h5 style={{margin:0}}>{headline}</h5>
                <h5 style={{margin:0}}>{activeCopy}</h5>
            </Box>

        </div>
    );
}

export default DisplayOutcome;