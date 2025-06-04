
import {
    Box,
    Spinner,
    Button,
    Flex,
    Text,
    Image,
} from 'theme-ui'

import {
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';

import Blockie from './Blockie';

import SubmitDeposit from './SubmitDeposit';
import UpdateBelief from './UpdateBelief';
import SetApproval from './SetApproval';
import ErrorBanner from './ErrorBanner';
import Participant from './Participant';

import { calcRisk, truncate, constructSentence, getFavorite } from '../util/wallet';
import { ParticipantState, getParticipantState, getNullActionDisplay } from '../util/layout';


function WagerLayout({ account, activeWallet, error, submitDeposit, updateBelief, lockSubmission, setApproval }) {

    const { contract, decision_a, decision_b, belief_a, belief_b, paid_a, paid_b } = account;

    if (!account) {
        return (
            <div className="flex-center">
                <Spinner />
            </div>
        );
    }

    const stakeLamports = Number(contract.stake);
    const stakeSol = stakeLamports / LAMPORTS_PER_SOL;

    const publicKeyA = new PublicKey(contract.wallet_a);
    const publicKeyB = new PublicKey(contract.wallet_b);

    const solanaAddressA = publicKeyA.toBase58();
    const solanaAddressB = publicKeyB.toBase58();

    const activeButtonA = activeWallet?.address == solanaAddressA;
    const activeButtonB = activeWallet?.address == solanaAddressB;

    //const pkActive = activeWallet?.address;
    //const pkv = truncate(pkActive);

    const pka = truncate(solanaAddressA);
    const pkb = truncate(solanaAddressB);

    const displayA = belief_a > 100 ? "—" : `${belief_a}%`;
    const displayB = belief_b > 100 ? "—" : `${belief_b}%`;

    const beliefA = belief_a > 100 ? 0.0 : belief_a / 100;
    const beliefB = belief_b > 100 ? 0.0 : belief_b / 100;
    
    const [ riskA, riskB ] = calcRisk(stakeSol, beliefA, beliefB);
    const [ faveA, faveB ] = getFavorite(beliefA, beliefA);

    const lockedA = false;
    const lockedB = false;

    const StatementA = constructSentence(pka, riskA, faveA);
    const StatementB = constructSentence(pkb, riskB, faveB);

    // If activeWallet matches a wallet in the wager, show next action
    const display = activeWallet?.address == solanaAddressA
        ? getParticipantState(decision_a, belief_a, paid_a)
        : activeWallet?.address == solanaAddressB
        ? getParticipantState(decision_b, belief_b, paid_b)
        : getNullActionDisplay();

    // const display = ParticipantState.BELIEF_UPDATED;

    const widget = display == ParticipantState.INIT 
        ? <SubmitDeposit stake={contract.stake} submitDeposit={submitDeposit} />
        : display == ParticipantState.DEPOSIT_SUBMITTED
        ? <UpdateBelief belief={belief_a} updateBelief={updateBelief} />
        : display == ParticipantState.BELIEF_UPDATED
        ? <UpdateBelief belief={belief_a} updateBelief={updateBelief} />
        : display == ParticipantState.STATUS_LOCKED
        ? <SetApproval decision={decision_a} setApproval={setApproval} />
        : display == ParticipantState.APPROVAL_SET 
        ? <SetApproval decision={decision_a} setApproval={setApproval} />
        : <div/>

    const activeHeadline = display == ParticipantState.INIT 
        ? "Welcome!"
        : display == ParticipantState.DEPOSIT_SUBMITTED
        ? "Set your Belief that the Outcome will Land:"
        : display == ParticipantState.BELIEF_UPDATED
        ? "Lock your Belief:"
        : display == ParticipantState.STATUS_LOCKED
        ? "Update the actual Outcome of the Wager:"
        : display == ParticipantState.APPROVAL_SET 
        ? "The Outcome of the Event has been set:"
        : "Error"

    const date = "99 January 1999"

    return (
        <Box sx={{my:'2rem'}}>

            <Box sx={{my:'1rem'}}>
                <h1>{contract.terms}</h1>
            </Box>

            <Box sx={{my:'1rem'}}>
                <h4>Stake: {stakeSol} SOL ({stakeLamports} Lamports)</h4>
                <h4>Created: {date}</h4>
            </Box>

            <Box sx={{ 
                my:'6rem', 
                height:'16rem',
                textAlign:'center',
            }}> 

                {/*<h4>{pkv}</h4>*/}
                <h4>{activeHeadline}</h4>

                {/* Alert for matching activeWallets */}
                <ErrorBanner error={error} />


                {widget}
            </Box>

            
            
            <Box sx={{my:'2rem'}}>
                <Participant
                    //activeWallet={activeWallet.address}
                    address={contract.wallet_a}
                    paid={paid_a}
                    belief={displayA}
                    risk={riskA}
                    locked={lockedA}
                    decision={decision_a}
                />
            </Box>

            <Box sx={{my:'2rem'}}>
                <Participant
                    //activeWallet={activeWallet.address}
                    address={contract.wallet_b}
                    paid={paid_b}
                    belief={displayB}
                    risk={riskB}
                    locked={lockedB}
                    decision={decision_b}
                />
            </Box>
        </Box>
    );
}

export default WagerLayout;

{/*
    <Box sx={{my:'1rem'}}>
        <h2>{StatementA}</h2>
        <h2>{StatementB}</h2>
    </Box>
    */}

/*
    <SubmitDeposit stake={contract.stake} paid={paid_a} submitDeposit={submitDeposit} />
    { paid_a &&
        <UpdateBelief active={activeButtonA} updateBelief={updateBelief} /> 
    }
    <LockSubmission/>
    <SetApproval status={decision_a} active={activeButtonA} setApproval={setApproval} />
*/