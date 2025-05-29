import {
    Button,
    Select,
  } from 'theme-ui'

function SubmitDeposit({ stake, paid, submitDeposit }) {

    const buttonType = paid ? "PAID" : "UNPAID";

    const handleSubmitDeposit = () => {
        submitDeposit(stake);
    }

    return (
        <div className='flex' style={{gap:'1rem'}}>

            <Button disabled variant={buttonType}>
                {buttonType}
            </Button>
            
            { !paid && ( 
                <div className='flex' style={{gap:'1rem'}}>
                    <Button
                        onClick={handleSubmitDeposit}
                        sx={{cursor:'pointer'}}
                    >
                        Submit Stake
                    </Button>
                </div>
            )}

        </div>
    );
}

export default SubmitDeposit;