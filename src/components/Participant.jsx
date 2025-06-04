
import {
    Box,
    Spinner,
    Button,
    Flex,
    Text,
    Image,
    Badge,
} from 'theme-ui'

import Blockie from './Blockie';
import { ApprovalState } from '../util/solana';

function Participant({address, paid, belief, risk, locked, decision}) {

    const paidButton = paid ? "PAID" : "UNPAID";

    const approvalButton = ApprovalState.getApprovalState(decision);

    const lockedButton = locked ? "LOCKED" : "UNLOCKED";


    return (
        <div className="flex align-vertical" style={{gap:'2rem'}}>
            <Blockie walletAddress={address} />
            

            <Badge disabled variant={paidButton}>
                <h4 style={{marginTop:'3px', marginBottom:'0px'}}>
                {paidButton}
                </h4>
            </Badge>

            <Badge disabled variant={lockedButton}>
                <h4 style={{marginTop:'3px', marginBottom:'0px'}}>
                {lockedButton}
                </h4>
            </Badge>

            <Badge disabled variant={approvalButton}>
                <h4 style={{marginTop:'3px', marginBottom:'0px'}}>
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