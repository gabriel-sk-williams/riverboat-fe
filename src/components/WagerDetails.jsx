
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

import { calcRisk, truncate, constructSentence, getFavorite, getParticipantState } from '../util/wallet';


function WagerDetails({ account, activeWallet, error, submitDeposit, updateBelief, lockSubmission, setApproval }) {

    const { contract, decision_a, decision_b, belief_a, belief_b, paid_a, paid_b } = account;

    if (!account) {
        return <Spinner />
    }

    const stakeLamports = Number(contract.stake);
    const stakeSol = stakeLamports / LAMPORTS_PER_SOL;

    const publicKeyA = new PublicKey(contract.wallet_a);
    const publicKeyB = new PublicKey(contract.wallet_b);

    const solanaAddressA = publicKeyA.toBase58();
    const solanaAddressB = publicKeyB.toBase58();

    const activeButtonA = activeWallet?.address == solanaAddressA;
    const activeButtonB = activeWallet?.address == solanaAddressB;

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

    const participantAState = getParticipantState(activeWallet);
    const participantBState = getParticipantState(activeWallet);

    return (
        <Box sx={{my:'2rem'}}>

            <Box sx={{my:'1rem'}}>
                <h1>{contract.terms}</h1>
            </Box>

            <Box sx={{my:'1rem'}}>
                <div className="flex" style={{gap:'1rem'}}>
                    <h2>Stake: {stakeSol} SOL</h2>
                    <h4>({stakeLamports} Lamports) </h4>
                </div>
            </Box>

            <Box sx={{my:'1rem'}}>
                <h2>{StatementA}</h2>
                <h2>{StatementB}</h2>
            </Box>
            
            {/* Alert for matching activeWallets */}
            {/*<ErrorBanner error={error} />*/}

            <div className="flex align-vertical" style={{gap:'2rem'}}>
                <Blockie walletAddress={contract.wallet_a} />
                <h5>{displayA}</h5>
                <SubmitDeposit stake={contract.stake} paid={paid_a} submitDeposit={submitDeposit} />
                { paid_a &&
                    <UpdateBelief active={activeButtonA} updateBelief={updateBelief} /> 
                }
                {/*<LockSubmission/>*/}
                {/*<SetApproval status={decision_a} active={activeButtonA} setApproval={setApproval} />*/}
            </div>
                
            <div className="flex align-vertical" style={{gap:'2rem'}}>
                <Blockie walletAddress={contract.wallet_b} />
                <h5>{displayB}</h5>
                <SubmitDeposit stake={contract.stake} paid={paid_b} submitDeposit={submitDeposit} />
                { paid_b &&
                    <UpdateBelief active={activeButtonB} updateBelief={updateBelief} />
                }
                {/*<LockSubmission/>*/}
                {/*<SetApproval status={decision_b} active={activeButtonB} setApproval={setApproval} />*/}
            </div>


        </Box>
    );
}

export default WagerDetails;