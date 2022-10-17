
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
    Input,
    InputGroup,
    InputLeftElement,

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
                <option value="simple">Simple uniform content</option>
                <option value="simplepromises">Simple uniform promises</option>
                <option value="variable">Variable content</option>
                <option value="variablepromises">Variable promises</option>
                <option value="variabledynamic">Variable dynamic</option>
                <option value="nested">Nested uniform scrollers</option>
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
                <VStack>
                    <FormControl>
                        <Stack direction = {['column','row','row']} align = 'normal'>
                        <FormLabel size = 'sm'>Orientation</FormLabel>
                        <RadioGroup value = {orientation} onChange = {setOrientation}>
                            <HStack align = 'center'>
                                <Radio value = 'vertical'>Vertical</Radio>
                                <Radio value = 'horizontal'>Horizontal</Radio>
                            </HStack>
                        </RadioGroup>
                        </Stack>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Padding and gaps</FormLabel>
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>Padding:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>Gaps:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        </HStack>
                        <FormHelperText>
                            Integers. Padding applies to the scroller borders; gaps apply to the space between cells.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Base cell sizes</FormLabel>
                        <FormHelperText>
                           Integers. cellHeight for vertical, and cellWidth for horizontal are exact for 'uniform' layout,
                           maximum for 'variable' layout; 
                           the cross dimension is allocated fractionally.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Minimum cell sizes</FormLabel>
                        <FormHelperText>
                            Integers. These only apply to variable layouts.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Runway size</FormLabel>
                        <FormHelperText>
                            Integer. This is the number of rows out of view at the head and tail of lists. Minimum 1.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Cache settings</FormLabel>
                        <FormHelperText>
                            CacheMax:integer is ignored for 'cradle' cache setting; 
                            very high settings can degrade performance.
                        </FormHelperText>

                    </FormControl>
                </VStack>
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