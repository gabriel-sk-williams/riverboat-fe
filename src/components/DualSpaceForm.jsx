import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { serialize } from 'borsh'; // schema.get error on occasion
import { InstructionVariant } from '../util/solana';
import { DualSpaceSchema, ParagraphSchema } from '../util/borsh';

import CreateDualSpace from './CreateDualSpace';
import PercentageField from '../components/PercentageField';

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

function DualSpaceForm() {

    const [ walletA, setWalletA ] = useState(import.meta.env.VITE_DONATION_WALLET);
    const [ walletB, setWalletB ] = useState(import.meta.env.VITE_DEV_WALLET_A);
    const [ beliefA, setBeliefA ] = useState(0.0);
    const [ beliefB, setBeliefB ] = useState(0.0);
    const [ terms, setTerms ] = useState('');

    const handleWalletAInputChange = (event) => {
        setWalletA(event.target.value);
    }

    const handleWalletBInputChange = (event) => {
        setWalletB(event.target.value);
    }

    const handleBeliefAInputChange = (event) => {
        console.log(typeof event.target.value)
        const integer = parseInt(event.target.value);
        const belief = integer / 100;
        setBeliefA(belief);
    }

    const handleBeliefBInputChange = (event) => {
        console.log(typeof event.target.value)
        const integer = parseInt(event.target.value);
        const belief = integer / 100;
        setBeliefB(belief);
    }

    const handleTermsInputChange = (event) => {
        setTerms(event.target.value);
    }

    /*
    {
        "terms": "Trump switches to Regular Coke in 2025",
        "wallet_a": '7V4wLNxUvejyeZ5Bmr2GpvfBL1mZxzQMhsyR7noiM3uD',
        "belief_a": 0.65,
        "wallet_b": 'BjEUqQuAB4RRAKhMjtXE9r2PfKeTQRqLMbgbhrJkS1Qu',
        "belief_b": 0.88
    }
    */

    return (

        <Box sx={{mt:'1rem'}}>
            <h2 className="center">Create Wager</h2>

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
                    terms={terms}
                    walletA={walletA}
                    beliefA={beliefA}
                    walletB={walletB}
                    beliefB={beliefB}
                />
            </div>
        </Box>
    )
}

export default DualSpaceForm;