
import { useState } from 'react';

import DropdownSelect from '../shared/DropdownSelect';

import {
    Textarea,
    Box,
    Field,
    Button,
    Label,
    Flex
} from 'theme-ui'

function Filter({items, onFieldChange, onFilterChange}) {

    const [fill, setFill] = useState("");
    
    return(
        <Box sx={{ mb:'1rem' }}>
            <DropdownSelect label={"FILTER BY"} naked={true} items={items} onChange={onFilterChange} />
            <Field 
                defaultValue=""
                onChange={onFieldChange}
                sx={{
                    width: '18rem',
                    fontFamily: 'Space Mono',
                    fontSize: '14px',
                    border: '1px solid #606060',
                }}
            />
            <Flex sx={{gap:'2em'}}>
                <h4>crypto</h4>
                <h4>politics</h4>
                <h4>sports</h4>
                <h4>economy</h4>
                <h4>tech</h4>
                <h4>culture</h4>
            </Flex>
        </Box>
    );
}

export default Filter;