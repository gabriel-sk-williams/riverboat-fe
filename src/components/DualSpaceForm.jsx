import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import CreateDualSpace from './CreateDualSpace';
import PercentageField from '../components/PercentageField';
import CurrencyField from '../components/CurrencyField';

import {
    Input,
    Textarea,
    Box,
    Field,
    Button,
    Flex,
    Text,
    Image,
    Label
} from 'theme-ui'

/*
    {
        "stake": 0.1,
        "terms": "Trump switches to Regular Coke in 2025",
        "wallet_a": '7V4wLNxUvejyeZ5Bmr2GpvfBL1mZxzQMhsyR7noiM3uD',
        "belief_a": 0.65,
        "wallet_b": 'BjEUqQuAB4RRAKhMjtXE9r2PfKeTQRqLMbgbhrJkS1Qu',
        "belief_b": 0.88
    }
*/

function DualSpaceForm({ refreshProgramRequest }) {

    const [ stake, setStake ] = useState(0.1);
    const [ walletA, setWalletA ] = useState(import.meta.env.VITE_DONATION_WALLET);
    const [ walletB, setWalletB ] = useState(import.meta.env.VITE_DEV_WALLET_A);
    const [ beliefA, setBeliefA ] = useState(0.0);
    const [ beliefB, setBeliefB ] = useState(0.0);
    const [ terms, setTerms ] = useState('');

    const handleStakeInputChange = (event) => {
        const floatAmount = parseFloat(event.target.value);
        setStake(floatAmount);
    }

    const handleWalletAInputChange = (event) => {
        setWalletA(event.target.value);
    }

    const handleWalletBInputChange = (event) => {
        setWalletB(event.target.value);
    }

    const handleBeliefAInputChange = (event) => {
        const integer = parseInt(event.target.value);
        const belief = integer / 100;
        setBeliefA(belief);
    }

    const handleBeliefBInputChange = (event) => {
        const integer = parseInt(event.target.value);
        const belief = integer / 100;
        setBeliefB(belief);
    }

    const handleTermsInputChange = (event) => {
        setTerms(event.target.value);
    }

    return (

        <Box sx={{mt:'1rem'}}>
            <h2 className="center">Create Wager</h2>

            <div className="flex-container center" style={{marginTop:'1rem'}}>
                <CurrencyField label="Stake" onInputChange={handleStakeInputChange} />
            </div>

            <div className="flex-container">
                <Field 
                    label="Wallet A" 
                    name="walletA" 
                    defaultValue={import.meta.env.VITE_DONATION_WALLET} // temp
                    onChange={handleWalletAInputChange} 
                    sx={{mb:'1rem'}}
                />
                <PercentageField label="Belief A" onInputChange={handleBeliefAInputChange} />
            </div>
            
            <div className="flex-container">
                <Field 
                    label="Wallet B" 
                    name="walletB" 
                    defaultValue={import.meta.env.VITE_DEV_WALLET_A} // temp
                    onChange={handleWalletBInputChange} 
                    sx={{mb:'1rem'}}
                />
                <PercentageField label="Belief B" onInputChange={handleBeliefBInputChange} />

            </div>
            
            <Label htmlFor="textarea">Terms</Label>
            <Textarea
                sx={{
                    height: '10rem',
                    width: '24rem',
                    resize: 'vertical',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    lineHeight: '1.5',
                    fontFamily: 'body',
                }}
                placeholder="Type your terms here..."
                onChange={handleTermsInputChange} 
            />
            <div className='flex-center' style={{marginTop:'1.5rem'}}>
                <CreateDualSpace
                    stake={stake}
                    terms={terms}
                    walletA={walletA}
                    walletB={walletB}
                    beliefA={beliefA}
                    beliefB={beliefB}
                />
            </div>
        </Box>
    )
}

export default DualSpaceForm;