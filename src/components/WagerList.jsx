import WagerCard from './WagerCard';

import {
    Box,
    Spinner,
} from 'theme-ui'

import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'
import '../styles/layout.css'

function WagerList({loading, wagers}) {

    if (loading) {
        return (
            <div className='flex-center'>
                <Spinner />
            </div>
        )
    }

    if (!wagers || wagers.length === 0) {
        return <div className="">No wagers found</div>;
    }

    return (
        <Box sx={{mt:'1rem'}}>
            <h2 className="center">Recent Wagers</h2>
            <div className="flex-column">
                <div style={{marginTop:'1rem'}}>
                    {wagers.map((wager) => (
                        <WagerCard 
                            key={typeof wager.pubkey === 'object' ? wager.pubkey.toString() : wager.pubkey}
                            props={wager}
                        />
                    ))}
                </div>
            </div>
        </Box>
    );
}

export default WagerList;