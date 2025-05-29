import { useState, useEffect, useCallback } from 'react';

import {
    Button,
    Select,
  } from 'theme-ui'

import PercentageField from './PercentageField';

function UpdateBelief({ active, updateBelief }) {

    const buttonType = "UPDATE"

    const [ belief, setBelief ] = useState(255);

    const handleBeliefInputChange = (event) => {
        const belief = parseInt(event.target.value);
        setBelief(belief);
    }

    const handleUpdateBelief = () => {
        updateBelief(belief);
    }

    if (!active) {
        return <div/>
    }

    return (
        <div className='flex align-vertical' style={{gap:'1rem'}}>
            <PercentageField label="Belief" onInputChange={handleBeliefInputChange} />

            <Button
                onClick={handleUpdateBelief}
                sx={{cursor:'pointer', height: '2rem'}}
            >
                Update
            </Button>
        </div>
    );
}

export default UpdateBelief;