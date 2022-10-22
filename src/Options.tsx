
/*

    - establish dependencies among fields
    - intialize dependencies on load
    - modify enabler onChange calls to verify related data, and turn off errors for unrelated data
    - border color to signify changed value, and error value

*/

import React, {useState, useRef, useEffect} from 'react'

import {

    Box, Stack, VStack, HStack, // layout
    FormControl, FormLabel, FormHelperText, FormErrorMessage, // forms
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, // accordion
    Button, Switch, Radio, RadioGroup, Checkbox, Select, // active content components
    NumberInput, NumberInputField, InputGroup, // number component
    Heading, Text, Code, // passive content components

} from '@chakra-ui/react'

// type declarations
type GenericObject = {
    [prop:string]:any
}

// error check utilities
const isBlank = (value:any) => {
    const testvalue = value ?? ''
    return testvalue === ''
}

const isNumber = (value:any) => {

    return (!isNaN(Number(value)) && !isNaN(parseInt(value)))

}

const isInteger = (value:any) => {

    const test = +value

    return (isNumber(value) && (Math.floor(test) == test))

}

const minValue = (value:any, minValue:any) => {

    if (!isInteger(value) || !isInteger(minValue)) return false

    const testvalue = +value
    const testMinValue = +minValue

    return testvalue >=minValue

}

const maxValue = (value:any, maxValue:any) => {

    if (!isInteger(value) || !isInteger(maxValue)) return false

    const testvalue = +value
    const testMaxValue = +maxValue

    return testvalue <=maxValue

}

