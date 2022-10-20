
/*

    - modify enabler onChange calls to verify related data, and turn off errors for unrelated data
    - border color to signify changed value, and error value

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

const exists = (value:string) => {
    let test = !!value
    // console.log('exists',test, typeof value)
    return test
}

const minValue = (value:any, minValue:number) => {
    const testvalue = Number(value)
    const test = (testvalue != NaN && testvalue >=minValue )
    // console.log('minValue', testvalue, typeof testvalue, test, minValue, typeof minValue)
    return test
}

// Options component
const Options = ({
    allDisplayPropertiesRef, 
    contentTypeRef, 
    callbackSettingsRef, 
    operationFunctionRef, 
    functionPropertiesRef,
    functionsObject,
}:any) => {
 
    // simple values
    const [contentType, setContentType] = useState(contentTypeRef.current)
    const [operationFunction, setOperationFunction] = useState(operationFunctionRef.current)
    // objects. The local values will be used to return valid edits to the inherited values
    const [displayValues, setDisplayValues] = useState({...allDisplayPropertiesRef.current[contentTypeRef.current]})
    const [callbackSettings, setCallbackSettings] = useState({...callbackSettingsRef.current})
    const [functionProperties, setFunctionProperties] = useState({...functionPropertiesRef.current})

    const [optionsState, setOptionsState] = useState('setup')

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

    const isInvalid = displayErrorsRef.current

    // displan error messages
    const errorMessagesRef = useRef<GenericObject>(
        {
            // string selection, no errors
            contentType:'',
            orientation:'',
            remapDemo:'',
            cache:'',
            cellHeight:'cellHeight is required with minimum of 25',
            cellWidth:'cellWidth is required with minimum 25',
            minCellHeight:'minimum 25',
            minCellWidth:'minimum 25',
            padding:'blank, or greater than or equal to 0',
            gap:'blank, or greater than or equal to 0',
            runwaySize:'blank, or minimum 1',
            cacheMax:'greater than or equal to 0',
            gotoIndex:'required, greater than or equal to 0',
            listsize:'required, greater than or equal to 0',
            insertFrom:'required, greater than or equal to 0',
            insertRange:'blank, or greater than or equal to 0',
            removeFrom:'required, greater than or equal to 0',
            removeRange:'blank, or greater than or equal to 0',
            moveFrom:'required, greater than or equal to 0',
            moveRange:'blank, or greater than or equal to 0',
            moveTo:'required, greater than or equal to 0',
        }
    )

    const errorMessages = errorMessagesRef.current

    // display error check functions
    const errorTests:GenericObject =
    {
        contentType:(value:any) => {
            let isError = false
            return isError
        },
        orientation:(value:any) => {
            let isError = false
            return isError
        },
        cellHeight:(value:any) => {
            const isValid = (exists(value) && minValue(value, 25))
            displayErrorsRef.current.cellHeight = !isValid
            // console.log('cellHeight isValid', isValid, displayErrorsRef.current)
            return !isValid
        },
        cellWidth:(value:any) => {
            let isError = false
            return isError
        },
        minCellHeight:(value:any) => {
            let isError = false
            return isError
        },
        minCellWidth:(value:any) => {
            let isError = false
            return isError
        },
        padding:(value:any) => {
            let isError = false
            return isError
        },
        gap:(value:any) => {
            let isError = false
            return isError
        },
        runwaySize:(value:any) => {
            let isError = false
            return isError
        },
        cache:(value:any) => {
            let isError = false
            return isError
        },
        cacheMax:(value:any) => {
            let isError = false
            return isError
        },
        gotoIndex:(value:any) => {
            let isError = false
            return isError
        },
        listsize:(value:any) => {
            let isError = false
            return isError
        },
        insertFrom:(value:any) => {
            let isError = false
            return isError
        },
        insertRange:(value:any) => {
            let isError = false
            return isError
        },
        removeFrom:(value:any) => {
            let isError = false
            return isError
        },
        removeRange:(value:any) => {
            let isError = false
            return isError
        },
        moveFrom:(value:any) => {
            let isError = false
            return isError
        },
        moveRange:(value:any) => {
            let isError = false
            return isError
        },
        moveTo:(value:any) => {
            let isError = false
            return isError
        },
        remapDemo:(value:any) => {
            let isError = false
            return isError
        },
    }

    // display on change functions
    const onChangeFuncs:GenericObject = {
        contentType:(event:React.ChangeEvent) => {
            const target = event.target as HTMLSelectElement
            const value = target.value
            contentTypeRef.current = value
            setContentType(value)
            setDisplayValues(allDisplayPropertiesRef.current[value])
        },
        orientation:(orientation:string) => {
            displayValues.orientation = orientation
            allDisplayPropertiesRef.current[contentTypeRef.current] = displayValues
            setDisplayValues({...displayValues})
        },
        cellHeight:(input:string) => {
            displayValues.cellHeight = input
            if (!errorTests.cellHeight(input)) {
                allDisplayPropertiesRef.current[contentTypeRef.current] = displayValues
            }
            setDisplayValues({...displayValues})
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
    return (<Box> <VStack align = 'start' alignItems = 'stretch'>

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
                <option value="nestedpromises">Nested uniform scroller promises</option>
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
                            Properties for the selected content type
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}><VStack alignItems = 'start'>

                    <FormControl borderBottom = '1px'>
                        <Stack direction = {['column','row','row']} align = 'normal'>
                        <FormLabel size = 'xs'>Orientation</FormLabel>
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

                    <Heading size = 'xs'>Base cell sizes</Heading>
                    <Stack direction = {['column','row','row']}>
                        <FormControl isInvalid = {isInvalid.cellHeight}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>cellHeight:</FormLabel>
                                <NumberInput 
                                    value = {displayValues.cellHeight} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.cellHeight}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.cellHeight}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid = {isInvalid.cellWidth}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>cellWidth:</FormLabel>
                                <NumberInput 
                                    value = {displayValues.cellWidth} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.cellWidth}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.cellWidth}
                            </FormErrorMessage>
                        </FormControl>
                    </Stack>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                       Integers (pixels), required. <Code>cellHeight</Code> for vertical, and 
                       <Code>cellWidth</Code> for horizontal are exact for 'uniform' layout, maximum for 
                       'variable' layout; the cross dimensions are allocated fractionally (<Code>fr</Code>).
                    </Text>

                    <Heading size = 'xs'>Minimum cell sizes</Heading>
                    <Stack direction = {['column','row','row']}>
                        <FormControl isInvalid = {isInvalid.minCellHeight}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>cellMinHeight:</FormLabel>
                                <NumberInput 
                                    value = {displayValues.minCellHeight} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.minCellHeight}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.minCellHeight}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid = {isInvalid.minCellWidth} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>cellMinWidth:</FormLabel>
                                <NumberInput 
                                    value = {displayValues.minCellWidth} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.minCellWidth}
                                >
                                        <NumberInputField border = '2px' />
                                    </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.minCellWidth}
                            </FormErrorMessage>
                        </FormControl>
                    </Stack>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integers (pixels). These only apply to variable layouts. Minimum 25, default 25.
                    </Text>

                    <Heading size = 'xs'>Padding and gaps</Heading>
                    <Stack direction = {['column','row','row']}>
                    <FormControl isInvalid = {isInvalid.padding} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>padding:</FormLabel>
                            <NumberInput 
                                value = {displayValues.padding} 
                                size = 'sm'
                                onChange = {onChangeFuncs.padding}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.padding}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid = {isInvalid.gap} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>gap:</FormLabel>
                            <NumberInput 
                                value = {displayValues.gap} 
                                size = 'sm'
                                onChange = {onChangeFuncs.gap}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.gap}
                        </FormErrorMessage>
                    </FormControl>
                    </Stack>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integers (pixels), optional. Padding applies to the scroller borders; gaps apply to 
                        the space between cells.
                    </Text>

                    <Heading size = 'xs'>Runway size</Heading>
                    <FormControl isInvalid = {isInvalid.runwaySize} >
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
                        <FormErrorMessage>
                            {errorMessages.runwaySize}
                        </FormErrorMessage>
                    </FormControl>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. This is the number of rows out of view at the head and tail of lists. 
                        Minimum 1, default 1.
                    </Text>

                    <Heading size = 'xs'>Cache settings</Heading>
                    <Stack direction = {['column','row','row']}>
                    <FormControl>
                        <Select 
                            value = {displayValues.cache} 
                            flexGrow = {.8} 
                            size = 'sm'
                            onChange = {onChangeFuncs.cache}
                        >
                            <option value="cradle">cradle</option>
                            <option value="keepload">keep load</option>
                            <option value="preload">preload</option>
                        </Select>
                    </FormControl>
                    <FormControl isInvalid = {isInvalid.cacheMax}>
                        <InputGroup size = 'sm' flexGrow = {1.2} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cacheMax:</FormLabel>
                            <NumberInput 
                                value = {displayValues.cacheMax} 
                                size = 'sm'
                                onChange = {onChangeFuncs.cacheMax}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.cacheMax}
                        </FormErrorMessage>
                    </FormControl>
                    </Stack>
                    <Text fontSize = 'sm' paddingBottom = {2}>
                        <Code>cacheMax</Code>:integer is ignored for 'cradle' cache setting. 
                        Otherwise, very high settings can degrade performance. <Code>cacheMax</Code> blank 
                        or zero is ignored.
                    </Text>

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
                            isChecked = {callbackSettings.referenceIndexCallback} 
                            size = 'sm'
                            mt = {2}
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
                            isChecked = {callbackSettings.preloadIndexCallback} 
                            size = 'sm'
                            mt = {2}
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
                            isChecked = {callbackSettings.itemExceptionCallback} 
                            size = 'sm'
                            mt = {2}
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
                            isChecked = {callbackSettings.repositioningFlagCallback} 
                            size = 'sm'
                            mt = {2}
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
                            isChecked = {callbackSettings.repositioningIndexCallback} 
                            size = 'sm'
                            mt = {2}
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
                            isChecked = {callbackSettings.changeListsizeCallback} 
                            size = 'sm'
                            mt = {2}
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
                            isChecked = {callbackSettings.deleteListCallback} 
                            size = 'sm'
                            mt = {2}
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

                    <Heading size = 'xs'>Go to</Heading>
                    <HStack>
                        <FormControl isInvalid = {isInvalid.gotoIndex} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>index:</FormLabel>
                                <NumberInput 
                                    value = {functionProperties.gotoIndex} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.gotoIndex}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.gotoIndex}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl>
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
                        </FormControl>
                    </HStack>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. Go to the specified index number in the virtual list.
                    </Text>

                    <Heading size = 'xs'>Change virtual list size</Heading>
                    <HStack>
                        <FormControl isInvalid = {isInvalid.listsize} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>size:</FormLabel>
                                <NumberInput 
                                    value = {functionProperties.listsize} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.listsize}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.listsize}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl>
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
                        </FormControl>
                    </HStack>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. Change the size of the scroller's virtual list.
                    </Text>

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

                    <Heading size = 'xs'>Insert indexes</Heading>
                    <Stack direction = {['column','row','row']}>
                        <FormControl isInvalid = {isInvalid.insertFrom} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>from:</FormLabel>
                                <NumberInput 
                                    value = {functionProperties.insertFrom} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.insertFrom}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.insertFrom}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid = {isInvalid.insertRange} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>range:</FormLabel>
                                <NumberInput 
                                    value = {functionProperties.insertRange} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.insertRange}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.insertRange}
                            </FormErrorMessage>
                        </FormControl>
                    </Stack>
                    <FormControl>
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
                    </FormControl>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integers. Insert one or more indexes. 'range' is optional, and must be equal to or 
                        above the 'from' value. The size of the virtual list is increased accordingly.
                    </Text>

                    <Heading size = 'xs'>Remove indexes</Heading>
                    <Stack direction = {['column','row','row']}>
                        <FormControl isInvalid ={isInvalid.removeFrom} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>from:</FormLabel>
                                <NumberInput 
                                    value = {functionProperties.removeFrom} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.removeFrom}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.removeFrom}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid = {isInvalid.removeRange} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>range:</FormLabel>
                                <NumberInput 
                                    value = {functionProperties.removeRange} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.removeRange}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.removeRange}
                            </FormErrorMessage>
                        </FormControl>
                    </Stack>
                    <FormControl>
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
                    </FormControl>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integers. Remove one or more indexes. 'range' is optional, and must be equal to or 
                        above the 'from' value. The size of the virtual list is decreased accordingly.
                    </Text>

                    <Heading size = 'xs'>Move indexes</Heading>
                    <Stack direction = {['column','row','row']} mb = {2}>
                    <FormControl isInvalid = {isInvalid.moveFrom} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>from:</FormLabel>
                            <NumberInput 
                                value = {functionProperties.moveFrom} 
                                size = 'sm'
                                onChange = {onChangeFuncs.moveFrom}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.moveFrom}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid = {isInvalid.moveRange} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>range:</FormLabel>
                            <NumberInput 
                                value = {functionProperties.moveRange} 
                                size = 'sm'
                                onChange = {onChangeFuncs.moveRange}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.moveRange}
                        </FormErrorMessage>
                    </FormControl>
                    </Stack>
                    <FormControl isInvalid = {isInvalid.moveTo} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>to:</FormLabel>
                            <NumberInput 
                                value = {functionProperties.moveTo} 
                                size = 'sm'
                                onChange = {onChangeFuncs.moveTo}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.moveTo}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl>
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
                    </FormControl>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integers. Move one or more indexes. 'range' is optional, and must be equal to or 
                        above the 'from' value.
                    </Text> 

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