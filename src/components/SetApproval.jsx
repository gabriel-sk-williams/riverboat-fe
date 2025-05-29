import { useState, useEffect, useCallback } from 'react';

import {
    Button,
    Select,
} from 'theme-ui'

import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';

function SetApproval({ status, active, setApproval }) {

    const buttonType = ApprovalState.getApprovalState(status);

    const [ approvalState, setApprovalState ] = useState(0);

    const approvalStates = ['Pending', 'Landed', 'Missed', 'Push'];
    
    const handleSelect = (e) => {
        const value = e.target.value;
        const index = ApprovalState.getApprovalIndex(value)
        setApprovalState(index);
    };

    const handleSetApproval = () => {
        setApproval(approvalState);
    }

    return (
        <div className='flex' style={{gap:'1rem'}}>
            <Button disabled variant={buttonType}>
                {buttonType}
            </Button>
            
            { active && ( 
                <div className='flex' style={{gap:'1rem'}}>
                    <Select 
                        defaultValue='Select'
                        onChange={handleSelect}
                        sx={{width:'12rem'}}
                    >
                        {approvalStates.map((status) => (
                            <option key={status} value={status}>
                            {status}
                            </option>
                        ))}
                    </Select>

                    <Button
                        onClick={handleSetApproval}
                        sx={{cursor:'pointer'}}>
                        Submit
                    </Button>
                </div>
            )}

        </div>
    );
}

export default SetApproval;