// Options component; almost 40 fields
const Options = ({

    allDisplayPropertiesRef, 
    contentTypeRef, 
    callbackSettingsRef, 
    operationFunctionRef, 
    functionPropertiesRef,
    functionsObjectRef,

}:any) => {
 
    // -------------------------[ state updates ]------------------------

    // inherited scroller service functions
    const functionsObject = functionsObjectRef.current

    // component state
    const [optionsState, setOptionsState] = useState('initializedependencies')

    // simple values
    const [contentType, setContentType] = useState(contentTypeRef.current)
    const [operationEditFunction, setOperationFunction] = useState(operationFunctionRef.current)
    operationFunctionRef.current = operationEditFunction

    // objects. The local values are used to obtain valid edits to the inherited values
    const [displayValues, setDisplayValues] = useState({...allDisplayPropertiesRef.current[contentType]})
    const displayValuesRef = useRef(displayValues)
    displayValuesRef.current = displayValues

    const [callbackSettings, setCallbackSettings] = useState({...callbackSettingsRef.current})
    
    const [functionDisplayValues, setFunctionDisplayValues] = useState({...functionPropertiesRef.current})
    const functionDisplayValuesRef = useRef(functionDisplayValues)
    functionDisplayValuesRef.current = functionDisplayValues

    // --------------------------------[ field data ]-----------------------------

    // disabled controls
    const disabledFlagsRef = useRef<GenericObject>(
        {
            cellMinHeight:false,
            cellMinWidth:false,
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

    const disabledFlags = disabledFlagsRef.current

    // display error flags
    const invalidFlagsRef = useRef<GenericObject>(
        {
            contentType:false,
            orientation:false,
            cellHeight:false,
            cellWidth:false,
            cellMinHeight:false,
            cellMinWidth:false,
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

    const invalidFlags = invalidFlagsRef.current

    // scroller function switch settings
    const functionEnabledSettingsRef = useRef<GenericObject>({
        goto:false,
        listsize:false,
        reload:false,
        insert:false,
        remove:false,
        move:false,
        remap:false,
        clear:false,
    })

    const functionEnbledSettings = functionEnabledSettingsRef.current

    // display error messages
    const errorMessages = { 
        // string selection, no errors
        cellHeight:'integer: cellHeight is required with minimum of 25',
        cellWidth:'integer: cellWidth is required with minimum 25',
        cellMinHeight:'blank, or integer minimum 25 and less than or equal to cellHeight',
        cellMinWidth:'blank, or integer minimum 25 and less than or equal to cellWidth',
        padding:'blank, or integer greater than or equal to 0',
        gap:'blank, or integeer greater than or equal to 0',
        runwaySize:'blank, or integer minimum 1',
        cacheMax:'blank, or integer greater than or equal to 0',
        gotoIndex:'integer: required, greater than or equal to 0',
        listsize:'integer: required, greater than or equal to 0',
        insertFrom:'integer: required, greater than or equal to 0',
        insertRange:'blank, or integer greater than or equal to the "from" index',
        removeFrom:'integer: required, greater than or equal to 0',
        removeRange:'blank, or integer greater than or equal to the "from" index',
        moveFrom:'integer: required, greater than or equal to 0',
        moveRange:'blank, or integer greater than or equal to the "from" index',
        moveTo:'integer: required, greater than or equal to 0',
    }

    // -----------------------------------[ field functions ]------------------------------

    // display error check functions
    const isInvalidTests = {
        cellHeight:(value:any) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 25))
            invalidFlags.cellHeight = isInvalid
            if (!disabledFlags.cellMinHeight) {
                isInvalidTests.cellMinHeight(displayValuesRef.current.cellMinHeight)
            }
            return isInvalid
        },
        cellWidth:(value:any) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 25))
            invalidFlags.cellWidth = isInvalid
            if (!disabledFlags.cellMinWidth) {
                isInvalidTests.cellMinWidth(displayValuesRef.current.cellMinWidth)
            }
            return isInvalid
        },
        cellMinHeight:(value:any) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = (!minValue(value,25) || !(maxValue(value, displayValuesRef.current.cellHeight)))
            }
            invalidFlags.cellMinHeight = isInvalid
            return isInvalid
        },
        cellMinWidth:(value:any) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = (!minValue(value,25) || !(maxValue(value, displayValuesRef.current.cellWidth)))
            }
            invalidFlags.cellMinWidth = isInvalid
            return isInvalid
        },
        padding:(value:any) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,0)
            }
            invalidFlags.padding = isInvalid
            return isInvalid
        },
        gap:(value:any) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,0)
            }
            invalidFlags.gap = isInvalid
            return isInvalid
        },
        runwaySize:(value:any) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,1)
            }
            invalidFlags.runwaySize = isInvalid
            return isInvalid
        },
        cacheMax:(value:any) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,0)
            }
            invalidFlags.cacheMax = isInvalid
            return isInvalid
        },
        gotoIndex:(value:any) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.gotoIndex = isInvalid
            return isInvalid
        },
        listsize:(value:any) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.listsize = isInvalid
            return isInvalid
        },
        insertFrom:(value:any) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.insertFrom = isInvalid
            isInvalidTests.insertRange(functionDisplayValuesRef.current.insertRange)
            return isInvalid
        },
        insertRange:(value:any) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,functionDisplayValuesRef.current.insertFrom)
            }
            invalidFlags.insertRange = isInvalid
            return isInvalid
        },
        removeFrom:(value:any) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.removeFrom = isInvalid
            isInvalidTests.removeRange(functionDisplayValuesRef.current.removeRange)
            return isInvalid
        },
        removeRange:(value:any) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,functionDisplayValuesRef.current.removeFrom)
            }
            invalidFlags.removeRange = isInvalid
            return isInvalid
        },
        moveFrom:(value:any) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.moveFrom = isInvalid
            isInvalidTests.moveRange(functionDisplayValuesRef.current.moveRange)
            return isInvalid
        },
        moveRange:(value:any) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,functionDisplayValuesRef.current.moveFrom)
            }
            invalidFlags.moveRange = isInvalid
            return isInvalid
        },
        moveTo:(value:any) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.moveTo = isInvalid
            return isInvalid
        },
    }

    const dependencyFuncs = {
        contentType:(value:string) => {

            let disabled
            if (['variable','variablepromises','variabledynamic'].includes(value)) {

                disabled = false
                isInvalidTests.cellMinHeight(displayValuesRef.current.cellMinHeight)
                isInvalidTests.cellMinWidth(displayValuesRef.current.cellMinWidth)

            } else {

                disabled = true
                invalidFlags.cellMinHeight = 
                    invalidFlags.cellMinWidth = false

            }

            disabledFlags.cellMinHeight =
                disabledFlags.cellMinWidth = disabled

        },
        serviceFunctions: (service:string) => {
            // disable all, and reset error conditions
            const dependentFields = [
                'gotoIndex',
                'listsize',
                'insertFrom', 'insertRange',
                'removeFrom', 'removeRange',
                'moveFrom', 'moveRange', 'moveTo',
                'remapDemo',
            ]

            for (const field of dependentFields) {
                disabledFlags[field] = true
                if (invalidFlags[field]) {
                    invalidFlags[field] = false
                    functionDisplayValuesRef.current[field] = functionPropertiesRef.current[field]
                }
            }

            if (service) {
                switch (service) {
                    case 'goto':{
                        disabledFlags.gotoIndex = false
                        isInvalidTests.gotoIndex(functionDisplayValuesRef.current.gotoIndex)
                        break
                    }
                    case 'listsize':{
                        disabledFlags.listsize = false
                        isInvalidTests.listsize(functionDisplayValuesRef.current.listsize)
                        break
                    }
                    case 'reload':{

                        break
                    }
                    case 'insert':{
                        disabledFlags.insertFrom = false
                        disabledFlags.insertRange = false
                        isInvalidTests.insertFrom(functionDisplayValuesRef.current.insertFrom)
                        isInvalidTests.insertRange(functionDisplayValuesRef.current.insertRange)
                        break
                    }
                    case 'remove':{
                        disabledFlags.removeFrom = false
                        disabledFlags.removeRange = false
                        isInvalidTests.removeFrom(functionDisplayValuesRef.current.removeFrom)
                        isInvalidTests.removeRange(functionDisplayValuesRef.current.removeRange)
                        break
                    }
                    case 'move':{
                        disabledFlags.moveFrom = false
                        disabledFlags.moveRange = false
                        disabledFlags.moveTo = false
                        isInvalidTests.moveFrom(functionDisplayValuesRef.current.moveFrom)
                        isInvalidTests.moveRange(functionDisplayValuesRef.current.moveRange)
                        isInvalidTests.moveTo(functionDisplayValuesRef.current.moveTo)
                        break
                    }
                    case 'remap':{
                        disabledFlags.remapDemo = false
                        break
                    }
                    case 'clear':{

                        break
                    }
                }
            }
            setFunctionDisplayValues(functionDisplayValuesRef.current)
        }

    }

    // display on change functions
    const onChangeFuncs = {

        // update scroller service function switch settings
        onChangeEnabler:(event:React.ChangeEvent) => {
            const target = event.target as HTMLInputElement
            const enablerID = target.id
            const enablerValue = target.checked
            const functionSettings = functionEnbledSettings
            for (const prop in functionSettings) {
                functionSettings[prop] = false
            }
            functionSettings[enablerID] = enablerValue
            const opfunc = 
                enablerValue?
                enablerID:
                null
            setOperationFunction(opfunc)
            setOptionsState('preparetoupdatefunctiondependencies')
        },

        // contentType global switch
        contentType:(event:React.ChangeEvent) => {
            const target = event.target as HTMLSelectElement
            const value = target.value
            contentTypeRef.current = value
            // change property set to correspond with content type
            setDisplayValues({...allDisplayPropertiesRef.current[value]})
            setContentType(value)
            setOptionsState('preparetoupdatecontentdependencies')
        },

        // callback handling
        callbackSettings:(event:React.ChangeEvent) => {
            const target = event.target as HTMLInputElement
            const callbackID = target.id
            const callbackValue = target.checked
            const callbackSettings = callbackSettingsRef.current
            callbackSettings[callbackID] = callbackValue
            setCallbackSettings({...callbackSettings})            
        },

        // individual values
        orientation:(input:string) => {
            const displayValues = displayValuesRef.current
            displayValues.orientation = input
            const newDisplayValues = 
                {...allDisplayPropertiesRef.current[contentTypeRef.current],orientation:input}
            allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            setDisplayValues({...displayValues})
        },
        cellHeight:(input:string) => {
            const displayValues = displayValuesRef.current
            displayValues.cellHeight = input
            if (!isInvalidTests.cellHeight(input)) {
                const newDisplayValues = 
                    {...allDisplayPropertiesRef.current[contentTypeRef.current],cellHeight:input}
                allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            }
            setDisplayValues({...displayValues})
        },
        cellWidth:(input:string) => {
            const displayValues = displayValuesRef.current
            displayValues.cellWidth = input
            if (!isInvalidTests.cellWidth(input)) {
                const newDisplayValues = 
                    {...allDisplayPropertiesRef.current[contentTypeRef.current],cellWidth:input}
                allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            }
            setDisplayValues({...displayValues})
        },
        cellMinHeight:(input:string) => {
            const displayValues = displayValuesRef.current
            displayValues.cellMinHeight = input
            if (!isInvalidTests.cellMinHeight(input)) {
                const newDisplayValues = 
                    {...allDisplayPropertiesRef.current[contentTypeRef.current],cellMinHeight:input}
                allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            }
            setDisplayValues({...displayValues})
        },
        cellMinWidth:(input:string) => {
            const displayValues = displayValuesRef.current
            displayValues.cellMinWidth = input
            if (!isInvalidTests.cellMinWidth(input)) {
                const newDisplayValues = 
                    {...allDisplayPropertiesRef.current[contentTypeRef.current],cellMinWidth:input}
                allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            }
            setDisplayValues({...displayValues})
        },
        padding:(input:string) => {
            const displayValues = displayValuesRef.current
            displayValues.padding = input
            if (!isInvalidTests.padding(input)) {
                const newDisplayValues = 
                    {...allDisplayPropertiesRef.current[contentTypeRef.current],padding:input}
                allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            }
            setDisplayValues({...displayValues})
        },
        gap:(input:string) => {
            const displayValues = displayValuesRef.current
            displayValues.gap = input
            if (!isInvalidTests.gap(input)) {
                const newDisplayValues = 
                    {...allDisplayPropertiesRef.current[contentTypeRef.current],gap:input}
                allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            }
            setDisplayValues({...displayValues})
        },
        runwaySize:(input:string) => {
            const displayValues = displayValuesRef.current
            displayValues.runwaySize = input
            if (!isInvalidTests.runwaySize(input)) {
                const newDisplayValues = 
                    {...allDisplayPropertiesRef.current[contentTypeRef.current],runwaySize:input}
                allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            }
            setDisplayValues({...displayValues})
        },
        cache:(event:React.ChangeEvent) => {
            const displayValues = displayValuesRef.current
            const target = event.target as HTMLSelectElement
            const value = target.value
            displayValues.cache = value
            const newDisplayValues = 
                {...allDisplayPropertiesRef.current[contentTypeRef.current],cache:value}
            allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            setDisplayValues({...displayValues})
        },
        cacheMax:(input:string) => {
            const displayValues = displayValuesRef.current
            displayValues.cacheMax = input
            if (!isInvalidTests.cacheMax(input)) {
                const newDisplayValues = 
                    {...allDisplayPropertiesRef.current[contentTypeRef.current],cacheMax:input}
                allDisplayPropertiesRef.current[contentTypeRef.current] = newDisplayValues
            }
            setDisplayValues({...displayValues})
        },
        gotoIndex:(input:string) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            functionDisplayValues.gotoIndex = input
            if (!isInvalidTests.gotoIndex(input)) {
                functionPropertiesRef.current.gotoIndex = input
            }
            setFunctionDisplayValues({...functionDisplayValues})
        },
        listsize:(input:string) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            functionDisplayValues.listsize = input
            if (!isInvalidTests.listsize(input)) {
                functionPropertiesRef.current.listsize = input
            }
            setFunctionDisplayValues({...functionDisplayValues})
        },
        insertFrom:(input:string) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            functionDisplayValues.insertFrom = input
            if (!isInvalidTests.insertFrom(input)) {
                functionPropertiesRef.current.insertFrom = input
            }
            setFunctionDisplayValues({...functionDisplayValues})
        },
        insertRange:(input:string) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            functionDisplayValues.insertRange = input
            if (!isInvalidTests.insertRange(input)) {
                functionPropertiesRef.current.insertRange = input
            }
            setFunctionDisplayValues({...functionDisplayValues})
        },
        removeFrom:(input:string) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            functionDisplayValues.removeFrom = input
            if (!isInvalidTests.removeFrom(input)) {
                functionPropertiesRef.current.removeFrom = input
            }
            setFunctionDisplayValues({...functionDisplayValues})
        },
        removeRange:(input:string) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            functionDisplayValues.removeRange = input
            if (!isInvalidTests.removeRange(input)) {
                functionPropertiesRef.current.removeRange = input
            }
            setFunctionDisplayValues({...functionDisplayValues})
        },
        moveFrom:(input:string) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            functionDisplayValues.moveFrom = input
            if (!isInvalidTests.moveFrom(input)) {
                functionPropertiesRef.current.moveFrom = input
            }
            setFunctionDisplayValues({...functionDisplayValues})
        },
        moveRange:(input:string) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            functionDisplayValues.moveRange = input
            if (!isInvalidTests.moveRange(input)) {
                functionPropertiesRef.current.moveRange = input
            }
            setFunctionDisplayValues({...functionDisplayValues})
        },
        moveTo:(input:string) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            functionDisplayValues.moveTo = input
            if (!isInvalidTests.moveTo(input)) {
                functionPropertiesRef.current.moveTo = input
            }
            setFunctionDisplayValues({...functionDisplayValues})
        },
        remapDemo:(event:React.ChangeEvent) => {
            const functionDisplayValues = functionDisplayValuesRef.current
            const target = event.target as HTMLSelectElement
            const value = target.value
            functionDisplayValues.remapDemo = value
            functionPropertiesRef.current.remapDemo = value
            setFunctionDisplayValues({...functionDisplayValues})
        },
    }

    const serviceFuncs = {
        getCacheIndexMap: () => {
            console.log('cacheIndexMap =',functionsObject.getCacheIndexMap())
        },
        getCacheItemMap: () => {
            console.log('cacheItemMap =',functionsObject.getCacheItemMap())
        },
        getCradleIndexMap: () => {
            console.log('cradleIndexMap =',functionsObject.getCradleIndexMap())
        },
    }

    // --------------------------[ state change control ]------------------

    useEffect(()=>{
        switch (optionsState) {
            case 'initializedependencies': {
                dependencyFuncs.contentType(contentTypeRef.current)
                dependencyFuncs.serviceFunctions(operationFunctionRef.current)
                setOptionsState('ready')
                break
            }
            case 'preparetoupdatecontentdependencies': {
                setOptionsState('updatecontentdependencies')
                break
            }
            case 'updatecontentdependencies': {
                dependencyFuncs.contentType(contentTypeRef.current)
                setOptionsState('ready')
                break
            }
            case 'preparetoupdatefunctiondependencies': {
                setOptionsState('updatefunctiondependencies')
                break
            }
            case 'updatefunctiondependencies': {
                dependencyFuncs.serviceFunctions(operationFunctionRef.current)
                setOptionsState('ready')
                break
            }
        }
    },[optionsState, dependencyFuncs])

    // ------------------------------[ render ]------------------------------
    
    return (

    <Box><VStack align = 'start' alignItems = 'stretch'>

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

                        <FormControl isInvalid = {invalidFlags.cellHeight}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>cellHeight:</FormLabel>
                                <NumberInput 
                                    value = {displayValues.cellHeight} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.cellHeight}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.cellHeight}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid = {invalidFlags.cellWidth}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>cellWidth:</FormLabel>
                                <NumberInput 
                                    value = {displayValues.cellWidth} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.cellWidth}
                                    clampValueOnBlur = {false}
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

                        <FormControl 
                            isDisabled = {disabledFlags.cellMinHeight}
                            isInvalid = {invalidFlags.cellMinHeight}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>cellMinHeight:</FormLabel>
                                <NumberInput 
                                    value = {displayValues.cellMinHeight} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.cellMinHeight}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.cellMinHeight}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl 
                            isDisabled = {disabledFlags.cellMinHeight}
                            isInvalid = {invalidFlags.cellMinWidth}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>cellMinWidth:</FormLabel>
                                <NumberInput 
                                    value = {displayValues.cellMinWidth} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.cellMinWidth}
                                    clampValueOnBlur = {false}
                                >
                                        <NumberInputField border = '2px' />
                                    </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.cellMinWidth}
                            </FormErrorMessage>
                        </FormControl>

                    </Stack>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integers (pixels). These only apply to variable layouts. Minimum 25, default 25.
                    </Text>

                    <Heading size = 'xs'>Padding and gaps</Heading>
                    <Stack direction = {['column','row','row']}>

                    <FormControl isInvalid = {invalidFlags.padding} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>padding:</FormLabel>
                            <NumberInput 
                                value = {displayValues.padding} 
                                size = 'sm'
                                onChange = {onChangeFuncs.padding}
                                clampValueOnBlur = {false}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.padding}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {invalidFlags.gap} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>gap:</FormLabel>
                            <NumberInput 
                                value = {displayValues.gap} 
                                size = 'sm'
                                onChange = {onChangeFuncs.gap}
                                clampValueOnBlur = {false}
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
                    
                    <FormControl isInvalid = {invalidFlags.runwaySize} >
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>runwaySize:</FormLabel>
                            <NumberInput 
                                value = {displayValues.runwaySize} 
                                size = 'sm'
                                onChange = {onChangeFuncs.runwaySize}
                                clampValueOnBlur = {false}
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

                    <FormControl isInvalid = {invalidFlags.cacheMax}>
                        <InputGroup size = 'sm' flexGrow = {1.2} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>cacheMax:</FormLabel>
                            <NumberInput 
                                value = {displayValues.cacheMax} 
                                size = 'sm'
                                onChange = {onChangeFuncs.cacheMax}
                                clampValueOnBlur = {false}
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
                        user experience. Select the callbacks you want to activate.
                    </Text>

                    <VStack alignItems = 'start'>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {callbackSettings.referenceIndexCallback} 
                            size = 'sm'
                            mt = {2}
                            id = 'referenceIndexCallback'
                            onChange = {onChangeFuncs.callbackSettings}
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
                            onChange = {onChangeFuncs.callbackSettings}
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
                            onChange = {onChangeFuncs.callbackSettings}
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
                            onChange = {onChangeFuncs.callbackSettings}
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
                            onChange = {onChangeFuncs.callbackSettings}
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
                            onChange = {onChangeFuncs.callbackSettings}
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
                            onChange = {onChangeFuncs.callbackSettings}
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
                            Service functions: snapshots
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

                    <VStack alignItems = 'start'>

                    <FormControl borderTop = '1px'>
                        <Button 
                            size = 'sm' 
                            mt = {2} 
                            type = 'button'
                            onClick = {serviceFuncs.getCacheIndexMap}
                        >
                                Get Cache Index Map
                        </Button>
                        <FormHelperText>
                            snapshot (javascript <Code>Map</Code>) of cache <Code>index</Code> (=key) to 
                            scroller-assigned session <Code>itemID</Code> (=value) map.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Button 
                            size = 'sm' 
                            mt = {2} 
                            type = 'button'
                            onClick = {serviceFuncs.getCacheItemMap}
                        >
                            Get Cache Item Map
                        </Button>
                        <FormHelperText>
                            snapshot (javascript <Code>Map</Code>) of cache <Code>itemID</Code> (=key) to 
                            object (=value) map. Object = {"{"}index, component{"}"} where component = user component.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Button 
                            size = 'sm' 
                            mt = {2} 
                            type = 'button'
                            onClick = {serviceFuncs.getCradleIndexMap}
                        >
                            Get Cradle Index Map
                        </Button>
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
                            Service functions: operations
                        </Box>
                        <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    <Text paddingBottom = {2} mb = {2} borderBottom = '1px'>
                        Perform these functions one at a time. Enable the function of choice, then hit the Apply
                        button. Most of these functions provide feedback in the browser console. The feedback can 
                        be used by apps.
                    </Text>

                    <VStack alignItems = 'start'>

                    <Heading size = 'xs'>Go to</Heading>
                    <HStack alignItems = 'baseline'>

                        <FormControl 
                            isDisabled = {disabledFlags.gotoIndex}
                            isInvalid = {invalidFlags.gotoIndex}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>index:</FormLabel>
                                <NumberInput 
                                    value = {functionDisplayValues.gotoIndex} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.gotoIndex}
                                    clampValueOnBlur = {false}
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
                                    isChecked = {functionEnbledSettings.goto} 
                                    onChange = {onChangeFuncs.onChangeEnabler} 
                                    id='goto' 
                                />
                            </InputGroup>
                            <FormErrorMessage>
                            something
                            </FormErrorMessage>
                        </FormControl>

                    </HStack>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. Go to the specified index number in the virtual list.
                    </Text>

                    <Heading size = 'xs'>Change virtual list size</Heading>
                    <HStack alignItems = 'baseline'>

                        <FormControl 
                            isDisabled = {disabledFlags.listsize}
                            isInvalid = {invalidFlags.listsize} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>size:</FormLabel>
                                <NumberInput 
                                    value = {functionDisplayValues.listsize} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.listsize}
                                    clampValueOnBlur = {false}
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
                                    isChecked = {functionEnbledSettings.listsize} 
                                    onChange = {onChangeFuncs.onChangeEnabler} 
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
                                isChecked = {functionEnbledSettings.reload} 
                                onChange = {onChangeFuncs.onChangeEnabler} 
                                id='reload' 
                            />
                        </InputGroup>
                        <FormHelperText>
                            This clears the cache reloads the cradle at its current position.
                        </FormHelperText>
                    </FormControl>

                    <Heading size = 'xs'>Insert indexes</Heading>
                    <Stack direction = {['column','row','row']}>

                        <FormControl 
                            isDisabled = {disabledFlags.insertFrom}
                            isInvalid = {invalidFlags.insertFrom} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>from:</FormLabel>
                                <NumberInput 
                                    value = {functionDisplayValues.insertFrom} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.insertFrom}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.insertFrom}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl 
                            isDisabled = {disabledFlags.insertRange}
                            isInvalid = {invalidFlags.insertRange} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>range:</FormLabel>
                                <NumberInput 
                                    value = {functionDisplayValues.insertRange} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.insertRange}
                                    clampValueOnBlur = {false}
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
                                isChecked = {functionEnbledSettings.insert} 
                                onChange = {onChangeFuncs.onChangeEnabler} 
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

                        <FormControl 
                            isDisabled = {disabledFlags.removeFrom}
                            isInvalid = {invalidFlags.removeFrom} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>from:</FormLabel>
                                <NumberInput 
                                    value = {functionDisplayValues.removeFrom} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.removeFrom}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.removeFrom}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl 
                            isDisabled = {disabledFlags.removeRange}
                            isInvalid = {invalidFlags.removeRange} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                                <FormLabel fontSize = 'sm'>range:</FormLabel>
                                <NumberInput 
                                    value = {functionDisplayValues.removeRange} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.removeRange}
                                    clampValueOnBlur = {false}
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
                                isChecked = {functionEnbledSettings.remove} 
                                onChange = {onChangeFuncs.onChangeEnabler} 
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

                    <FormControl 
                        isDisabled = {disabledFlags.moveFrom}
                        isInvalid = {invalidFlags.moveFrom} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>from:</FormLabel>
                            <NumberInput 
                                value = {functionDisplayValues.moveFrom} 
                                size = 'sm'
                                onChange = {onChangeFuncs.moveFrom}
                                clampValueOnBlur = {false}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.moveFrom}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl 
                        isDisabled = {disabledFlags.moveRange}
                        isInvalid = {invalidFlags.moveRange} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>range:</FormLabel>
                            <NumberInput 
                                value = {functionDisplayValues.moveRange} 
                                size = 'sm'
                                onChange = {onChangeFuncs.moveRange}
                                clampValueOnBlur = {false}
                           >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.moveRange}
                        </FormErrorMessage>
                    </FormControl>

                    </Stack>

                    <FormControl 
                        isDisabled = {disabledFlags.moveTo}
                        isInvalid = {invalidFlags.moveTo} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>to:</FormLabel>
                            <NumberInput 
                                value = {functionDisplayValues.moveTo} 
                                size = 'sm'
                                onChange = {onChangeFuncs.moveTo}
                                clampValueOnBlur = {false}
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
                                isChecked = {functionEnbledSettings.move} 
                                onChange = {onChangeFuncs.onChangeEnabler} 
                                id='move' 
                            />
                        </InputGroup>
                    </FormControl>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integers. Move one or more indexes. 'range' is optional, and must be equal to or 
                        above the 'from' value.
                    </Text> 

                    <Heading size = 'xs'>Remap indexes</Heading>
                    <Stack direction = {['column','row','row']} alignItems = 'baseline'>

                    <FormControl isDisabled = {disabledFlags.remapDemo}>
                        <Select 
                            value = {displayValues.remapDemo} 
                            size = 'sm'
                            onChange = {onChangeFuncs.remapDemo}
                        >
                            <option value="backwardsort">Backward sort</option>
                            <option value="test2">Test 2</option>
                            <option value="test3">Test 3</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='remap' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch 
                                isChecked = {functionEnbledSettings.remap} 
                                onChange = {onChangeFuncs.onChangeEnabler} 
                                id='remap' 
                            />
                        </InputGroup>
                    </FormControl>

                    </Stack>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        The remap function takes as input a map of indexes to scroller-assigned itemID's, and moves the
                        items to the newly assigned indexes. We've included a few random tests that apply to 
                        the cradle. For purposes of this demo the new mappings are 'forgotten' when the moved
                        items scroll out of scope.
                    </Text>

                    <FormControl>
                        <FormLabel size = 'sm'>Clear the cache</FormLabel>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>
                            <FormLabel htmlFor='clear' fontSize = 'sm'>
                                Enable
                            </FormLabel>
                            <Switch 
                                isChecked = {functionEnbledSettings.clear} 
                                onChange = {onChangeFuncs.onChangeEnabler} 
                                id='clear' 
                            />
                        </InputGroup>
                    </FormControl>

                    <Text fontSize = 'sm' paddingBottom = {2}>
                        This clears the cache (and therefore the cradle). Not very interesting.
                    </Text>

                    </VStack>
                </AccordionPanel>

            </AccordionItem>

        </Accordion>

    </VStack></Box>)
}

export default Options