import {
    Button,
    Select,
  } from 'theme-ui'

import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';

function UpdateDualSpace({ status, active, onSelect, submitUpdate }) {

    const buttonType = ApprovalState.getApprovalState(status);

    const updateStates = ['Pending', 'Landed', 'Missed', 'Push'];
    
    const handleSelect = (e) => {
        const value = e.target.value;
        const index = ApprovalState.getApprovalIndex(value)
        onSelect(index);
    };

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
                        {updateStates.map((status) => (
                            <option key={status} value={status}>
                            {status}
                            </option>
                        ))}
                    </Select>

                    <Button
                        onClick={submitUpdate}
                        sx={{cursor:'pointer'}}>
                        Submit
                    </Button>
                </div>
            )}

        </div>
    );
}

export default UpdateDualSpace;