import '../styles/type.css'

import {
    Box,
} from 'theme-ui'


function ErrorBanner({error}) {

    if (!error) {
        return <div/>
    }

    return (
        <Box className="center">
            <h4 style={{color:'red'}}>{error}</h4>
        </Box>
    )
}

export default ErrorBanner;