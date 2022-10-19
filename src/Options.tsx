
/*

    - modify enabler onChange calls to verify related data, and turn off errors for unrelated data
    - border color to signify changed value

*/

import React, {useState, useRef, useEffect} from 'react'

import {

    Box, Stack, VStack, HStack,
    FormControl, FormLabel, FormHelperText, FormErrorMessage,
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Button, Switch, Radio, RadioGroup, Checkbox, Select,   
    NumberInput, NumberInputField, InputGroup,
    Heading, Text, Code,

} from '@chakra-ui/react'

// type declarations
type GenericObject = {
    [prop:string]:any
}

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

// Options component
const Options = (props:any) => {

    // tested values
    const [optionsState, setOptionsState] = useState('setup')
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
    const [listsize, setListsize] = useState<number | undefined>(undefined)
    const [insertIndexes, setInsertIndexes] = useState<RangeIndexes>({from:0,range:undefined})
    const [removeIndexes, setRemoveIndexes] = useState<RangeIndexes>({from:0, range: undefined})
    const [moveIndexes, setMoveIndexes] = useState<MoveIndexes>({from:0, range: undefined, to:0})
    const [remapDemo, setRemapDemo] = useState<string>('backwardsort')

    // untested display values
    const displayValuesRef = useRef<GenericObject>()

    // display values
    useEffect(()=>{
        displayValuesRef.current = {
            contentType,
            orientation,
            cellSizes,
            minCellSizes,
            paddingAndGap,
            runwaySize,
            cacheSettings,
            callbackSettings,
            gotoIndex,
            listsize,
            insertIndexes,
            removeIndexes,
            moveIndexes,
            remapDemo,
        }
        setDisplayValues(displayValuesRef.current)
    },[])

    const [displayValues, setDisplayValues] = useState<GenericObject>({})

    // display error flags
    const displayErrorsRef = useRef<GenericObject>(
        {
            contentType:false,
            orientation:false,
            cellHeight:false,
            cellWidth:false,
            minCellHeight:false,
            minCellWidth:false,
            padding:false,
            gap:false,
            runwaySize:false,
            cache:false,
            cacheMax:false,
            gotoIndex:false,
            listsize:false,
            insertFrom:false,
            insertRange:false,
            removeFrom:false,
            removeRange:false,
            moveFrom:false,
            moveRange:false,
            moveTo:false,
            remapDemo:false,
        }
    )

    const displayErrors = displayErrorsRef.current

    // displan error messages
    const errorMessagesRef = useRef<GenericObject>(
        {
            contentType:'',
            orientation:'',
            cellHeight:'',
            cellWidth:'',
            minCellHeight:'',
            minCellWidth:'',
            padding:'',
            gap:'',
            runwaySize:'',
            cache:'',
            cacheMax:'',
            gotoIndex:'',
            listsize:'',
            insertFrom:'',
            insertRange:'',
            removeFrom:'',
            removeRange:'',
            moveFrom:'',
            moveRange:'',
            moveTo:'',
            remapDemo:'',
        }
    )

    const errorMessages = errorMessagesRef.current

    // display error check functions
    const errorChecks:GenericObject =
    {
        contentType:() => {
            let isError = false
            return isError
        },
        orientation:() => {
            let isError = false
            return isError
        },
        cellHeight:() => {
            let isError = false
            return isError
        },
        cellWidth:() => {
            let isError = false
            return isError
        },
        minCellHeight:() => {
            let isError = false
            return isError
        },
        minCellWidth:() => {
            let isError = false
            return isError
        },
        padding:() => {
            let isError = false
            return isError
        },
        gap:() => {
            let isError = false
            return isError
        },
        runwaySize:() => {
            let isError = false
            return isError
        },
        cache:() => {
            let isError = false
            return isError
        },
        cacheMax:() => {
            let isError = false
            return isError
        },
        gotoIndex:() => {
            let isError = false
            return isError
        },
        listsize:() => {
            let isError = false
            return isError
        },
        insertFrom:() => {
            let isError = false
            return isError
        },
        insertRange:() => {
            let isError = false
            return isError
        },
        removeFrom:() => {
            let isError = false
            return isError
        },
        removeRange:() => {
            let isError = false
            return isError
        },
        moveFrom:() => {
            let isError = false
            return isError
        },
        moveRange:() => {
            let isError = false
            return isError
        },
        moveTo:() => {
            let isError = false
            return isError
        },
        remapDemo:() => {
            let isError = false
            return isError
        },
    }

    // display on change functions
    const onChangeFuncs:GenericObject = {
        contentType:(event:React.ChangeEvent) => {

        },
        orientation:(event:React.ChangeEvent) => {
            
        },
        cellHeight:(event:React.ChangeEvent) => {
            
        },
        cellWidth:(event:React.ChangeEvent) => {
            
        },
        minCellHeight:(event:React.ChangeEvent) => {
            
        },
        minCellWidth:(event:React.ChangeEvent) => {
            
        },
        padding:(event:React.ChangeEvent) => {
            
        },
        gap:(event:React.ChangeEvent) => {
            
        },
        runwaySize:(event:React.ChangeEvent) => {
            
        },
        cache:(event:React.ChangeEvent) => {
            
        },
        cacheMax:(event:React.ChangeEvent) => {
            
        },
        callbackSettings:(event:React.ChangeEvent) => {
            
        },
        gotoIndex:(event:React.ChangeEvent) => {
            
        },
        listsize:(event:React.ChangeEvent) => {
            
        },
        insertFrom:(event:React.ChangeEvent) => {
            
        },
        insertRange:(event:React.ChangeEvent) => {
            
        },
        removeFrom:(event:React.ChangeEvent) => {
            
        },
        removeRange:(event:React.ChangeEvent) => {
            
        },
        moveFrom:(event:React.ChangeEvent) => {
            
        },
        moveRange:(event:React.ChangeEvent) => {
            
        },
        moveTo:(event:React.ChangeEvent) => {
            
        },
        remapDemo:(event:React.ChangeEvent) => {
            
        },
    }

    useEffect(()=>{

        if (optionsState == 'setup') {
            setOptionsState('ready')
        }

    }, [optionsState])

    // scroller function switch settings
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

    // update scroller function switch settings
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

    // render
    return (optionsState == 'setup')?
        null:
        (<Box> <VStack align = 'start' alignItems = 'stretch'>

        <FormControl mb = {3}>

            <FormLabel>Select Content Type</FormLabel>

            <Select 
                size = 'md'
                value = {displayValues.contentType} 
                onChange = {onChangeFuncs.contentType}
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
                        <RadioGroup 
                            value = {displayValues.orientation} 
                            onChange = {onChangeFuncs.orientation}
                        >
                            <HStack align = 'center'>
                                <Radio value = 'vertical'>Vertical</Radio>
                                <Radio value = 'horizontal'>Horizontal</Radio>
                            </HStack>
                        </RadioGroup>
                        </Stack>
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Base cell sizes</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellHeight:</FormLabel>
                            <NumberInput 
                                value = {displayValues.cellSizes.cellHeight} 
                                size = 'sm'
                                onChange = {onChangeFuncs.cellHeight}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellWidth:</FormLabel>
                            <NumberInput 
                                value = {displayValues.cellSizes.cellWidth} 
                                size = 'sm'
                                onChange = {onChangeFuncs.cellWidth}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                           Integers (pixels), required. <Code>cellHeight</Code> for vertical, and 
                           <Code>cellWidth</Code> for horizontal are exact for 'uniform' layout, maximum for 
                           'variable' layout; the cross dimensions are allocated fractionally (<Code>fr</Code>).
                        </FormHelperText>
                        {displayErrors.cellHeight &&
                            <FormErrorMessage>
                                {errorMessages.cellHeight}
                            </FormErrorMessage>}
                        {displayErrors.cellWidth &&
                            <FormErrorMessage>
                                {errorMessages.cellWidth}
                            </FormErrorMessage>}
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Minimum cell sizes</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellMinHeight:</FormLabel>
                            <NumberInput 
                                value = {displayValues.minCellSizes.minCellHeight} 
                                size = 'sm'
                                onChange = {onChangeFuncs.minCellHeight}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cellMinWidth:</FormLabel>
                            <NumberInput 
                                value = {displayValues.minCellSizes.minCellWidth} 
                                size = 'sm'
                                onChange = {onChangeFuncs.minCellWidth}
                            >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                            Integers (pixels). These only apply to variable layouts. Minimum 25, default 25.
                        </FormHelperText>
                        {displayErrors.minCellHeight &&
                            <FormErrorMessage>
                                {errorMessages.minCellHeight}
                            </FormErrorMessage>}
                        {displayErrors.minCellWidth &&
                            <FormErrorMessage>
                                {errorMessages.minCellWidth}
                            </FormErrorMessage>}
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Padding and gaps</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>padding:</FormLabel>
                            <NumberInput 
                                value = {displayValues.paddingAndGap.padding} 
                                size = 'sm'
                                onChange = {onChangeFuncs.padding}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>gap:</FormLabel>
                            <NumberInput 
                                value = {displayValues.paddingAndGap.gap} 
                                size = 'sm'
                                onChange = {onChangeFuncs.gap}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                            Integers (pixels), optional. Padding applies to the scroller borders; gaps apply to 
                            the space between cells.
                        </FormHelperText>
                        {displayErrors.padding &&
                            <FormErrorMessage>
                                {errorMessages.padding}
                            </FormErrorMessage>}
                        {displayErrors.gap &&
                            <FormErrorMessage>
                                {errorMessages.gap}
                            </FormErrorMessage>}
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Runway size</FormLabel>
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>runwaySize:</FormLabel>
                            <NumberInput 
                                value = {displayValues.runwaySize} 
                                size = 'sm'
                                onChange = {onChangeFuncs.runwaySize}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        </HStack>
                        <FormHelperText>
                            Integer. This is the number of rows out of view at the head and tail of lists. 
                            Minimum 1, default 1.
                        </FormHelperText>
                        {displayErrors.runwaySize &&
                            <FormErrorMessage>
                                {errorMessages.runwaySize}
                            </FormErrorMessage>}
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Cache settings</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <Select 
                            value = {displayValues.cacheSettings.cache} 
                            flexGrow = {.8} 
                            size = 'sm'
                            onChange = {onChangeFuncs.cache}
                        >
                            <option value="cradle">cradle</option>
                            <option value="keepload">keep load</option>
                            <option value="preload">preload</option>
                        </Select>
                        <InputGroup size = 'sm' flexGrow = {1.2} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cacheMax:</FormLabel>
                            <NumberInput 
                                value = {displayValues.cacheSettings.cacheMax} 
                                size = 'sm'
                                onChange = {onChangeFuncs.cacheMax}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        </Stack>
                        <FormHelperText>
                            <Code>cacheMax</Code>:integer is ignored for 'cradle' cache setting. 
                            Otherwise, very high settings can degrade performance. <Code>cacheMax</Code> blank 
                            or zero is ignored.
                        </FormHelperText>
                        {displayErrors.cache &&
                            <FormErrorMessage>
                                {errorMessages.cache}
                            </FormErrorMessage>}
                        {displayErrors.cacheMax &&
                            <FormErrorMessage>
                                {errorMessages.cacheMax}
                            </FormErrorMessage>}
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
                        <Checkbox 
                            isChecked = {displayValues.callbackSettings.referenceIndexCallback} 
                            size = 'sm'
                            id = 'referenceIndexCallback'
                            onChange = {onChangeFuncs.callBackSettings}
                        >
                            Reference index
                        </Checkbox>
                        <FormHelperText>
                            This reports the first index of the tail grid, near the top or left of the viewport.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {displayValues.callbackSettings.preloadIndexCallback} 
                            size = 'sm'
                            id = 'preloadIndexCallback'
                            onChange = {onChangeFuncs.callBackSettings}
                        >
                            Preload Index
                        </Checkbox>
                        <FormHelperText>
                            This reports a stream of index numbers being preloaded.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {displayValues.callbackSettings.itemExceptionCallback} 
                            size = 'sm'
                            id = 'itemExceptionCallback'
                            onChange = {onChangeFuncs.callBackSettings}
                        >
                            Item Exceptions
                        </Checkbox>
                        <FormHelperText>
                            This reports details of a failed <Code>getItem</Code> call.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {displayValues.callbackSettings.repositioningFlagCallback} 
                            size = 'sm'
                            id = 'repositioningFlagCallback'
                            onChange = {onChangeFuncs.callBackSettings}
                        >
                            isRepositioning Notification
                        </Checkbox>
                        <FormHelperText>
                            Alerts the beginning (<Code>true</Code>) or end (<Code>false</Code>) of a rapid 
                            repositioning session.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {displayValues.callbackSettings.repositioningIndexCallback} 
                            size = 'sm'
                            id = 'repositioningIndexCallback'
                            onChange = {onChangeFuncs.callBackSettings}
                        >
                            Repositioning Index
                        </Checkbox>
                        <FormHelperText>
                            During rapid repositioning mode, this streams the virtual location of the scroller.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {displayValues.callbackSettings.changeListsizeCallback} 
                            size = 'sm'
                            id = 'changeListsizeCallback'
                            onChange = {onChangeFuncs.callBackSettings}
                        >
                            Listsize change
                        </Checkbox>
                        <FormHelperText>
                            Reports change to list size for any standard reason.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {displayValues.callbackSettings.deleteListCallback} 
                            size = 'sm'
                            id = 'deleteListCallback'
                            onChange = {onChangeFuncs.callBackSettings}
                        >
                            Deleted List
                        </Checkbox>
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
                                <NumberInput 
                                    value = {displayValues.gotoIndex} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.gotoIndex}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
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
                        {displayErrors.gotoIndex &&
                            <FormErrorMessage>
                                {errorMessages.gotoIndex}
                            </FormErrorMessage>}
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Change virtual list size</FormLabel>
                        <HStack>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>size:</FormLabel>
                                <NumberInput 
                                    value = {displayValues.listsize} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.listsize}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
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
                        {displayErrors.listsize &&
                            <FormErrorMessage>
                                {errorMessages.listsize}
                            </FormErrorMessage>}
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
                            <NumberInput 
                                value = {displayValues.insertIndexes.from} 
                                size = 'sm'
                                onChange = {onChangeFuncs.insertFrom}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>range:</FormLabel>
                            <NumberInput 
                                value = {displayValues.insertIndexes.range} 
                                size = 'sm'
                                onChange = {onChangeFuncs.insertRange}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
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
                        {displayErrors.insertFrom &&
                            <FormErrorMessage>
                                {errorMessages.insertFrom}
                            </FormErrorMessage>}
                        {displayErrors.insertRange &&
                            <FormErrorMessage>
                                {errorMessages.insertRange}
                            </FormErrorMessage>}
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Remove indexes</FormLabel>
                        <Stack direction = {['column','row','row']}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>from:</FormLabel>
                            <NumberInput 
                                value = {displayValues.removeIndexes.from} 
                                size = 'sm'
                                onChange = {onChangeFuncs.removeFrom}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>range:</FormLabel>
                            <NumberInput 
                                value = {displayValues.removeIndexes.range} 
                                size = 'sm'
                                onChange = {onChangeFuncs.removeRange}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
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
                        {displayErrors.removeFrom &&
                            <FormErrorMessage>
                                {errorMessages.removeFrom}
                            </FormErrorMessage>}
                        {displayErrors.removeRange &&
                            <FormErrorMessage>
                                {errorMessages.removeRange}
                            </FormErrorMessage>}
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Move indexes</FormLabel>
                        <Stack direction = {['column','row','row']} mb = {2}>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>from:</FormLabel>
                            <NumberInput 
                                value = {displayValues.moveIndexes.from} 
                                size = 'sm'
                                onChange = {onChangeFuncs.moveFrom}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>range:</FormLabel>
                            <NumberInput 
                                value = {displayValues.moveIndexes.range} 
                                size = 'sm'
                                onChange = {onChangeFuncs.moveRange}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        </Stack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>to:</FormLabel>
                            <NumberInput 
                                value = {displayValues.moveIndexes.to} 
                                size = 'sm'
                                onChange = {onChangeFuncs.moveTo}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
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
                        {displayErrors.moveFrom &&
                            <FormErrorMessage>
                                {errorMessages.moveFrom}
                            </FormErrorMessage>}
                        {displayErrors.moveRange &&
                            <FormErrorMessage>
                                {errorMessages.moveRange}
                            </FormErrorMessage>}
                        {displayErrors.moveTo &&
                            <FormErrorMessage>
                                {errorMessages.moveTo}
                            </FormErrorMessage>}
                    </FormControl>

                    <FormControl>
                        <FormLabel size = 'sm'>Remap indexes</FormLabel>
                        <Select 
                            value = {displayValues.remapDemo} 
                            size = 'sm'
                            onChange = {onChangeFuncs.remapDemo}
                        >
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
                            the cradle. For purposes of this demo the new mappings are 'forgotten' when the moved
                            items scroll out of scope.
                        </FormHelperText>
                        {displayErrors.remapDemo &&
                            <FormErrorMessage>
                                {errorMessages.remapDemo}
                            </FormErrorMessage>}
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

    </VStack></Box>)
}

export default Options