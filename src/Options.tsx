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

const sectionTitles:GenericObject = {
  properties:'Properties for the selected content type',
  callbacks:'Callbacks',
  snapshots:'Service functions: snapshots',
  operations:'Service functions: operations',
}

const fieldSections:GenericObject = {

    cellHeight:'properties',
    cellWidth:'properties',
    cellMinHeight:'properties',
    cellMinWidth:'properties',
    startingIndex:'properties',
    startingListSize:'properties',
    padding:'properties',
    gap:'properties',
    runwaySize:'properties',
    cacheMax:'properties',
    scrolltoIndex:'operations',
    listsize:'operations',
    listLowIndex:'operations',
    listHighIndex:'operations',
    insertFrom:'operations',
    insertRange:'operations',
    removeFrom:'operations',
    removeRange:'operations',
    moveFrom:'operations',
    moveRange:'operations',
    moveTo:'operations',

}


// display error messages
const errorMessages = { 
    // string selection, no errors
    cellHeight:'integer: cellHeight is required with minimum of 25',
    cellWidth:'integer: cellWidth is required with minimum 25',
    cellMinHeight:'blank, or integer minimum 25 and less than or equal to cellHeight',
    cellMinWidth:'blank, or integer minimum 25 and less than or equal to cellWidth',
    startingIndex:'blank, or integer greater than or equal to listlowindex',
    startingListSize:'integer: required, with minimum 0',
    startingListLowIndex:'integer: optional',
    startingListHighIndex:'integer: optional, must be greater than or equal to low index if present',
    padding:'blank, or integer greater than or equal to 0',
    gap:'blank, or integeer greater than or equal to 0',
    runwaySize:'blank, or integer minimum 1',
    cacheMax:'blank, or integer greater than or equal to 0',
    scrolltoIndex:'integer: required, greater than or equal to listlowindex',
    listsize:'integer: required, greater than or equal to 0',
    listLowIndex:'integer: required',
    listHighIndex:'integer:required, greater than or equal to low index',
    insertFrom:'integer: required, greater than or equal to listlowindex',
    insertRange:'blank, or integer greater than or equal to the "from" index',
    removeFrom:'integer: required, greater than or equal to listlowindex',
    removeRange:'blank, or integer greater than or equal to the "from" index',
    moveFrom:'integer: required, greater than or equal to listlowindex',
    moveRange:'blank, or integer greater than or equal to the "from" index',
    moveTo:'integer: required, greater than or equal to listlowindex',
}

const dependentFields = [
    'scrolltoIndex',
    'listsize',
    'listLowIndex','listHighIndex',
    'insertFrom', 'insertRange',
    'removeFrom', 'removeRange',
    'moveFrom', 'moveRange', 'moveTo',
    'remapDemo',
]

