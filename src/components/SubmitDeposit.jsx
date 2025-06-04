import {
    Button,
    Select,
  } from 'theme-ui'

import {
    LAMPORTS_PER_SOL,
} from '@solana/web3.js';

function SubmitDeposit({ stake, submitDeposit }) {

    const stakeLamports = Number(stake);
    const stakeSol = stakeLamports / LAMPORTS_PER_SOL;

    const handleSubmitDeposit = () => {
        submitDeposit(stake);
    }

    return (
        <div className='flex-column center' style={{gap:'1rem'}}>

            <h2>The stake for this wager is:</h2>
            <h4>{stakeSol} SOL</h4>
            
            <div>
                <Button
                    onClick={handleSubmitDeposit}
                    sx={{cursor:'pointer'}}
                >
                    Submit Stake
                </Button>
            </div>

        </div>
    );
}

export default SubmitDeposit;