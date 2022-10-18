
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
    Heading,

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
                Current content will be replaced on Apply.
            </FormHelperText>

        </FormControl>

        <Heading as = 'h3' fontSize = 'md'>More Options</Heading>

        <Accordion allowMultiple>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Properties
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}><VStack>

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

                    <FormControl isRequired = {true}>
                        <FormLabel size = 'sm'>Base cell sizes</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellHeight:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellWidth:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                           Integers (pixels), required. cellHeight for vertical, and cellWidth for horizontal are exact for 'uniform' layout,
                           maximum for 'variable' layout; 
                           the cross dimensions are allocated fractionally (fr).
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Minimum cell sizes</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellMinHeight:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellMinWidth:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                            Integers (pixels). These only apply to variable layouts. Minimum 25, default 25.
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Padding and gaps</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>padding:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>gap:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                            Integers (pixels), optional. Padding applies to the scroller borders; gaps apply to the space between cells.
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Runway size</FormLabel>
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>runwaySize:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        </HStack>
                        <FormHelperText>
                            Integer. This is the number of rows out of view at the head and tail of lists. Minimum 1, default 1.
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Cache settings</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <Select flexGrow = {.8} size = 'sm'>
                            <option value="cradle">cradle</option>
                            <option value="keepload">keep load</option>
                            <option value="preload">preload</option>
                        </Select>
                        <InputGroup size = 'sm' flexGrow = {1.2} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cacheMax:</FormLabel>
                            <Input border = '2px' type = 'number' />
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                            CacheMax:integer is ignored for 'cradle' cache setting. 
                            Otherwise, very high settings can degrade performance. CacheMax blank or zero is ignored.
                        </FormHelperText>
                    </FormControl>

                </VStack></AccordionPanel>

            </AccordionItem>

            <AccordionItem>

                <Heading as = 'h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Callbacks
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                </AccordionPanel>

            </AccordionItem>

            <AccordionItem>
                <Heading as = 'h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Functions: snapshots
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                </AccordionPanel>

            </AccordionItem>

            <AccordionItem>
                <Heading as = 'h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Functions: operations
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                </AccordionPanel>

            </AccordionItem>

        </Accordion>
        </VStack>
    </Box>
}

export default Options