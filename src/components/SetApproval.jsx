import {
    Button,
    Select,
} from 'theme-ui'

import { connection } from '../hooks/useSolanaConnection';
import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';

function SetApproval({ status, active }) {

    const buttonType = ApprovalState.getApprovalState(status);

    const [ approval, setApproval ] = useState(0);

    const approvalStates = ['Pending', 'Landed', 'Missed', 'Push'];
    
    const handleSelect = (e) => {
        const value = e.target.value;
        const index = ApprovalState.getApprovalIndex(value)
        setApproval(index);
    };

    const setApprovalState = async () => {
        try {
            const programId = new PublicKey(import.meta.env.VITE_PROGRAM_ADDRESS);

            const userWallet = new PublicKey(activeWallet.address);

            const instructionData = new Uint8Array([InstructionVariant.SET, approval]);

            const pda = new PublicKey(id)

            // Create the instruction
            const instruction = new TransactionInstruction({
                keys: [
                { pubkey: pda, isSigner: false, isWritable: true },
                { pubkey: userWallet, isSigner: true, isWritable: true },
                ],
                programId,
                data: instructionData
            });

            const {
                value: { blockhash, lastValidBlockHeight },
            }  = await connection.getLatestBlockhashAndContext();

            const transaction = new Transaction().add(instruction);
            transaction.feePayer = userWallet;
            transaction.recentBlockhash = blockhash;

            if (signTransaction) {
                const signedTx = await activeWallet.signTransaction(transaction)
                const signature = await connection.sendRawTransaction(signedTx.serialize())
                const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature })
                refreshAccountRequest();
                alert(`Wager Update complete! Transaction signature: ${signature}`);
            }
        
        } catch (error) {
            alert(`update wager failed: ${error?.message}`);
        }
    }

    /*
    <div className="flex align-vertical" style={{gap:'2rem'}}>
        <Blockie walletAddress={contract.wallet_b}/>
        <h5>{beliefB}</h5>
        <UpdateWager 
            status={decision_a} 
            active={activeButtonB} 
            onSelect={setUpdate} 
            submitUpdate={updateStatus}
        />
    </div>
    */

    return (
        <div className='flex' style={{gap:'1rem'}}>
            <Button disabled variant={buttonType}>
                    {buttonType}
            </Button>
            
            { active && ( 
                <div className='flex' style={{gap:'1rem'}}>
                    <Select 
                        defaultValue='Select'
                        onChange={handleSelect}
                        sx={{width:'12rem'}}
                    >
                        {approvalStates.map((status) => (
                            <option key={status} value={status}>
                            {status}
                            </option>
                        ))}
                    </Select>

                    <Button
                        onClick={setApprovalState}
                        sx={{cursor:'pointer'}}>
                        Submit
                    </Button>
                </div>
            )}

        </div>
    );
}

export default SetApproval;