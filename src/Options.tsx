// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

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

    return ( 
        (!isNaN(Number(value))) && 
        (!isNaN(parseInt(value))) 
    )

}

const isInteger = (value:any) => {

    const test = +value

    return (isNumber(value) && (Math.floor(test) == test))

}

const minValue = (value:any, minValue:any) => {

    if (!isInteger(value) || !isInteger(minValue)) return false

    const testvalue = +value
    const testMinValue = +minValue

    return testvalue >= testMinValue

}

const maxValue = (value:any, maxValue:any) => {

    if (!isInteger(value) || !isInteger(maxValue)) return false

    const testvalue = +value
    const testMaxValue = +maxValue

    return testvalue <= testMaxValue

}

// ------------------------[ static field data ]----------------------

// display error messages
const errorMessages = { 
    // string selection, no errors
    cellHeight:'integer: cellHeight is required with minimum of 25',
    cellWidth:'integer: cellWidth is required with minimum 25',
    cellMinHeight:'blank, or integer minimum 25 and less than or equal to cellHeight',
    cellMinWidth:'blank, or integer minimum 25 and less than or equal to cellWidth',
    startingIndex:'blank, or integer greater than or equal to 0',
    estimatedListSize:'integer: required, with minimum 0',
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

const dependentFields = [
    'gotoIndex',
    'listsize',
    'insertFrom', 'insertRange',
    'removeFrom', 'removeRange',
    'moveFrom', 'moveRange', 'moveTo',
    'remapDemo',
]

// Options component; almost 40 fields
const Options = ({

    sessionAllContentTypePropertiesRef, 
    sessionContentTypeRef, 
    sessionCallbackSettingsRef, 
    sessionOperationFunctionRef, 
    sessionFunctionPropertiesRef,
    functionsObjectRef,

}:GenericObject) => {
 
    // -------------------------[ state updates ]------------------------

    // inherited scroller service functions
    const functionsObject = functionsObjectRef.current

    // component state
    const [optionsState, setOptionsState] = useState('initialize-dependencies')

    // simple values
    const [editContentType, setEditContentType] = useState(sessionContentTypeRef.current)
    const editContentTypeRef = useRef(sessionContentTypeRef.current)

    const [editOperationFunction, setEditOperationFunction] = useState(sessionOperationFunctionRef.current)
    const editOperationFunctionRef = useRef(sessionOperationFunctionRef.current)
    editOperationFunctionRef.current = editOperationFunction

    // objects. The local values are used to assign valid edits to the inherited values
    const [editContentTypeProperties, setEditContentTypeProperties] = useState({...sessionAllContentTypePropertiesRef.current[editContentType]})
    const editContentTypePropertiesRef = useRef(editContentTypeProperties)
    editContentTypePropertiesRef.current = editContentTypeProperties

    const [editCallbackSettings, setEditCallbackSettings] = useState({...sessionCallbackSettingsRef.current})
    
    const [editFunctionProperties, setEditFunctionProperties] = useState({...sessionFunctionPropertiesRef.current})
    const editFunctionPropertiesRef = useRef(editFunctionProperties)
    editFunctionPropertiesRef.current = editFunctionProperties


    // --------------------------------[ internal mutable field data ]-----------------------------

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

    // invalid flags
    const invalidFlagsRef = useRef<GenericObject>(
        {
            contentType:false,
            orientation:false,
            cellHeight:false,
            cellWidth:false,
            cellMinHeight:false,
            cellMinWidth:false,
            startingIndex:false,
            estimatedListSize:false,
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

    const functionEnabledSettings = functionEnabledSettingsRef.current

    // -----------------------------------[ field functions ]------------------------------

    // display value error check functions
    const isInvalidTests = {
        cellHeight:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 25))
            invalidFlags.cellHeight = isInvalid
            if (!disabledFlags.cellMinHeight) {
                isInvalidTests.cellMinHeight(editContentTypePropertiesRef.current.cellMinHeight)
            }
            return isInvalid
        },
        cellWidth:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 25))
            invalidFlags.cellWidth = isInvalid
            if (!disabledFlags.cellMinWidth) {
                isInvalidTests.cellMinWidth(editContentTypePropertiesRef.current.cellMinWidth)
            }
            return isInvalid
        },
        cellMinHeight:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = (!minValue(value,25) || !(maxValue(value, editContentTypePropertiesRef.current.cellHeight)))
            }
            invalidFlags.cellMinHeight = isInvalid
            return isInvalid
        },
        cellMinWidth:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = (!minValue(value,25) || !(maxValue(value, editContentTypePropertiesRef.current.cellWidth)))
            }
            invalidFlags.cellMinWidth = isInvalid
            return isInvalid
        },
        startingIndex:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,0)
            }
            invalidFlags.startingIndex = isInvalid
            return isInvalid
        },
        estimatedListSize:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.estimatedListSize = isInvalid
            return isInvalid
        },
        padding:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,0)
            }
            invalidFlags.padding = isInvalid
            return isInvalid
        },
        gap:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,0)
            }
            invalidFlags.gap = isInvalid
            return isInvalid
        },
        runwaySize:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,1)
            }
            invalidFlags.runwaySize = isInvalid
            return isInvalid
        },
        cacheMax:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,0)
            }
            invalidFlags.cacheMax = isInvalid
            return isInvalid
        },
        gotoIndex:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.gotoIndex = isInvalid
            return isInvalid
        },
        listsize:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.listsize = isInvalid
            return isInvalid
        },
        insertFrom:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.insertFrom = isInvalid
            isInvalidTests.insertRange(editFunctionPropertiesRef.current.insertRange)
            return isInvalid
        },
        insertRange:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,editFunctionPropertiesRef.current.insertFrom)
            }
            invalidFlags.insertRange = isInvalid
            return isInvalid
        },
        removeFrom:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.removeFrom = isInvalid
            isInvalidTests.removeRange(editFunctionPropertiesRef.current.removeRange)
            return isInvalid
        },
        removeRange:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,editFunctionPropertiesRef.current.removeFrom)
            }
            invalidFlags.removeRange = isInvalid
            return isInvalid
        },
        moveFrom:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.moveFrom = isInvalid
            isInvalidTests.moveRange(editFunctionPropertiesRef.current.moveRange)
            return isInvalid
        },
        moveRange:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,editFunctionPropertiesRef.current.moveFrom)
            }
            invalidFlags.moveRange = isInvalid
            return isInvalid
        },
        moveTo:(value:string) => {
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
                isInvalidTests.cellMinHeight(editContentTypePropertiesRef.current.cellMinHeight)
                isInvalidTests.cellMinWidth(editContentTypePropertiesRef.current.cellMinWidth)

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
            for (const field of dependentFields) {
                disabledFlags[field] = true
                if (invalidFlags[field]) {
                    invalidFlags[field] = false
                    editFunctionPropertiesRef.current[field] = sessionFunctionPropertiesRef.current[field]
                }
            }
            if (service) {
                switch (service) {
                    case 'goto':{
                        disabledFlags.gotoIndex = false
                        isInvalidTests.gotoIndex(editFunctionPropertiesRef.current.gotoIndex)
                        break
                    }
                    case 'listsize':{
                        disabledFlags.listsize = false
                        isInvalidTests.listsize(editFunctionPropertiesRef.current.listsize)
                        break
                    }
                    case 'reload':{

                        break
                    }
                    case 'insert':{
                        disabledFlags.insertFrom = false
                        disabledFlags.insertRange = false
                        isInvalidTests.insertFrom(editFunctionPropertiesRef.current.insertFrom)
                        isInvalidTests.insertRange(editFunctionPropertiesRef.current.insertRange)
                        break
                    }
                    case 'remove':{
                        disabledFlags.removeFrom = false
                        disabledFlags.removeRange = false
                        isInvalidTests.removeFrom(editFunctionPropertiesRef.current.removeFrom)
                        isInvalidTests.removeRange(editFunctionPropertiesRef.current.removeRange)
                        break
                    }
                    case 'move':{
                        disabledFlags.moveFrom = false
                        disabledFlags.moveRange = false
                        disabledFlags.moveTo = false
                        isInvalidTests.moveFrom(editFunctionPropertiesRef.current.moveFrom)
                        isInvalidTests.moveRange(editFunctionPropertiesRef.current.moveRange)
                        isInvalidTests.moveTo(editFunctionPropertiesRef.current.moveTo)
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
            setEditFunctionProperties({...editFunctionPropertiesRef.current})
        }

    }

    // display on change functions
    const onChangeFuncs = {

        // update scroller service function switch settings
        onChangeEnabler:(event:React.ChangeEvent) => {
            const target = event.target as HTMLInputElement
            const enablerID = target.id
            const enablerValue = target.checked
            for (const prop in functionEnabledSettings) {
                functionEnabledSettings[prop] = false
            }
            functionEnabledSettings[enablerID] = enablerValue
            const opfunc = 
                enablerValue?
                    enablerID:
                    ''
            sessionOperationFunctionRef.current = opfunc
            setEditOperationFunction(opfunc)
            setOptionsState('prepare-to-update-function-dependencies')
        },

        // contentType global switch
        contentType:(event:React.ChangeEvent) => {
            const target = event.target as HTMLSelectElement
            const value = target.value
            sessionContentTypeRef.current = value
            // change property set to correspond with content type
            setEditContentTypeProperties({...sessionAllContentTypePropertiesRef.current[value]})
            sessionContentTypeRef.current = value
            setEditContentType(value)
            setOptionsState('prepare-to-update-content-dependencies')
        },

        // callback handling
        callbackSettings:(event:React.ChangeEvent) => {
            const target = event.target as HTMLInputElement
            const callbackID = target.id
            const callbackValue = target.checked
            const callbackSettings = sessionCallbackSettingsRef.current
            callbackSettings[callbackID] = callbackValue
            setEditCallbackSettings({...callbackSettings})            
        },

        // individual values
        orientation:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.orientation = input
            const newSessionProperties = 
                {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],orientation:input}
            sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            setEditContentTypeProperties({...editProperties})
        },
        cellHeight:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.cellHeight = input
            if (!isInvalidTests.cellHeight(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],cellHeight:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        cellWidth:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.cellWidth = input
            if (!isInvalidTests.cellWidth(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],cellWidth:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        cellMinHeight:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.cellMinHeight = input
            if (!isInvalidTests.cellMinHeight(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],cellMinHeight:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        cellMinWidth:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.cellMinWidth = input
            if (!isInvalidTests.cellMinWidth(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],cellMinWidth:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        startingIndex:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.startingIndex = input
            if (!isInvalidTests.startingIndex(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],startingIndex:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        estimatedListSize:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.estimatedListSize = input
            if (!isInvalidTests.estimatedListSize(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],estimatedListSize:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        padding:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.padding = input
            if (!isInvalidTests.padding(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],padding:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        gap:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.gap = input
            if (!isInvalidTests.gap(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],gap:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        runwaySize:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.runwaySize = input
            if (!isInvalidTests.runwaySize(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],runwaySize:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        cache:(event:React.ChangeEvent) => {
            const editProperties = editContentTypePropertiesRef.current
            const target = event.target as HTMLSelectElement
            const value = target.value
            editProperties.cache = value
            const newDisplayValues = 
                {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],cache:value}
            sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newDisplayValues
            setEditContentTypeProperties({...editProperties})
        },
        cacheMax:(input:string) => {
            const editProperties = editContentTypePropertiesRef.current
            editProperties.cacheMax = input
            if (!isInvalidTests.cacheMax(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current],cacheMax:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editProperties})
        },
        gotoIndex:(input:string) => {
            const editProperties = editFunctionPropertiesRef.current
            editProperties.gotoIndex = input
            if (!isInvalidTests.gotoIndex(input)) {
                sessionFunctionPropertiesRef.current.gotoIndex = input
            }
            setEditFunctionProperties({...editProperties})
        },
        listsize:(input:string) => {
            const editProperties = editFunctionPropertiesRef.current
            editProperties.listsize = input
            if (!isInvalidTests.listsize(input)) {
                sessionFunctionPropertiesRef.current.listsize = input
            }
            setEditFunctionProperties({...editProperties})
        },
        insertFrom:(input:string) => {
            const editProperties = editFunctionPropertiesRef.current
            editProperties.insertFrom = input
            if (!isInvalidTests.insertFrom(input)) {
                sessionFunctionPropertiesRef.current.insertFrom = input
            }
            setEditFunctionProperties({...editProperties})
        },
        insertRange:(input:string) => {
            const editProperties = editFunctionPropertiesRef.current
            editProperties.insertRange = input
            if (!isInvalidTests.insertRange(input)) {
                sessionFunctionPropertiesRef.current.insertRange = input
            }
            setEditFunctionProperties({...editProperties})
        },
        removeFrom:(input:string) => {
            const editProperties = editFunctionPropertiesRef.current
            editProperties.removeFrom = input
            if (!isInvalidTests.removeFrom(input)) {
                sessionFunctionPropertiesRef.current.removeFrom = input
            }
            setEditFunctionProperties({...editProperties})
        },
        removeRange:(input:string) => {
            const editProperties = editFunctionPropertiesRef.current
            editProperties.removeRange = input
            if (!isInvalidTests.removeRange(input)) {
                sessionFunctionPropertiesRef.current.removeRange = input
            }
            setEditFunctionProperties({...editProperties})
        },
        moveFrom:(input:string) => {
            const editProperties = editFunctionPropertiesRef.current
            editProperties.moveFrom = input
            if (!isInvalidTests.moveFrom(input)) {
                sessionFunctionPropertiesRef.current.moveFrom = input
            }
            setEditFunctionProperties({...editProperties})
        },
        moveRange:(input:string) => {
            const editProperties = editFunctionPropertiesRef.current
            editProperties.moveRange = input
            if (!isInvalidTests.moveRange(input)) {
                sessionFunctionPropertiesRef.current.moveRange = input
            }
            setEditFunctionProperties({...editProperties})
        },
        moveTo:(input:string) => {
            const editProperties = editFunctionPropertiesRef.current
            editProperties.moveTo = input
            if (!isInvalidTests.moveTo(input)) {
                sessionFunctionPropertiesRef.current.moveTo = input
            }
            setEditFunctionProperties({...editProperties})
        },
        remapDemo:(event:React.ChangeEvent) => {
            const editProperties = editFunctionPropertiesRef.current
            const target = event.target as HTMLSelectElement
            const value = target.value
            editProperties.remapDemo = value
            sessionFunctionPropertiesRef.current.remapDemo = value
            setEditFunctionProperties({...editProperties})
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
            case 'initialize-dependencies': {
                dependencyFuncs.contentType(sessionContentTypeRef.current)
                dependencyFuncs.serviceFunctions(sessionOperationFunctionRef.current)
                setOptionsState('ready')
                break
            }
            case 'prepare-to-update-content-dependencies': {
                setOptionsState('update-content-dependencies')
                break
            }
            case 'update-content-dependencies': {
                dependencyFuncs.contentType(sessionContentTypeRef.current)
                setOptionsState('ready')
                break
            }
            case 'prepare-to-update-function-dependencies': {
                setOptionsState('update-function-dependencies')
                break
            }
            case 'update-function-dependencies': {
                dependencyFuncs.serviceFunctions(sessionOperationFunctionRef.current)
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
                value = {editContentType} 
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
                            value = {editContentTypeProperties.orientation} 
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
                                    value = {editContentTypeProperties.cellHeight} 
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
                                    value = {editContentTypeProperties.cellWidth} 
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
                                    value = {editContentTypeProperties.cellMinHeight} 
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
                                    value = {editContentTypeProperties.cellMinWidth} 
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

                    <Heading size = 'xs'>Starting index</Heading>
                    
                    <FormControl isInvalid = {invalidFlags.startingIndex} >
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>startingIndex:</FormLabel>
                            <NumberInput 
                                value = {editContentTypeProperties.startingIndex} 
                                size = 'sm'
                                onChange = {onChangeFuncs.startingIndex}
                                clampValueOnBlur = {false}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        </HStack>
                        <FormErrorMessage>
                            {errorMessages.startingIndex}
                        </FormErrorMessage>
                    </FormControl>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. This will only apply right after a content type change. It will 
                        set the starting index of the session for the content type. See also
                        'Go to index' in the 'Service functions: operations' section.
                    </Text>

                    <Heading size = 'xs'>Estimated list size</Heading>
                    
                    <FormControl isInvalid = {invalidFlags.estimatedListSize} >
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>estimatedListSize:</FormLabel>
                            <NumberInput 
                                value = {editContentTypeProperties.estimatedListSize} 
                                size = 'sm'
                                onChange = {onChangeFuncs.estimatedListSize}
                                clampValueOnBlur = {false}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        </HStack>
                        <FormErrorMessage>
                            {errorMessages.estimatedListSize}
                        </FormErrorMessage>
                    </FormControl>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. This will only apply right after a content type change. It will 
                        set the starting list size of the session for the content type. See also
                        'Change virtual list size' in the 'Service functions: operations' section.
                    </Text>

                    <Heading size = 'xs'>Padding and gaps</Heading>
                    <Stack direction = {['column','row','row']}>

                    <FormControl isInvalid = {invalidFlags.padding} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>padding:</FormLabel>
                            <NumberInput 
                                value = {editContentTypeProperties.padding} 
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
                                value = {editContentTypeProperties.gap} 
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
                                value = {editContentTypeProperties.runwaySize} 
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
                            value = {editContentTypeProperties.cache} 
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
                                value = {editContentTypeProperties.cacheMax} 
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
                            isChecked = {editCallbackSettings.referenceIndexCallback} 
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
                            isChecked = {editCallbackSettings.preloadIndexCallback} 
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
                            isChecked = {editCallbackSettings.itemExceptionCallback} 
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
                            isChecked = {editCallbackSettings.repositioningFlagCallback} 
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
                            isChecked = {editCallbackSettings.repositioningIndexCallback} 
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
                            isChecked = {editCallbackSettings.changeListsizeCallback} 
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
                            isChecked = {editCallbackSettings.deleteListCallback} 
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
                                    value = {editFunctionProperties.gotoIndex} 
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
                                    isChecked = {functionEnabledSettings.goto} 
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
                                    value = {editFunctionProperties.listsize} 
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
                                    isChecked = {functionEnabledSettings.listsize} 
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
                                isChecked = {functionEnabledSettings.reload} 
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
                                    value = {editFunctionProperties.insertFrom} 
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
                                    value = {editFunctionProperties.insertRange} 
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
                                isChecked = {functionEnabledSettings.insert} 
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
                                    value = {editFunctionProperties.removeFrom} 
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
                                    value = {editFunctionProperties.removeRange} 
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
                                isChecked = {functionEnabledSettings.remove} 
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
                                value = {editFunctionProperties.moveFrom} 
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
                                value = {editFunctionProperties.moveRange} 
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
                                value = {editFunctionProperties.moveTo} 
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
                                isChecked = {functionEnabledSettings.move} 
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
                            value = {editContentTypeProperties.remapDemo} 
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
                                isChecked = {functionEnabledSettings.remap} 
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
                                isChecked = {functionEnabledSettings.clear} 
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