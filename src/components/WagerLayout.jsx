
import {
    Box,
    Spinner,
    Button,
    Flex,
    Text,
    Image,
    Divider,
} from 'theme-ui'

import {
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
} from '@solana/web3.js';

import Blockie from './shared/Blockie';

import SubmitDeposit from './SubmitDeposit';
import UpdateBelief from './UpdateBelief';
import SetApproval from './SetApproval';
import ClaimPayout from './ClaimPayout';

import ErrorBanner from './ErrorBanner';
import Participant from './Participant';

import { calcRisk, calcReserve, truncate } from '../util/wallet';
import { ApprovalState, PayoutStatus } from '../util/solana';


function WagerLayout({ account, activeWallet, error, submitDeposit, updateBelief, lockSubmission, setApproval, claimPayout }) {

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
    //const pka = truncate(solanaAddressA);
    //const pkb = truncate(solanaAddressB);

    const displayA = belief_a > 100 ? "—" : `${belief_a}%`;
    const displayB = belief_b > 100 ? "—" : `${belief_b}%`;

    const beliefA = belief_a > 100 ? 0.0 : belief_a / 100;
    const beliefB = belief_b > 100 ? 0.0 : belief_b / 100;
    
    const [ riskA, riskB ] = calcRisk(stakeSol, beliefA, beliefB);
    const [ reserveA, reserveB ] = calcReserve(stakeSol, riskA, riskB);

    const activeWalletA = activeWallet?.address == solanaAddressA;
    const activeWalletB = activeWallet?.address == solanaAddressB;

    let [status, belief, decision] = activeWalletA
        ? [status_a, belief_a, decision_a]
        : activeWalletB
        ? [status_b, belief_b, decision_b]
        : [null, null, null];


    let wagerOccurred = decision_a > ApprovalState.PENDING && decision_b > ApprovalState.PENDING;
    let playerOutcomeAgreement = decision_a === decision_b;

    let greaterBeliefA = beliefA > beliefB;

    // greaterBeliefA && LANDED -> player A wins
    // greaterBeliefB && LANDED -> player A loses

    // greaterBeliefA && MISSED -> player B wins
    // greaterBeliefB && MISSED -> player B loses

    let playerAWins = greaterBeliefA && decision === ApprovalState.LANDED || !greaterBeliefA && decision === ApprovalState.MISSED;
    let playerBWins = !greaterBeliefA && decision === ApprovalState.LANDED || greaterBeliefA && decision === ApprovalState.MISSED;

    let activePlayerWins = activeWalletA && playerAWins || activeWalletB && playerBWins;
    let winnerPayout = playerAWins ? parseFloat((riskA + riskB + reserveA).toFixed(5)) : parseFloat((riskA + riskB + reserveB).toFixed(5));
    let loserPayout = playerAWins ? reserveB : reserveA;
    let payout = beliefA == beliefB || decision === ApprovalState.PUSH
        ? stakeSol
        : activePlayerWins 
        ? winnerPayout 
        : loserPayout;

    const widget = status === PayoutStatus.NOT_STAKED 
        ? <SubmitDeposit stake={contract.stake} submitDeposit={submitDeposit} />
        : status === PayoutStatus.STAKED
        ? <UpdateBelief belief={belief} updateBelief={updateBelief} lockSubmission={lockSubmission} />
        : status === PayoutStatus.LOCKED && ( !wagerOccurred || !playerOutcomeAgreement )
        ? <SetApproval decision={decision} setApproval={setApproval} />
        : status >= PayoutStatus.LOCKED && wagerOccurred && playerOutcomeAgreement
        ? <ClaimPayout 
            decision={decision} 
            activePlayerWins={activePlayerWins} 
            payout={payout} 
            claimPayout={claimPayout} 
          />
        : <Divider sx={{color:'#ccc'}}/>

    const activeHeadline = status === PayoutStatus.NOT_STAKED 
        ? "Welcome! Deposit your Stake to Continue:"
        : status === PayoutStatus.STAKED
        ? "Set and Lock your Belief that the Outcome will Land:"
        : status === PayoutStatus.LOCKED && ( !wagerOccurred || !playerOutcomeAgreement )
        ? "What is the Outcome of the Wager?"
        : status >= PayoutStatus.LOCKED && wagerOccurred && playerOutcomeAgreement
        ? "Thank you for playing!"
        : "";
        
        // : status === PayoutStatus.SETTLED 

    const widgetBoxHeight = status == null ? '0rem' : '16rem';

    const date = new Date().toDateString();

    return (
        <Box sx={{my:'2rem'}}>
            <div className='flex-column'>
                <Box sx={{my:'1rem'}}>
                    <h3>{contract.terms}</h3>
                    <h4>Stake: {stakeSol} SOL ({stakeLamports} Lamports)</h4>
                    <h4>{date}</h4>
                </Box>

                <Box sx={{ 
                    mb:'3.5rem',
                    height:widgetBoxHeight,
                    textAlign:'center',
                }}> 

                    <h4>{activeHeadline}</h4>
                    <ErrorBanner error={error} />
                    {widget}
                </Box>

                
                <Box sx={{pt:'2rem'}}>
                    <Participant
                        address={contract.wallet_a}
                        status={status_a}
                        belief={displayA}
                        risk={riskA}
                        decision={decision_a}
                    />
                </Box>

                <Box sx={{pt:'2rem'}}>
                    <Participant
                        address={contract.wallet_b}
                        status={status_b}
                        belief={displayB}
                        risk={riskB}
                        decision={decision_b}
                    />
                </Box>
            </div>
        </Box>
    );
}

export default WagerLayout;