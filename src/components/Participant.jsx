
import {
    Box,
    Spinner,
    Button,
    Flex,
    Text,
    Image,
    Badge,
} from 'theme-ui'

import Blockie from './shared/Blockie';
import { ApprovalState, PayoutStatus } from '../util/solana';

function Participant({address, status, belief, risk, decision}) {

    const paidButton = status >= PayoutStatus.STAKED ? "PAID" : "UNPAID";
    const paidText = status >= PayoutStatus.STAKED ? '#fff' : '#6b6b6b';

    const lockedButton = status >= PayoutStatus.LOCKED ? "LOCKED" : "UNLOCKED";
    const lockedText = status >= PayoutStatus.LOCKED ? '#fff' : '#6b6b6b';

    const approvalButton = ApprovalState.getApprovalState(decision);
    const approvalText = decision > ApprovalState.PENDING ? '#fff' : '#6b6b6b';


    return (
        <div className="flex align-vertical" style={{gap:'2rem'}}>
            <Blockie walletAddress={address} />
            

            <Badge disabled variant={paidButton} sx={{borderRadius:'4px'}}>
                <h4 style={{marginTop:'3px', marginBottom:'0px', color:paidText }}>
                {paidButton}
                </h4>
            </Badge>

            <Badge disabled variant={lockedButton} sx={{borderRadius:'4px'}}>
                <h4 style={{marginTop:'3px', marginBottom:'0px', color:lockedText }}>
                {lockedButton}
                </h4>
            </Badge>

            <Badge disabled variant={approvalButton} sx={{borderRadius:'4px'}}>
                <h4 style={{marginTop:'3px', marginBottom:'0px', color:approvalText }}>
                {approvalButton}
                </h4>
            </Badge>
            
            <div className='flex-column center'>
                <h4 style={{margin:0}}>BELIEF</h4>
                <h5 style={{margin:0}}>{belief}</h5>
            </div>
            <div className='flex-column center'>
                <h4 style={{margin:0}}>RISK</h4>
                <h5 style={{margin:0}}>{risk} SOL</h5>
            </div>

        </div>
    )
}

export default Participant;