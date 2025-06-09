
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
import { PayoutStatus } from '../util/solana';


function WagerLayout({ account, activeWallet, error, submitDeposit, updateBelief, lockSubmission, setApproval }) {

    const { contract, status_a, status_b, belief_a, belief_b, decision_a, decision_b, } = account;

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

    const StatementA = constructSentence(pka, riskA, faveA);
    const StatementB = constructSentence(pkb, riskB, faveB);

    const activeWalletA = activeWallet?.address == solanaAddressA;
    const activeWalletB = activeWallet?.address == solanaAddressB;

    let [status, belief, decision] = activeWalletA
        ? [status_a, belief_a, decision_a]
        : activeWalletB
        ? [status_b, belief_b, decision_b]
        : [false, false, false]

    const widget = status == PayoutStatus.NOT_STAKED 
        ? <SubmitDeposit stake={contract.stake} submitDeposit={submitDeposit} />
        : status == PayoutStatus.STAKED
        ? <UpdateBelief belief={belief} updateBelief={updateBelief} lockSubmission={lockSubmission} />
        : status == PayoutStatus.LOCKED
        ? <SetApproval decision={decision} setApproval={setApproval} />
        : status == PayoutStatus.CLAIMED_PARTIAL
        ? <ClaimPayout /*decision={decision_a} setApproval={setApproval}*/ />
        : status == PayoutStatus.SETTLED 
        ? <DisplayOutcome /*decision={decision_a} setApproval={setApproval}*/ />
        : <div/>

    const activeHeadline = status == PayoutStatus.NOT_STAKED 
        ? "Welcome! Deposit your Stake to Continue:"
        : status == PayoutStatus.STAKED
        ? "Set and Lock your Belief that the Outcome will Land:"
        : status == PayoutStatus.LOCKED
        ? "What is the Outcome of the Wager?"
        : status == PayoutStatus.CLAIMED_PARTIAL
        ? "Update the actual Outcome of the Wager:"
        : status == PayoutStatus.SETTLED 
        ? "The Outcome of the Event has been set:"
        : "Error"

    const date = new Date().toDateString();

    return (
        <Box sx={{my:'2rem'}}>

            <Box sx={{my:'1rem'}}>
                <h1>{contract.terms}</h1>
            </Box>

            <Box sx={{my:'1rem'}}>
                <h4>{stakeSol} SOL ({stakeLamports} Lamports)</h4>
                <h4>{date}</h4>
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
                    status={status_a}
                    belief={displayA}
                    risk={riskA}
                    decision={decision_a}
                />
            </Box>

            <Box sx={{my:'2rem'}}>
                <Participant
                    //activeWallet={activeWallet.address}
                    address={contract.wallet_b}
                    status={status_b}
                    belief={displayB}
                    risk={riskB}
                    decision={decision_b}
                />
            </Box>
        </Box>
    );
}

export default WagerLayout;