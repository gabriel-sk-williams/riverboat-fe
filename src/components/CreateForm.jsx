import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CreateDualSpace from './CreateDualSpace';
import { serialize } from 'borsh';

import {
    Input,
    Textarea,
    Box,
    Button,
    Flex,
    Text,
    Image
  } from 'theme-ui'

/*
function unshiftVariant(array, ...elements) {
  const newArray = new Uint8Array(elements.length + 1);
  newArray.set(elements);
  newArray.set(array, elements.length);
  return newArray;
}

let newArray = unshiftVariant(originalArray, 1, 2);
*/

const DualSpaceSchema = {
  struct: {
    terms: 'string',
    wallet_a: { array: { type: 'u8', len: 32 }},
    belief_a: 'f64',
    wallet_b: { array: { type: 'u8', len: 32 }},
    belief_b: 'f64',
  }
}

function CreateForm({ variant }) {

    const [ terms, setTerms ] = useState("");

    const handleTermsInputChange = (event) => {
        setTerms(event.target.value);
    }

    const serializeForm = () => {
        const newArray = new Uint8Array(0,1);
        //newArray.set(elements);
        //newArray.set(array, elements.length);

        console.log(newArray)
    }

    return (
        <div className="form margin-auto">
            <div className="item">
            <Textarea
                sx={{
                    height: '150px',
                    resize: 'vertical',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'break-word',
                    lineHeight: '1.5',
                    fontFamily: 'body',
                }}
                placeholder="Type your paragraph here..."
                onChange={handleTermsInputChange} 
            />
            </div>
            <div className="item">
                <button onClick={serializeForm}>seralize</button>
            </div>
            <CreateDualSpace 
                variant={variant}
                terms={terms}
                //space={dualSpace}
            />
        </div>
    )
}

export default CreateForm;