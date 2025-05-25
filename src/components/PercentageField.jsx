/** @jsxImportSource theme-ui */
import { Box, Flex, Label, Input } from 'theme-ui';

function PercentageField({ label, onInputChange }) {
    return (
        <Box mb={23}>
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
                <Box sx={{px: 2}}>%</Box>
            </Flex>
        </Box>
    );
}

export default PercentageField;
