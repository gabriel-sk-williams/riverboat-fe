import {
    Button,
    Select,
  } from 'theme-ui'

import { addVariant, InstructionVariant, ApprovalState } from '../util/solana';
import PercentageField from './PercentageField';

function UpdateBelief({ status, active, onSelect, submitUpdate }) {

    const [ belief, setBelief ] = useState(0);

    const handleBeliefInputChange = (event) => {
        const integer = parseInt(event.target.value);
        const belief = integer / 100;
        setBeliefA(belief);
    }

    return (
        <div className='flex' style={{gap:'1rem'}}>

            <PercentageField label="Belief A" onInputChange={handleBeliefInputChange} />

            <Button disabled variant={buttonType}>
                {buttonType}
            </Button>
        </div>
    );
}

export default UpdateBelief;