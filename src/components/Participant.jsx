
import {
    Box,
    Spinner,
    Button,
    Flex,
    Text,
    Image,
} from 'theme-ui'

import Blockie from './Blockie';

function Participant({props}) {




    return (
        <div className="flex align-vertical" style={{gap:'2rem'}}>
            <Blockie walletAddress={contract.wallet_a} />
            <h5>{displayA}</h5>
            <SubmitDeposit stake={contract.stake} paid={paid_a} submitDeposit={submitDeposit} />
            { paid_a &&
                <UpdateBelief active={activeButtonA} updateBelief={updateBelief} /> 
            }
            {/*<LockSubmission/>*/}
            <SetApproval status={decision_a} active={activeButtonA} setApproval={setApproval} />
        </div>
    )
}

export default Participant;