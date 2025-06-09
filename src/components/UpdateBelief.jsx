import { useState, useEffect, useCallback } from 'react';

import {
    Box,
    Button,
    Slider,
  } from 'theme-ui'

import PercentageField from './PercentageField';
import { HiMiniLockClosed, HiMiniLockOpen } from "react-icons/hi2";


function UpdateBelief({ belief, updateBelief, lockSubmission }) {

    const defaultBelief = belief == 255 ? 50 : belief;
    const hasBelief = belief <= 100;

    const [ currentBelief, setCurrentBelief ] = useState(defaultBelief);
    const [ showLocked, setShowLocked ] = useState(false);

    const handleBeliefInputChange = (event) => {
        const belief = parseInt(event.target.value);
        setCurrentBelief(belief);
    }

    const handleUpdateBelief = () => {
        updateBelief(currentBelief);
    }

    const handleLockUpdate = () => {
        setShowLocked(!showLocked);

        if (!showLocked) {
            setCurrentBelief(belief);
        }
    }

    const handleLockSubmission = () => {
        lockSubmission();
    }

    return (
        <div className='flex-column center' style={{gap:'1rem'}}>

            {/*<PercentageField label="Belief" onInputChange={handleBeliefInputChange} />*/}

            <h1>{currentBelief}%</h1>
            <Box sx={{
                margin:'auto',
                width:'28rem',
                height:'1rem',
            }}>

                <Slider
                    defaultValue={defaultBelief}
                    onChange={handleBeliefInputChange}
                    variant={showLocked ? 'muted' : 'slider'}
                    disabled={showLocked}
                />
            </Box>

            <div className="flex-center" style={{gap:'1rem'}}>
                { showLocked ? (
                    <Button onClick={handleLockSubmission} sx={{cursor:'pointer', height:'2rem', my:'1rem'}}>
                        Lock Submission
                    </Button>
                ) : (
                    <Button onClick={handleUpdateBelief} sx={{cursor:'pointer', height:'2rem', my:'1rem'}}>
                        Update Belief
                    </Button>
                )
                }
                
                { showLocked ? (
                    <HiMiniLockClosed
                        onClick={handleLockUpdate}
                        style={{cursor:'pointer', height:'24px', width:'24px', marginTop:'1.25rem'}}
                    />
                ) : (
                   <HiMiniLockOpen
                    onClick={handleLockUpdate}
                    style={{cursor:'pointer', height:'24px', width:'24px', marginTop:'1.25rem'}}
                /> 
                )
                }

            </div>

            
        </div>
    );
}

{/*
<Button onClick={lockSubmission} sx={{cursor:'pointer', height:'2rem', my:'1rem'}}>
    Lock
</Button>
*/}

export default UpdateBelief;