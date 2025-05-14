import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import WagerCard from './WagerCard';

import {
    Box,
    Spinner,
    Button,
    Flex,
    Text,
    Image
} from 'theme-ui'

import '../styles/main.css'
import '../styles/type.css'
import '../styles/flex.css'
import '../styles/layout.css'

function WagerList({ loading, spaces}) {

    if (loading) {
        return (
            <div className='flex-center'>
                <Spinner />
            </div>
        )
    }

    if (!spaces || spaces.length === 0) {
        return <div className="">No spaces found</div>;
    }

    return (
        <Box sx={{mt:'4rem'}}>
            <h2 className="center">Recent Wagers</h2>
            <div className="flex-column">
                <div style={{marginTop:'1rem'}}>
                    {spaces.map((space) => (
                        <WagerCard 
                            key={typeof space.pubkey === 'object' ? space.pubkey.toString() : space.pubkey}
                            props={space}
                        />
                    ))}
                </div>
            </div>
        </Box>
    );
}

export default WagerList;