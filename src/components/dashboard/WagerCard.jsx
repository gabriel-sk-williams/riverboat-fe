import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom'
import '../../styles/main.css'
import '../../styles/type.css'
import '../../styles/flex.css'
import '../../styles/layout.css'
import '../../styles/entry.css'

import {
    Box,
    Button,
    Flex,
    Text,
    Image
} from 'theme-ui'

import Blockie from '../shared/Blockie'

/*
    Example Wager object:
    {
        "account": {
            "data": {
                "type": "Buffer",
                "data": [ 38, 0, 0, 0, ... ]
            },
            "executable": false,
            "lamports": 1740000,
            "owner": "HPQKvAZrphgoifPai59wsYHDRtfd2ESsa4bJPDi9AnK4",
            "rentEpoch": 18446744073709552000,
            "space": 122
        },
        "pubkey": "Gjrp7PJ8LnpRTnHst9iQ5CyySfsXzdtTvMxy1R27Yv6n"
    }
*/

// Component to display a single wager
function WagerCard({ props }) {
    const { account, pubkey } = props;

    //console.log("lamports", account.lamports);
    //console.log("SOL", account.lamports / LAMPORTS_PER_SOL);

    const ds = account.data;

    const beliefA = ds.belief_a > 100 ? "—" : `${ds.belief_a}%`;
    const beliefB = ds.belief_b > 100 ? "—" : `${ds.belief_b}%`;
    
    return (
        <Link to={`/wager/${pubkey}`}>
            <Box sx={{
                padding: '1rem',
                cursor: 'pointer',
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                '&:hover': {
                    outline: `1px solid #c8c8c8`,
                }
            }}>
                <div className='flex-container' style={{height:'3rem', gap:'2rem'}}>
                    <Blockie walletAddress={ds.contract.wallet_a}/>
                    {/*<h5>{beliefA}</h5>*/}
                    <Box sx={{
                        borderRadius: '8px',
                        p:'1rem',
                    }}>
                        <Text sx={{
                            width: '24rem',
                            lineHeight: '1.5em',
                            maxHeight: 'calc(1.5em * 3)+2',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            textAlign: 'left'
                        }}>
                            <h4>
                            {ds.contract.terms}
                            </h4>
                        </Text>
                    </Box>
                    {/*
                    <h5>{beliefB}</h5>
                    <Blockie walletAddress={ds.contract.wallet_b}/>
                    */}
                </div>
            </Box>
        </Link>
    );
}

export default WagerCard;
