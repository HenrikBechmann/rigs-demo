
import React, {useState, useRef} from 'react'
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
    Radio,
    RadioGroup,
    NumberInput,
    NumberInputField,
    InputGroup,
    Heading,
    Text,
    Checkbox,
    Code,
    Button,
    Switch,

} from '@chakra-ui/react'

type FunctionSettings = { 
    [prop:string]:boolean // allows iteration
}

type CellSizes = {
    cellHeight:number,
    cellWidth:number
}

type MinCellSizes = {
    minCellHeight:number | undefined,
    minCellWidth:number | undefined
}

type PaddingAndGap = {
    padding:number | undefined,
    gap:number | undefined
}

type CacheSettings = {
    cache:string,
    cacheMax:number | undefined
}

type CallbackSettings = {
    referenceIndexCallback:boolean,
    repositioningIndexCallback:boolean,
    preloadIndexCallback:boolean,
    itemExceptionCallback:boolean,
    changeListsizeCallback:boolean,
    deleteListCallback:boolean,
    repositioningFlagCallback:boolean,
}

type RangeIndexes = {
    from:number,
    range: number | undefined,
}

type MoveIndexes = {
    from:number,
    range: number | undefined,
    to:number,
}

const Options = (props:any) => {

    const [contentType, setContentType] = useState('simple')
    const [orientation, setOrientation] = useState('vertical')
    const [cellSizes, setCellSizes] = useState<CellSizes>({cellHeight:0,cellWidth:0})
    const [minCellSizes, setMinCellSizes] = useState<MinCellSizes>({minCellHeight:undefined, minCellWidth:undefined})
    const [paddingAndGap, setPaddingAndGap] = useState<PaddingAndGap>({padding:undefined, gap:undefined})
    const [runwaySize, setRunwaySize] = useState<number | undefined>(undefined)
    const [cacheSettings, setCacheSettings] = useState<CacheSettings>({cache:'cradle',cacheMax:undefined})
    const [callbackSettings, setCallbackSettings] = useState<CallbackSettings>(
        {
            referenceIndexCallback:false,
            repositioningIndexCallback:false,
            preloadIndexCallback:false,
            itemExceptionCallback:false,
            changeListsizeCallback:false,
            deleteListCallback:false,
            repositioningFlagCallback:false,
        }
    )
    const [operationFunction, setOperationFunction] = useState<string | null>(null)
    const [gotoIndex, setGotoIndex] = useState<number | undefined>(undefined)
    const [listsizeIndex, setListsizeIndex] = useState<number | undefined>(undefined)
    const [insertIndexes, setInsertIndexes] = useState<RangeIndexes>({from:0,range:undefined})
    const [removeIndexes, setRemoveIndexes] = useState<RangeIndexes>({from:0, range: undefined})
    const [moveIndexes, setMoveIndexes] = useState<MoveIndexes>({from:0, range: undefined, to:0})
    const [remapDemo, setRemapDemo] = useState<string>('backwardsort')

    const functionSettingsRef = useRef<FunctionSettings>({
        goto:false,
        listsize:false,
        reload:false,
        insert:false,
        remove:false,
        move:false,
        remap:false,
        clear:false,
    })

    const onChangeEnabler = (event:React.ChangeEvent) => {
        const target = event.target as HTMLInputElement
        const enablerID = target.id
        const enablerValue = target.checked
        const functionSettings = functionSettingsRef.current
        for (const prop in functionSettings) {
            functionSettings[prop] = false
        }
        functionSettings[enablerID] = enablerValue
        const opfunc = 
            enablerValue?
            enablerID:
            null
        setOperationFunction(opfunc)
    }

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
                            <NumberInput value = {cellSizes.cellHeight} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellWidth:</FormLabel>
                            <NumberInput value = {cellSizes.cellWidth} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
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
                            <NumberInput value = {minCellSizes.minCellHeight} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellMinWidth:</FormLabel>
                            <NumberInput value = {minCellSizes.minCellWidth} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
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
                            <NumberInput value = {paddingAndGap.padding} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>gap:</FormLabel>
                            <NumberInput value = {paddingAndGap.gap} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
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
                            <NumberInput value = {runwaySize} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
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
                        <Select value = {cacheSettings.cache} flexGrow = {.8} size = 'sm'>
                            <option value="cradle">cradle</option>
                            <option value="keepload">keep load</option>
                            <option value="preload">preload</option>
                        </Select>
                        <InputGroup size = 'sm' flexGrow = {1.2} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cacheMax:</FormLabel>
                            <NumberInput value = {cacheSettings.cacheMax} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
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
                        <Checkbox isChecked = {callbackSettings.referenceIndexCallback} size = 'sm'>Reference index</Checkbox>
                        <FormHelperText>
                            This reports the first index of the tail grid, near the top or left of the viewport.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox isChecked = {callbackSettings.preloadIndexCallback} size = 'sm'>Preload Index</Checkbox>
                        <FormHelperText>
                            This reports a stream of index numbers being preloaded.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox isChecked = {callbackSettings.itemExceptionCallback} size = 'sm'>Item Exceptions</Checkbox>
                        <FormHelperText>
                            This reports details of a failed <Code>getItem</Code> call.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox isChecked = {callbackSettings.repositioningFlagCallback} size = 'sm'>isRepositioning Notification</Checkbox>
                        <FormHelperText>
                            Alerts the beginning (<Code>true</Code>) or end (<Code>false</Code>) of a rapid 
                            repositioning session.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox isChecked = {callbackSettings.repositioningIndexCallback} size = 'sm'>Repositioning Index</Checkbox>
                        <FormHelperText>
                            During rapid repositioning mode, this streams the virtual location of the scroller.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox isChecked = {callbackSettings.changeListsizeCallback} size = 'sm'>Listsize change</Checkbox>
                        <FormHelperText>
                            Reports change to list size for any standard reason.
                        </FormHelperText>
                    </FormControl>
                    <FormControl borderTop = '1px'>
                        <Checkbox isChecked = {callbackSettings.deleteListCallback} size = 'sm'>Deleted List</Checkbox>
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
                        Perform these functions one at a time. Enable the function of choice, then hit the Apply
                        button. Most of these functions provide feedback in the browser console. The feedback can 
                        be used by apps.
                    </Text>
                    <VStack>
                    <FormControl>
                        <FormLabel size = 'sm'>Go to</FormLabel>
                        <HStack>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>index:</FormLabel>
                                <NumberInput value = {gotoIndex} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                            </InputGroup>
                        </HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='goto' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch 
                                isChecked = {functionSettingsRef.current.goto} 
                                onChange = {onChangeEnabler} 
                                id='goto' 
                            />
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
                                <NumberInput value = {listsizeIndex} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                            </InputGroup>
                        </HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='listsize' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch 
                                isChecked = {functionSettingsRef.current.listsize} 
                                onChange = {onChangeEnabler} 
                                id='listsize' 
                            />
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
                            <Switch 
                                isChecked = {functionSettingsRef.current.reload} 
                                onChange = {onChangeEnabler} 
                                id='reload' 
                            />
                        </InputGroup>
                        <FormHelperText>
                            This clears the cache reloads the cradle at its current position.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Insert indexes</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>from:</FormLabel>
                            <NumberInput value = {insertIndexes.from} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>range:</FormLabel>
                            <NumberInput value = {insertIndexes.range} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        </Stack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='insert' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch 
                                isChecked = {functionSettingsRef.current.insert} 
                                onChange = {onChangeEnabler} 
                                id='insert' 
                            />
                        </InputGroup>
                        <FormHelperText>
                            Integers. Insert one or more indexes. 'range' is optional, and must be equal to or 
                            above the 'from' value. The size of the virtual list is increased accordingly.
                        </FormHelperText> 
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Remove indexes</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>from:</FormLabel>
                            <NumberInput value = {removeIndexes.from} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>range:</FormLabel>
                            <NumberInput value = {removeIndexes.range} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        </Stack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='remove' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch 
                                isChecked = {functionSettingsRef.current.remove} 
                                onChange = {onChangeEnabler} 
                                id='remove' 
                            />
                        </InputGroup>
                        <FormHelperText>
                            Integers. Remove one or more indexes. 'range' is optional, and must be equal to or 
                            above the 'from' value. The size of the virtual list is decreased accordingly.
                        </FormHelperText> 
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Move indexes</FormLabel>
                        <Stack direction = {['column','row','row']} mb = {2}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>from:</FormLabel>
                            <NumberInput value = {moveIndexes.from} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>range:</FormLabel>
                            <NumberInput value = {moveIndexes.range} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        </Stack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>to:</FormLabel>
                            <NumberInput value = {moveIndexes.to} size = 'sm'><NumberInputField border = '2px' /></NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='move' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch 
                                isChecked = {functionSettingsRef.current.move} 
                                onChange = {onChangeEnabler} 
                                id='move' 
                            />
                        </InputGroup>
                        <FormHelperText>
                            Integers. Move one or more indexes. 'range' is optional, and must be equal to or 
                            above the 'from' value.
                        </FormHelperText> 
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Remap indexes</FormLabel>
                        <Select value = {remapDemo} size = 'sm'>
                            <option value="backwardsort">Backward sort</option>
                            <option value="test2">Test 2</option>
                            <option value="test3">Test 3</option>
                        </Select>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='remap' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch 
                                isChecked = {functionSettingsRef.current.remap} 
                                onChange = {onChangeEnabler} 
                                id='remap' 
                            />
                        </InputGroup>
                        <FormHelperText>
                            The remap function takes as input a map of indexes to scroller-assigned itemID's, and moves the
                            items to the newly assigned indexes. We've included a few random tests that apply to 
                            the cradle. For purposes of the demo the new mappings are 'forgotten' when the moved
                            items scroll out of scope.
                        </FormHelperText>
                    </FormControl>
                    <FormControl>
                        <FormLabel size = 'sm'>Clear the cache</FormLabel>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='clear' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch 
                                isChecked = {functionSettingsRef.current.clear} 
                                onChange = {onChangeEnabler} 
                                id='clear' 
                            />
                        </InputGroup>
                        <FormHelperText>
                            This clears the cache (and therefore the cradle). Not very interesting.
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