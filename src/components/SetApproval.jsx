import { useState, useEffect, useCallback } from 'react';

import {
    Box,
    Button,
    Select,
} from 'theme-ui'

import { ApprovalState } from '../util/solana';


function SetApproval({ decision, setApproval }) {

    const [ approvalState, setApprovalState ] = useState(decision);

    const approvalStates = ['Pending', 'Landed', 'Missed', 'Push'];

    const approvalCopy = [
        'The event has not yet occurred, or the outcome is still unknown.',
        'The event has occurred, and the predicted outcome has come true.',
        'The event has occurred, but the predicted outcome did not come true.',
        'The event was canceled, rendered invalid, or the participants have agreed to return their funds without a winner.',
    ]

    const headline = ApprovalState.getApprovalState(approvalState);
    const activeCopy = approvalCopy[approvalState];
    
    
    const handleSelect = (e) => {
        const value = e.target.value;
        const index = ApprovalState.getApprovalIndex(value)
        setApprovalState(index);
    };

    const handleSetApproval = () => {
        setApproval(approvalState);
    }

    return (
        <div className='flex-column center' style={{gap:'1rem'}}>

            <Box sx={{margin:'auto', width:'42rem'}}>
                <h5 style={{margin:0}}>{headline}</h5>
                <h5 style={{margin:0}}>{activeCopy}</h5>
            </Box>

            <Box sx={{margin:'auto'}}>
                <Select 
                    defaultValue='Select'
                    onChange={handleSelect}
                    sx={{width:'12rem'}}
                >
                    {approvalStates.map((decision) => (
                        <option key={decision} value={decision}>
                        {decision}
                        </option>
                    ))}
                </Select>
            </Box>
            
            <div>
                <Button
                    onClick={handleSetApproval}
                    sx={{cursor:'pointer'}}>
                    Submit
                </Button>
            </div>
        </div>

    );
}

export default SetApproval;