// Options component; about 40 fields
const Options = ({

    sessionContentTypeSelectorRef, 
    sessionAllContentTypePropertiesRef, 

    sessionCallbackFlagsRef, 

    sessionOperationFunctionSelectorRef, 
    sessionAPIFunctionArgumentsRef,

    functionsAPIRef,
    optionsAPIRef,

}:GenericObject) => {
 
    // -------------------------[ state updates ]------------------------

    // inherited scroller service functions
    const functionsAPI = functionsAPIRef.current

    const indexRangeRef = useRef([])
    const scrollerProps = functionsAPIRef.current.getPropertiesSnapshot()
    indexRangeRef.current = scrollerProps.virtualListProps.range
    const [listlowindex, listhighindex] = indexRangeRef.current

    // component state
    const [optionsState, setOptionsState] = useState('initialize-dependencies')

    // simple values
    const [editContentTypeSelector, setEditContentTypeSelector] = useState(sessionContentTypeSelectorRef.current)

    const [editOperationFunctionSelector, setEditOperationFunctionSelector] = 
        useState(sessionOperationFunctionSelectorRef.current)

    const editOperationFunctionSelectorRef = useRef(sessionOperationFunctionSelectorRef.current)
    editOperationFunctionSelectorRef.current = editOperationFunctionSelector

    // objects. The local values are used to assign valid edits to the inherited values
    const [editContentTypeProperties, setEditContentTypeProperties] = 
        useState({...sessionAllContentTypePropertiesRef.current[editContentTypeSelector]})
    const editContentTypePropertiesRef = useRef(editContentTypeProperties)
    editContentTypePropertiesRef.current = editContentTypeProperties

    const [editCallbackFlags, setEditCallbackFlags] = useState({...sessionCallbackFlagsRef.current})
    
    const [editAPIFunctionArguments, setEditAPIFunctionArguments] = useState({...sessionAPIFunctionArgumentsRef.current})
    const editAPIFunctionArgumentsRef = useRef(editAPIFunctionArguments)
    editAPIFunctionArgumentsRef.current = editAPIFunctionArguments

    // --------------------------------[ internal mutable field data ]-----------------------------

    // disabled controls
    const disabledFlagsRef = useRef<GenericObject>(
        {
            cellMinHeight:false,
            cellMinWidth:false,
            scrolltoIndex:false,
            listsize:false,
            listLowIndex:false,
            listHighIndex:false,
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
            startingListSize:false,
            padding:false,
            gap:false,
            runwaySize:false,
            cache:false,
            cacheMax:false,
            scrolltoIndex:false,
            listsize:false,
            listLowIndex:false,
            listHighIndex:false,
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

    // test forwarded to host; returns text list of invalid section titles for display to user
    const getInvalidSections = () => {

        const sections = new Set<string>()
        const errorfields = invalidFlagsRef.current
        for (const field in invalidFlagsRef.current) {
            if (errorfields[field]) {
                sections.add(fieldSections[field])
            }
        }
        const sectionSet = new Set()
        sections.forEach((value) => {
            sectionSet.add(sectionTitles[value])
        }) 
        return sectionSet

    }

    useEffect(()=>{

        optionsAPIRef.current = {
            getInvalidSections
        }
        
    },[])

    // scroller function switch settings
    const functionEnabledSettingsRef = useRef<GenericObject>({
        goto:false,
        listsize:false,
        listrange:false,
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
                isInvalid = !minValue(value,listlowindex)
            }
            invalidFlags.startingIndex = isInvalid
            return isInvalid
        },
        startingListSize:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.startingListSize = isInvalid
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
        scrolltoIndex:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, listlowindex))
            invalidFlags.scrolltoIndex = isInvalid
            return isInvalid
        },
        listsize:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, 0))
            invalidFlags.listsize = isInvalid
            return isInvalid
        },
        listLowIndex:(value:string) => {
            const isInvalid = !isInteger(value)
            invalidFlags.listLowIndex = isInvalid
            isInvalidTests.listHighIndex(editAPIFunctionArgumentsRef.current.listHighIndex)
            return isInvalid
        },
        listHighIndex:(value:string) => {
            let isInvalid = !isInteger(value)
            if (!isInvalid) {
                isInvalid = !minValue(value,editAPIFunctionArgumentsRef.current.insertFrom)
            }
            invalidFlags.listHighIndex = isInvalid
            return isInvalid
        },
        insertFrom:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, listlowindex))
            invalidFlags.insertFrom = isInvalid
            isInvalidTests.insertRange(editAPIFunctionArgumentsRef.current.insertRange)
            return isInvalid
        },
        insertRange:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,editAPIFunctionArgumentsRef.current.insertFrom)
            }
            invalidFlags.insertRange = isInvalid
            return isInvalid
        },
        removeFrom:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, listlowindex))
            invalidFlags.removeFrom = isInvalid
            isInvalidTests.removeRange(editAPIFunctionArgumentsRef.current.removeRange)
            return isInvalid
        },
        removeRange:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,editAPIFunctionArgumentsRef.current.removeFrom)
            }
            invalidFlags.removeRange = isInvalid
            return isInvalid
        },
        moveFrom:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, listlowindex))
            invalidFlags.moveFrom = isInvalid
            isInvalidTests.moveRange(editAPIFunctionArgumentsRef.current.moveRange)
            return isInvalid
        },
        moveRange:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !minValue(value,editAPIFunctionArgumentsRef.current.moveFrom)
            }
            invalidFlags.moveRange = isInvalid
            return isInvalid
        },
        moveTo:(value:string) => {
            const isInvalid = (!isInteger(value) || !minValue(value, listlowindex))
            invalidFlags.moveTo = isInvalid
            return isInvalid
        },
    }

    const updateDependenciesFunctions = {
        contentType:(value:string) => {

            let disabled
            if (['variablecontent','variablepromises','variabledynamic','variableoversized'].includes(value)) {

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
                    editAPIFunctionArgumentsRef.current[field] = sessionAPIFunctionArgumentsRef.current[field]
                }
            }
            if (service) {
                switch (service) {
                    case 'goto':{
                        disabledFlags.scrolltoIndex = false
                        isInvalidTests.scrolltoIndex(editAPIFunctionArgumentsRef.current.scrolltoIndex)
                        break
                    }
                    case 'listsize':{
                        disabledFlags.listsize = false
                        isInvalidTests.listsize(editAPIFunctionArgumentsRef.current.listsize)
                        break
                    }
                    case 'reload':{

                        break
                    }
                    case 'insert':{
                        disabledFlags.insertFrom = false
                        disabledFlags.insertRange = false
                        isInvalidTests.insertFrom(editAPIFunctionArgumentsRef.current.insertFrom)
                        isInvalidTests.insertRange(editAPIFunctionArgumentsRef.current.insertRange)
                        break
                    }
                    case 'remove':{
                        disabledFlags.removeFrom = false
                        disabledFlags.removeRange = false
                        isInvalidTests.removeFrom(editAPIFunctionArgumentsRef.current.removeFrom)
                        isInvalidTests.removeRange(editAPIFunctionArgumentsRef.current.removeRange)
                        break
                    }
                    case 'move':{
                        disabledFlags.moveFrom = false
                        disabledFlags.moveRange = false
                        disabledFlags.moveTo = false
                        isInvalidTests.moveFrom(editAPIFunctionArgumentsRef.current.moveFrom)
                        isInvalidTests.moveRange(editAPIFunctionArgumentsRef.current.moveRange)
                        isInvalidTests.moveTo(editAPIFunctionArgumentsRef.current.moveTo)
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
            setEditAPIFunctionArguments({...editAPIFunctionArgumentsRef.current})
        }

    }

    // display on change functions
    const onChangeFuncs = {

        showAxis:(event:React.ChangeEvent) => {
            const target = event.target as HTMLInputElement
            const value = target.checked

            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.technical.showAxis = value
            sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current].technicalshowAxis = value
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },

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
            sessionOperationFunctionSelectorRef.current = opfunc
            setEditOperationFunctionSelector(opfunc)
            setOptionsState('prepare-to-update-function-dependencies')
        },

        // contentType global switch
        contentType:(event:React.ChangeEvent) => {
            const target = event.target as HTMLSelectElement
            const value = target.value
            sessionContentTypeSelectorRef.current = value
            // change property set to correspond with content type
            setEditContentTypeProperties({...sessionAllContentTypePropertiesRef.current[value]})
            sessionContentTypeSelectorRef.current = value
            setEditContentTypeSelector(value)
            setOptionsState('prepare-to-update-content-dependencies')
        },

        // callback handling
        callbackSettings:(event:React.ChangeEvent) => {
            const target = event.target as HTMLInputElement
            const callbackID = target.id
            const callbackValue = target.checked
            const callbackSettings = sessionCallbackFlagsRef.current
            callbackSettings[callbackID] = callbackValue
            setEditCallbackFlags({...callbackSettings})            
        },

        // individual values
        orientation:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.orientation = input
            const newSessionProperties = 
                {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],orientation:input}
            sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        cellHeight:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.cellHeight = input
            if (!isInvalidTests.cellHeight(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cellHeight:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        cellWidth:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.cellWidth = input
            if (!isInvalidTests.cellWidth(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cellWidth:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        cellMinHeight:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.cellMinHeight = input
            if (!isInvalidTests.cellMinHeight(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cellMinHeight:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        cellMinWidth:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.cellMinWidth = input
            if (!isInvalidTests.cellMinWidth(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cellMinWidth:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        startingIndex:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.startingIndex = input
            if (!isInvalidTests.startingIndex(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],startingIndex:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        startingListSize:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.startingListSize = input
            if (!isInvalidTests.startingListSize(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],startingListSize:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        padding:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.padding = input
            if (!isInvalidTests.padding(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],padding:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        gap:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.gap = input
            if (!isInvalidTests.gap(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],gap:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        runwaySize:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.runwaySize = input
            if (!isInvalidTests.runwaySize(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],runwaySize:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        cache:(event:React.ChangeEvent) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            const target = event.target as HTMLSelectElement
            const value = target.value
            editAPIFunctionArguments.cache = value
            const newDisplayValues = 
                {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cache:value}
            sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newDisplayValues
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        cacheMax:(input:string) => {
            const editAPIFunctionArguments = editContentTypePropertiesRef.current
            editAPIFunctionArguments.cacheMax = input
            if (!isInvalidTests.cacheMax(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cacheMax:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editAPIFunctionArguments})
        },
        scrolltoIndex:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.scrolltoIndex = input
            if (!isInvalidTests.scrolltoIndex(input)) {
                sessionAPIFunctionArgumentsRef.current.scrolltoIndex = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        listsize:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.listsize = input
            if (!isInvalidTests.listsize(input)) {
                sessionAPIFunctionArgumentsRef.current.listsize = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        listLowIndex:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.listLowIndex = input
            if (!isInvalidTests.listLowIndex(input)) {
                sessionAPIFunctionArgumentsRef.current.listLowIndex = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        listHighIndex:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.listHighIndex = input
            if (!isInvalidTests.listHighIndex(input)) {
                sessionAPIFunctionArgumentsRef.current.listHighIndex = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        insertFrom:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.insertFrom = input
            if (!isInvalidTests.insertFrom(input)) {
                sessionAPIFunctionArgumentsRef.current.insertFrom = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        insertRange:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.insertRange = input
            if (!isInvalidTests.insertRange(input)) {
                sessionAPIFunctionArgumentsRef.current.insertRange = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        removeFrom:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.removeFrom = input
            if (!isInvalidTests.removeFrom(input)) {
                sessionAPIFunctionArgumentsRef.current.removeFrom = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        removeRange:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.removeRange = input
            if (!isInvalidTests.removeRange(input)) {
                sessionAPIFunctionArgumentsRef.current.removeRange = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        moveFrom:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.moveFrom = input
            if (!isInvalidTests.moveFrom(input)) {
                sessionAPIFunctionArgumentsRef.current.moveFrom = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        moveRange:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.moveRange = input
            if (!isInvalidTests.moveRange(input)) {
                sessionAPIFunctionArgumentsRef.current.moveRange = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        moveTo:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.moveTo = input
            if (!isInvalidTests.moveTo(input)) {
                sessionAPIFunctionArgumentsRef.current.moveTo = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        remapDemo:(event:React.ChangeEvent) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            const target = event.target as HTMLSelectElement
            const value = target.value
            editAPIFunctionArguments.remapDemo = value
            sessionAPIFunctionArgumentsRef.current.remapDemo = value
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
    }

    const serviceFuncs = {
        getCacheIndexMap: () => {
            console.log('cacheIndexMap =',functionsAPI.getCacheIndexMap())
        },
        getCacheItemMap: () => {
            console.log('cacheItemMap =',functionsAPI.getCacheItemMap())
        },
        getCradleIndexMap: () => {
            console.log('cradleIndexMap =',functionsAPI.getCradleIndexMap())
        },
        getPropertiesSnapshot: () => {
            console.log('properties =',functionsAPI.getPropertiesSnapshot())
        }
    }

    // --------------------------[ state change control ]------------------

    useEffect(()=>{
        switch (optionsState) {
            case 'initialize-dependencies': {
                updateDependenciesFunctions.contentType(sessionContentTypeSelectorRef.current)
                updateDependenciesFunctions.serviceFunctions(sessionOperationFunctionSelectorRef.current)
                setOptionsState('ready')
                break
            }
            case 'prepare-to-update-content-dependencies': {
                setOptionsState('update-content-dependencies')
                break
            }
            case 'update-content-dependencies': {
                updateDependenciesFunctions.contentType(sessionContentTypeSelectorRef.current)
                setOptionsState('ready')
                break
            }
            case 'prepare-to-update-function-dependencies': {
                setOptionsState('update-function-dependencies')
                break
            }
            case 'update-function-dependencies': {
                updateDependenciesFunctions.serviceFunctions(sessionOperationFunctionSelectorRef.current)
                setOptionsState('ready')
                break
            }
        }
    },[optionsState, updateDependenciesFunctions])

    // ------------------------------[ render ]------------------------------
    
    return (

    <Box><VStack align = 'start' alignItems = 'stretch'>

        <FormControl  borderBottom = '1px solid black' paddingBottom = {3}>

            <FormLabel>Select Content Type</FormLabel>

            <Select 
                size = 'md'
                value = {editContentTypeSelector} 
                onChange = {onChangeFuncs.contentType}
            >
                <option value="simplecontent">Simple uniform content</option>
                <option value="simplepromises">Simple uniform promises</option>
                <option value="variablecontent">Variable content</option>
                <option value="variablepromises">Variable promises</option>
                <option value="variabledynamic">Variable dynamic</option>
                <option value="variableoversized">Variable oversized</option>
                <option value="nestedcontent">Nested scrollers</option>
                <option value="nestedpromises">Nested scroller promises</option>
                <option value="sharedcache">Shared cache (experimental)</option>
            </Select>

            <FormHelperText>
                Current content will be replaced on Apply.<br/>
                Current list index range [lowindex,highindex] is [{listlowindex},{listhighindex}]
            </FormHelperText>

        </FormControl>

        <FormControl borderBottom = '1px solid black'>
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

        <Heading as = 'h3' fontSize = 'md'>More Options</Heading>

        <Accordion allowMultiple>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            {sectionTitles.properties}
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}><VStack alignItems = 'start'>

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

                    <Heading size = 'xs'>Starting list size</Heading>
                    
                    <FormControl isInvalid = {invalidFlags.startingListSize} >
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                            <FormLabel fontSize = 'sm'>startingListSize:</FormLabel>

                            <NumberInput 
                                value = {editContentTypeProperties.startingListSize} 
                                size = 'sm'
                                onChange = {onChangeFuncs.startingListSize}
                                clampValueOnBlur = {false}
                            >
                                <NumberInputField border = '2px' />
                            </NumberInput>
                        </InputGroup>
                        </HStack>
                        <FormErrorMessage>
                            {errorMessages.startingListSize}
                        </FormErrorMessage>
                    </FormControl>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. This will only apply right after a content type change. It will 
                        set the starting list size of the session for the content type. See also
                        'Change virtual list size' in the 'Service functions: operations' section.
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

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        <Code>cacheMax</Code>:integer is ignored for 'cradle' cache setting. 
                        Otherwise, very high settings can degrade performance. <Code>cacheMax</Code> blank 
                        or zero is ignored.
                    </Text>

                    <Heading size = 'xs'>Show axis</Heading>

                    <FormControl>
                        <Checkbox 
                            isChecked = {editContentTypeProperties.technical.showAxis} 
                            size = 'sm'
                            mt = {2}
                            onChange = {onChangeFuncs.showAxis}
                        >
                            Show axis
                        </Checkbox>
                        <FormHelperText>
                            For debug and instruction only. There is a CSS grid on either side of the axis.
                        </FormHelperText>
                    </FormControl>

                </VStack></AccordionPanel>

            </AccordionItem>

            <AccordionItem>

                <Heading as = 'h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            {sectionTitles.callbacks}
                        </Box>
                        <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    <Text fontSize = 'sm' mb = {2}>
                        On a desktop, these callbacks, when checked, will stream information about the scroller 
                        behaviour to the browser console. In an application the data can be used to enhance the 
                        user experience. Select the callbacks you want to activate.
                    </Text>

                    <VStack alignItems = 'start'>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {editCallbackFlags.referenceIndexCallback} 
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
                            isChecked = {editCallbackFlags.preloadIndexCallback} 
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
                            isChecked = {editCallbackFlags.itemExceptionCallback} 
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
                            isChecked = {editCallbackFlags.repositioningFlagCallback} 
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
                            isChecked = {editCallbackFlags.repositioningIndexCallback} 
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
                            isChecked = {editCallbackFlags.changeListsizeCallback} 
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
                            isChecked = {editCallbackFlags.deleteListCallback} 
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
                            {sectionTitles.snapshots}
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>

                    <Text fontSize = 'sm' mb = {2}>
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
                            {sectionTitles.operations}
                        </Box>
                        <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>

                    <Text fontSize = 'sm' paddingBottom = {2} mb = {2} borderBottom = '1px'>
                        Perform these functions one at a time. Enable the function of choice, then hit the Apply
                        button. Most of these functions provide feedback in the browser console. The feedback can 
                        be used by apps.
                    </Text>

                    <VStack alignItems = 'start'>

                    <Heading size = 'xs'>Scroll to</Heading>

                    <HStack alignItems = 'baseline'>

                        <FormControl 
                            isDisabled = {disabledFlags.scrolltoIndex}
                            isInvalid = {invalidFlags.scrolltoIndex}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>index:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.scrolltoIndex} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.scrolltoIndex}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.scrolltoIndex}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                                <FormLabel htmlFor='goto' fontSize = 'sm'>Enable</FormLabel>

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
                                    value = {editAPIFunctionArguments.listsize} 
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

                                <FormLabel htmlFor='listsize' fontSize = 'sm'>Enable</FormLabel>

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

                    <Heading size = 'xs'>Change virtual list range</Heading>

                    <Stack direction = {['column','row','row']}>

                        <FormControl 
                            isDisabled = {disabledFlags.listLowIndex}
                            isInvalid = {invalidFlags.listLowIndex} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>low index:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.listLowIndex} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.listLowIndex}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.listLowIndex}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl 
                            isDisabled = {disabledFlags.listHighIndex}
                            isInvalid = {invalidFlags.listHighIndex} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>high index:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.listHighIndex} 
                                    size = 'sm'
                                    onChange = {onChangeFuncs.listHighIndex}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.listHighIndex}
                            </FormErrorMessage>
                        </FormControl>

                    </Stack>

                    <FormControl>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                            <FormLabel htmlFor='listrange' fontSize = 'sm'>Enable</FormLabel>

                            <Switch 
                                isChecked = {functionEnabledSettings.listrange} 
                                onChange = {onChangeFuncs.onChangeEnabler} 
                                id='listrange' 
                            />
                        </InputGroup>
                    </FormControl>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integers. Set low and high indexes. high index must be greater than or equal to  
                        low index.
                    </Text>

                    <Heading size = 'xs'>Insert indexes</Heading>

                    <Stack direction = {['column','row','row']}>

                        <FormControl 
                            isDisabled = {disabledFlags.insertFrom}
                            isInvalid = {invalidFlags.insertFrom} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>from:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.insertFrom} 
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
                                    value = {editAPIFunctionArguments.insertRange} 
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

                            <FormLabel htmlFor='insert' fontSize = 'sm'>Enable</FormLabel>

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
                                    value = {editAPIFunctionArguments.removeFrom} 
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
                                    value = {editAPIFunctionArguments.removeRange} 
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

                            <FormLabel htmlFor='remove' fontSize = 'sm'>Enable</FormLabel>

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
                                value = {editAPIFunctionArguments.moveFrom} 
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
                                value = {editAPIFunctionArguments.moveRange} 
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
                                value = {editAPIFunctionArguments.moveTo} 
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

                            <FormLabel htmlFor='move' fontSize = 'sm'>Enable</FormLabel>

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

                    <FormControl isDisabled = {disabledFlags.remapDemo} width = 'xs'>
                        <Select
                            value = {editAPIFunctionArguments.remapDemo} 
                            size = 'sm'
                            onChange = {onChangeFuncs.remapDemo}
                        >
                            <option value="backwardsort">Backward sort</option>
                            <option value="replaceitems">Replace items</option>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                            <FormLabel htmlFor='remap' fontSize = 'sm'>Enable</FormLabel>

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
                        items to the newly assigned indexes. We've included a random test that applies to 
                        the cradle. For purposes of this demo the new mappings are 'forgotten' when the moved
                        items scroll out of scope.
                    </Text>

                    <Heading size = 'xs'>Reload the cache</Heading>
                    <FormControl>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                            <FormLabel htmlFor='reload' fontSize = 'sm'>Enable</FormLabel>

                            <Switch 
                                isChecked = {functionEnabledSettings.reload} 
                                onChange = {onChangeFuncs.onChangeEnabler} 
                                id='reload' 
                            />
                        </InputGroup>
                    </FormControl>
                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        This clears the and reloads the cache, and reloads the cradle at its current position.
                    </Text>

                    <Heading size = 'xs'>Clear the cache</Heading>
                    <FormControl>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                            <FormLabel htmlFor='clear' fontSize = 'sm'>Enable</FormLabel>
                            
                            <Switch 
                                isChecked = {functionEnabledSettings.clear} 
                                onChange = {onChangeFuncs.onChangeEnabler} 
                                id='clear' 
                            />
                        </InputGroup>
                    </FormControl>

                    <Text fontSize = 'sm' paddingBottom = {2}>
                        This clears the cache (and therefore the cradle). Not very interesting. See also 'Reload the cache'.
                    </Text>

                    </VStack>
                    
                </AccordionPanel>

            </AccordionItem>

        </Accordion>

    </VStack></Box>)
}

export default Options