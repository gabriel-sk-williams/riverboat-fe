import { useState, useEffect, useCallback } from 'react';

import {
    Box,
    Button,
    Slider,
  } from 'theme-ui'

import PercentageField from './PercentageField';

function UpdateBelief({ belief, updateBelief }) {

    const defaultBelief = belief == 255 ? 50 : belief;

    const [ currentBelief, setCurrentBelief ] = useState(defaultBelief);

    const handleBeliefInputChange = (event) => {
        const belief = parseInt(event.target.value);
        setCurrentBelief(belief);
    }

    const handleUpdateBelief = () => {
        updateBelief(currentBelief);
    }

    return (
        <div className='flex-column center' style={{gap:'1rem'}}>

            {/*<PercentageField label="Belief" onInputChange={handleBeliefInputChange} />*/}

            <h1>{currentBelief}%</h1>
            <Box sx={{
                margin:'auto',
                width:'28rem'
            }}>
                <Slider
                    defaultValue={defaultBelief}
                    onChange={handleBeliefInputChange}
                />
            </Box>

            <div>
                <Button
                    onClick={handleUpdateBelief}
                    sx={{cursor:'pointer', height:'2rem', my:'1rem'}}
                >
                    Update Belief
                </Button>
            </div>
        </div>
    );
}

export default UpdateBelief;