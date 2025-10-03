
import React from 'react';
import { Link } from 'react-router-dom'
import WagerCard from './WagerCard';
import Paginator from './Paginator';
import Blockie from '../shared/Blockie'

import {
    Box,
    Spinner,
    Text,
    Grid,
} from 'theme-ui'

import '../../styles/main.css'
import '../../styles/type.css'
import '../../styles/flex.css'
import '../../styles/layout.css'

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

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    const date = today. getDate();

    const blockieSize ='3rem';

    return (
        <Box sx={{width: '100%', mt:'1rem'}}>
            <Grid
                columns='5rem 1fr auto'
                sx={{
                    px: '1px', // prevents outline cutoff
                    rowGap: '1px'
                }}
            >

                {/* Header */}
                <h4 style={{textAlign: 'center'}}>CREATOR</h4>
                <h4>TITLE</h4>
                <h4>CREATE DATE</h4>

                {/* Mapped Cards */}
                {wagers.map((wager) => {
                    const pubkey = typeof wager.pubkey === 'object' ? wager.pubkey.toString() : wager.pubkey;
                    return (
                        <React.Fragment key={pubkey}>
                            <Link to={`/wager/${pubkey}`} style={{gridColumn: '1 / -1', display: 'contents'}}>
                            <Box sx={{
                                padding: '1rem',
                                cursor: 'pointer',
                                borderRadius: '20px',
                                transition: 'all 0.3s ease',
                                gridColumn: '1 / -1',
                                display: 'grid',
                                gridTemplateColumns: 'subgrid',
                                '&:hover': {
                                    outline: `1px solid #c8c8c8`,
                                }
                            }}>
                                <Blockie walletAddress={wager.account.data.contract.wallet_a} size={blockieSize} />
                                <Box sx={{display: 'flex', height: '100%', alignItems:'center'}}>
                                    <Text sx={{
                                        lineHeight: '1.5em',
                                        maxHeight: 'calc(1.5em * 3)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        textAlign: 'left'
                                    }}>
                                        <h4>{wager.account.data.contract.terms}</h4>
                                    </Text>
                                </Box>
                                <Box sx={{display: 'flex', height: '100%', alignItems:'center'}}>
                                    <h4>{wager.account.data.dateCreated}</h4>
                                </Box>
                            </Box>
                            </Link>
                        </React.Fragment>
                    );
                })}
            </Grid>
            
            <Paginator />
        </Box>
    );
}

export default WagerList;

/*
<div className='flex-container' style={{height:'3rem', gap:'2rem', marginBottom:'0.5rem'}}>
    <div style={{width:'40px'}}>
        <h4>CREATOR</h4>
    </div>
    <div style={{width:'24rem', paddingLeft:'1rem'}}>
        <h4>TITLE</h4>
    </div>
    <div>
        <h4>CREATE DATE</h4>
    </div>
</div>


{wagers.map((wager) => (
    <WagerCard 
        key={typeof wager.pubkey === 'object' ? wager.pubkey.toString() : wager.pubkey}
        props={wager}
    />
))}
*/