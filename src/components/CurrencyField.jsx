/** @jsxImportSource theme-ui */
import { Box, Flex, Label, Input, Image } from 'theme-ui';

function CurrencyField({ label, onInputChange }) {
    return (
        <Box mb={3}>
            <Label>{label}</Label>
            <Flex
                sx={{
                alignItems: 'center',
                border: '1px solid',
                borderColor: 'muted',
                borderRadius: 4,
                overflow: 'hidden',
                }}
            >
                <Input
                    defaultValue={0}
                    onChange={onInputChange}
                    sx={{
                    border: 'none',
                    width: '3rem', 
                    '&:focus': { outline: 'none' },
                    }}
                />
                <Box sx={{px: 2}}>
                    <Image src='solana_light.png' sx={{pt:1, width:'20px'}}/>
                </Box>
            </Flex>
        </Box>
    );
}

export default CurrencyField;
