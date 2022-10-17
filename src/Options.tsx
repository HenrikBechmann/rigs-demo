
import React, {useState} from 'react'
import {

    Box, 
    Stack,
    VStack,
    HStack,
    FormControl, 
    FormLabel, 
    FormHelperText, 
    Select,   
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Divider,
    Radio,
    RadioGroup,

} from '@chakra-ui/react'


const Options = (props:any) => {

    const [contentType, setContentType] = useState('simple')
    const [orientation, setOrientation] = useState('vertical')

    return <Box>
        <VStack align = 'start' alignItems = 'stretch'>
        <FormControl mb = {3}>
            <FormLabel>Select Content Type</FormLabel>
            <Select 
                size = 'md'
                value = {contentType} 
                onChange = {(event) => {setContentType(event.target.value)}}
            >
                <option value="simple">Simple</option>
                <option value="simplepromises">Simple promises</option>
                <option value="variable">Variable</option>
                <option value="variablepromises">Variable promises</option>
                <option value="variabledynamic">Variable dynamic</option>
                <option value="nested">Nested scrollers</option>
            </Select>
            <FormHelperText>
                Current content will be replaced on Apply
            </FormHelperText>
        </FormControl>
        <FormLabel>More Options</FormLabel>
        <Accordion allowMultiple>
            <AccordionItem>
                <h3>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Properties
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </h3>
                <AccordionPanel pb={4}>
                    <FormControl>
                        <Stack direction = {['column','row','row']}align = 'normal'>
                        <FormLabel size = 'sm'>Orientation</FormLabel>
                        <RadioGroup value = {orientation} onChange = {setOrientation}>
                            <HStack align = 'center'>
                                <Radio value = 'vertical'>Vertical</Radio>
                                <Radio value = 'horizontal'>Horizontal</Radio>
                            </HStack>
                        </RadioGroup>
                        </Stack>
                    </FormControl>

                </AccordionPanel>

            </AccordionItem>
            <AccordionItem>
                <h3>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Callbacks
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </h3>
                <AccordionPanel pb={4}>
                </AccordionPanel>

            </AccordionItem>
            <AccordionItem>
                <h3>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Functions
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </h3>
                <AccordionPanel pb={4}>
                </AccordionPanel>

            </AccordionItem>
        </Accordion>
        </VStack>
    </Box>
}

export default Options