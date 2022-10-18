
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
    // Input,
    NumberInput,
    NumberInputField,
    InputGroup,
    InputLeftElement,
    Heading,
    Text,
    Checkbox,
    Code,
    Button,
    Switch,

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
                            <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellWidth:</FormLabel>
                            <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                           Integers (pixels), required. <Code>cellHeight</Code> for vertical, and 
                           <Code>cellWidth</Code> for horizontal are exact for 'uniform' layout, maximum for 
                           'variable' layout; the cross dimensions are allocated fractionally (<Code>fr</Code>).
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Minimum cell sizes</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellMinHeight:</FormLabel>
                            <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellMinWidth:</FormLabel>
                            <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
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
                            <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>gap:</FormLabel>
                            <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                            Integers (pixels), optional. Padding applies to the scroller borders; gaps apply to 
                            the space between cells.
                        </FormHelperText>
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Runway size</FormLabel>
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>runwaySize:</FormLabel>
                            <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        </HStack>
                        <FormHelperText>
                            Integer. This is the number of rows out of view at the head and tail of lists. 
                            Minimum 1, default 1.
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
                            <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                            <Code>cacheMax</Code>:integer is ignored for 'cradle' cache setting. 
                            Otherwise, very high settings can degrade performance. <Code>cacheMax</Code> blank 
                            or zero is ignored.
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
                    <Text mb = {2}>
                        On a desktop, these callbacks, when checked, will stream information about the scroller 
                        behaviour to the browser console. In an application the data can be used to enhance the 
                        user experience.
                    </Text>
                    <VStack>
                    <FormControl borderTop = '1px'>
                        <Checkbox size = 'sm'>Reference index</Checkbox>
                        <FormHelperText>
                            This reports the first index of the tail grid, near the top or left of the viewport.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox size = 'sm'>Preload Index</Checkbox>
                        <FormHelperText>
                            This reports a stream of index numbers being preloaded.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox size = 'sm'>Item Exceptions</Checkbox>
                        <FormHelperText>
                            This reports details of a failed <Code>getItem</Code> call.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox size = 'sm'>isRepositioning Notification</Checkbox>
                        <FormHelperText>
                            Alerts the beginning (<Code>true</Code>) or end (<Code>false</Code>) of a rapid 
                            repositioning session.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox size = 'sm'>Repositioning Index</Checkbox>
                        <FormHelperText>
                            During rapid repositioning mode, this streams the virtual location of the scroller.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox size = 'sm'>Listsize change</Checkbox>
                        <FormHelperText>
                            Reports change to list size for any standard reason.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox size = 'sm'>Deleted List</Checkbox>
                        <FormHelperText>
                            Gives lists of indexes removed from the cache for any standard reason, such as going out
                            of scope.
                        </FormHelperText>
                    </FormControl>
                    </VStack>
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
                    <Text mb = {2}>
                        Snapshots provide an on-demand view of what's in the cache and the cradle. Press the 
                        buttons below to see these lists printed to the browser console. An application can
                        use this data to verify and control cache management changes for drag-n-drop, sorting, 
                        and filtering.
                    </Text>
                <VStack>
                <FormControl borderTop = '1px'>
                    <Button size = 'sm'>Get Cache Index Map</Button>
                    <FormHelperText>
                        snapshot (javascript <Code>Map</Code>) of cache <Code>index</Code> (=key) to 
                        scroller-assigned session <Code>itemID</Code> (=value) map.
                    </FormHelperText>
                </FormControl>
                <FormControl borderTop = '1px'>
                    <Button size = 'sm'>Get Cache Item Map</Button>
                    <FormHelperText>
                        snapshot (javascript <Code>Map</Code>) of cache <Code>itemID</Code> (=key) to 
                        object (=value) map. Object = {"{"}index, component{"}"} where component = user component.
                    </FormHelperText>
                </FormControl>
                <FormControl borderTop = '1px'>
                    <Button size = 'sm'>Get Cradle Index Map</Button>
                    <FormHelperText>
                        snapshot (javascript <Code>Map</Code>) of cradle <Code>index</Code> (=key) to 
                        scroller-assigned session <Code>itemID</Code> (=value) map.
                    </FormHelperText>
                </FormControl>
                </VStack>
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
                    <Text mb = {2}>
                        Perform these functions one at a time. Enable the function of choice, then hit the Appply
                        button.
                    </Text>
                    <VStack>
                    <FormControl>
                        <FormLabel size = 'sm'>Go to</FormLabel>
                        <HStack>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>index:</FormLabel>
                                <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                            </InputGroup>
                        </HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='goto' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch id='goto' />
                        </InputGroup>
                        <FormHelperText>
                            Integer. Go to the specified index number in the virtual list.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Change virtual list size</FormLabel>
                        <HStack>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>size:</FormLabel>
                                <NumberInput size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                            </InputGroup>
                        </HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='listsize' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch id='listsize' />
                        </InputGroup>
                        <FormHelperText>
                            Integer. Change the size of the scroller's virtual list.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Reload the cradle</FormLabel>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='reload' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch id='reload' />
                        </InputGroup>
                        <FormHelperText>
                            This clears the cache reloads the cradle at its current position.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Clear the cradle</FormLabel>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='clearcache' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch id='clearcache' />
                        </InputGroup>
                        <FormHelperText>
                            This clears the cache (and therefore the cradle).
                        </FormHelperText>
                    </FormControl>
                    </VStack>
                </AccordionPanel>

            </AccordionItem>

        </Accordion>
        </VStack>
    </Box>
}

export default Options