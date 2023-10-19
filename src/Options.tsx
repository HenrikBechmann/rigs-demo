// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

// TODO: update functionsAPI with change of contentType selection?
// TODO: map properties from session to edit here

import React, {useState, useRef, useEffect} from 'react'

import {

    Box, Stack, VStack, HStack, // layout
    FormControl, FormLabel, FormHelperText, FormErrorMessage, // forms
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, // accordion
    Button, Switch, Radio, RadioGroup, Checkbox, Select, // active content components
    Input, NumberInput, NumberInputField, InputGroup, // number component
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

    // return (isNumber(value) && (Math.floor(test) === test))
    return (Number.isInteger(test))

}

const isValueGreaterThanOrEqualToMinValue = (compareValue:any, minValue:any) => {

    if (!isInteger(compareValue) || !isInteger(minValue)) return false

    const testCompareValue = +compareValue
    const testMinValue = +minValue

    return testCompareValue >= testMinValue

}

const isValueLessThanOrEqualToMaxValue = (compareValue:any, maxValue:any) => {

    if (!isInteger(compareValue) || !isInteger(maxValue)) return false

    const testCompareValue = +compareValue
    const testMaxValue = +maxValue

    return testCompareValue <= testMaxValue

}

// ------------------------[ static field data ]----------------------

const 
    sectionTitles:GenericObject = {
        properties:'Properties for the selected content type',
        callbacks:'Callbacks',
        snapshots:'Service functions: snapshots',
        operations:'Service functions: operations',
    },

    fieldSections:GenericObject = {

        cellHeight:'properties',
        cellWidth:'properties',
        cellMinHeight:'properties',
        cellMinWidth:'properties',
        startingIndex:'properties',
        rangePropertyType:'properties',
        startingLowIndex:'properties',
        startingHighIndex:'properties',
        padding:'properties',
        gap:'properties',
        runwaySize:'properties',
        cacheMax:'properties',
        scrolltoIndex:'operations',
        scrollToPixel:'operations',
        scrollByPixel:'operations',
        scrolltobehavior:'operations',
        scrollbybehavior:'operations',
        prependCount:'operations',
        appendCount:'operations',
        rangeAPIType:'properties',
        listLowIndex:'operations',
        listHighIndex:'operations',
        insertFrom:'operations',
        insertRange:'operations',
        removeFrom:'operations',
        removeRange:'operations',
        moveFrom:'operations',
        moveRange:'operations',
        moveTo:'operations',

    },

    // display error messages
    errorMessages = { 
        // string selection, no errors
        cellHeight:'integer: cellHeight is required with minimum of 25',
        cellWidth:'integer: cellWidth is required with minimum 25',
        cellMinHeight:'blank, or integer minimum 25 and less than or equal to cellHeight',
        cellMinWidth:'blank, or integer minimum 25 and less than or equal to cellWidth',
        startingIndex:'blank, or integer greater than or equal to listlowindex',
        startingLowIndex:'integer: must be less than or equal to high index',
        startingHighIndex:'integer: must be greater than or equal to low index',
        padding:'blank, or integer, or comma separated list of 2-4 integers, all greater than or equal to 0',
        gap:'blank, or integer, or comma separated list of 2 integers, all greater than or equal to 0',
        runwaySize:'blank, or integer minimum 1',
        cacheMax:'blank, or integer greater than or equal to 0',
        scrolltoIndex:'integer: required, greater than or equal to listlowindex',
        scrollToPixel:'integer:required, greater than or equal to 0',
        scrollByPixel:'integer:required',
        listLowIndex:'integer: required, less than or equal to high index',
        listHighIndex:'integer:required, greater than or equal to low index',
        prependCount:'integer:required, greater than or equal to 0',
        appendCount:'integer:required, greater than or equal to 0',
        insertFrom:'integer: required, greater than or equal to listlowindex',
        insertRange:'blank, or integer greater than or equal to the "from" index',
        removeFrom:'integer: required, greater than or equal to listlowindex',
        removeRange:'blank, or integer greater than or equal to the "from" index',
        moveFrom:'integer: required, greater than or equal to listlowindex',
        moveRange:'blank, or integer greater than or equal to the "from" index',
        moveTo:'integer: required, greater than or equal to listlowindex',
    },

    accessControlledAPIFields = [
        'scrolltoIndex','scrollToPixel','scrollByPixel','scrolltobehavior','scrollbybehavior',
        'prependCount','appendCount',
        'listLowIndex','listHighIndex','rangeAPIType',
        'insertFrom', 'insertRange',
        'removeFrom', 'removeRange',
        'moveFrom', 'moveRange', 'moveTo',
    ]

// ----------------------------------------------------
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
 
    // -------------------------[ component state updates ]------------------------

    // inherited scroller service functions
    const 
        functionsAPI = functionsAPIRef.current,

        indexRangeRef = useRef<number[]>([])

    // console.log('indexRangeRef',indexRangeRef)

    const
        [listlowindex, listhighindex] = indexRangeRef.current,
        rangesize = 
            indexRangeRef.current.length == 0?
            0:
            listhighindex - listlowindex + 1,

        originalContentTypeSelectorRef = useRef(sessionContentTypeSelectorRef.current),

        // component state
        [optionsState, setOptionsState] = useState('setup'),

        // simple values
        [editContentTypeSelector, setEditContentTypeSelector] = 
            useState(sessionContentTypeSelectorRef.current),
        [editOperationFunctionSelector, setEditOperationFunctionSelector] = 
            useState(sessionOperationFunctionSelectorRef.current),

        editOperationFunctionSelectorRef = useRef(sessionOperationFunctionSelectorRef.current),

        // objects. The local values are used to assign valid edits to the inherited values
        [editContentTypeProperties, setEditContentTypeProperties] = 
            useState({...sessionAllContentTypePropertiesRef.current[editContentTypeSelector]}),
        editContentTypePropertiesRef = useRef(editContentTypeProperties),

        [editCallbackFlags, setEditCallbackFlags] = 
            useState({...sessionCallbackFlagsRef.current}),
    
        [editAPIFunctionArguments, setEditAPIFunctionArguments] = 
            useState({...sessionAPIFunctionArgumentsRef.current}),
        editAPIFunctionArgumentsRef = useRef(editAPIFunctionArguments),

        // --------------------------------[ internal mutable field data ]-----------------------------

        rangeTextColorsRef = useRef({
            rangepropertyvalues:'gray',
            emptyrangeproperty:'gray',
            rangeAPIvalues:'gray',
            emptyrangeAPI:'gray',
        }),
        rangeTextColors = rangeTextColorsRef.current,

        propertyDisabledFlagsRef = useRef({
            startingLowIndex:false,
            startingHighIndex:false,
        }),
        propertyDisabledFlags = propertyDisabledFlagsRef.current,

        // disabled controls
        APIdisabledFlagsRef = useRef<GenericObject>({
            cellMinHeight:false,
            cellMinWidth:false,
            scrolltoIndex:false,
            scrollToPixel:false,
            scrollByPixel:false,
            scrolltobehavior:false,
            scrollbybehavior:false,
            rangeAPIType:false,
            listLowIndex:false,
            listHighIndex:false,
            prependCount:false,
            appendCount:false,
            insertFrom:false,
            insertRange:false,
            removeFrom:false,
            removeRange:false,
            moveFrom:false,
            moveRange:false,
            moveTo:false,
        }),
        APIdisabledFlags = APIdisabledFlagsRef.current,

        // invalid flags
        invalidFieldFlagsRef = useRef<GenericObject>({
            contentType:false,
            orientation:false,
            cellHeight:false,
            cellWidth:false,
            cellMinHeight:false,
            cellMinWidth:false,
            startingIndex:false,
            startingLowIndex:false,
            startingHighIndex:false,
            padding:false,
            gap:false,
            runwaySize:false,
            cache:false,
            cacheMax:false,
            scrolltoIndex:false,
            scrollToPixel:false,
            scrollByPixel:false,
            listLowIndex:false,
            listHighIndex:false,
            prependCount:false,
            appendCount:false,
            insertFrom:false,
            insertRange:false,
            removeFrom:false,
            removeRange:false,
            moveFrom:false,
            moveRange:false,
            moveTo:false,
        }),
        invalidFieldFlags = invalidFieldFlagsRef.current,

        // scroller function switch settings
        functionEnabledSettingsRef = useRef<GenericObject>({
            goto:false,
            gotopixel:false,
            gobypixel:false,
            prependCount:false,
            appendCount:false,
            listrange:false,
            reload:false,
            insert:false,
            remove:false,
            move:false,
            // remap:false,
            clear:false,
        }),
        functionEnabledSettings = functionEnabledSettingsRef.current

    editOperationFunctionSelectorRef.current = editOperationFunctionSelector
    editContentTypePropertiesRef.current = editContentTypeProperties
    editAPIFunctionArgumentsRef.current = editAPIFunctionArguments

    // test forwarded to host; returns text list of invalid section titles for display to user
    const getInvalidSections = () => {

        const sections = new Set<string>()
        const errorfields = invalidFieldFlagsRef.current
        for (const field in invalidFieldFlagsRef.current) {
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

    // -----------------------------------[ field management functions ]------------------------------

    // display value error check functions
    const isInvalidTests = {
        cellHeight:(value:string) => {
            const isInvalid = (!isInteger(value) || !isValueGreaterThanOrEqualToMinValue(value, 25))
            invalidFieldFlags.cellHeight = isInvalid
            if (!APIdisabledFlags.cellMinHeight) {
                isInvalidTests.cellMinHeight(editContentTypePropertiesRef.current.cellMinHeight)
            }
            return isInvalid
        },
        cellWidth:(value:string) => {
            const isInvalid = (!isInteger(value) || !isValueGreaterThanOrEqualToMinValue(value, 25))
            invalidFieldFlags.cellWidth = isInvalid
            if (!APIdisabledFlags.cellMinWidth) {
                isInvalidTests.cellMinWidth(editContentTypePropertiesRef.current.cellMinWidth)
            }
            return isInvalid
        },
        cellMinHeight:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = (!isValueGreaterThanOrEqualToMinValue(value,25) || !(isValueLessThanOrEqualToMaxValue(value, editContentTypePropertiesRef.current.cellHeight)))
            }
            invalidFieldFlags.cellMinHeight = isInvalid
            return isInvalid
        },
        cellMinWidth:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = (!isValueGreaterThanOrEqualToMinValue(value,25) || !(isValueLessThanOrEqualToMaxValue(value, editContentTypePropertiesRef.current.cellWidth)))
            }
            invalidFieldFlags.cellMinWidth = isInvalid
            return isInvalid
        },
        startingIndex:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !isValueGreaterThanOrEqualToMinValue(value,listlowindex)
            }
            invalidFieldFlags.startingIndex = isInvalid
            return isInvalid
        },
        startingLowIndex:(value:string) => {

            let isInvalid = !(isBlank(value) && isBlank(editContentTypePropertiesRef.current.startingHighIndex))
            if (!isInvalid) {
                invalidFieldFlags.startingLowIndex = isInvalid
                return isInvalid
            }

            isInvalid = isBlank(value) && !isBlank(editContentTypePropertiesRef.current.startingHighIndex)

            !isInvalid && (isInvalid = isBlank(editContentTypePropertiesRef.current.startingHighIndex))

            !isInvalid && (isInvalid = !isInteger(value))

            !isInvalid && (isInvalid = !isInteger(editContentTypePropertiesRef.current.startingHighIndex))

            !isInvalid && (isInvalid = !isValueGreaterThanOrEqualToMinValue(editContentTypePropertiesRef.current.startingHighIndex,value))

            invalidFieldFlags.startingLowIndex = isInvalid
            return isInvalid

        },
        startingHighIndex:(value:string) => {

            let isInvalid = !(isBlank(value) && isBlank(editContentTypePropertiesRef.current.startingLowIndex))
            if (!isInvalid) {
                invalidFieldFlags.startingHighIndex = isInvalid
                return isInvalid
            }

            isInvalid = isBlank(value) && !isBlank(editContentTypePropertiesRef.current.startingLowIndex)

            !isInvalid && (isInvalid = isBlank(editContentTypePropertiesRef.current.startingLowIndex))

            !isInvalid && (isInvalid = !isInteger(value))

            !isInvalid && (isInvalid = !isInteger(editContentTypePropertiesRef.current.startingLowIndex))

            !isInvalid && (isInvalid = !isValueLessThanOrEqualToMaxValue(editContentTypePropertiesRef.current.startingLowIndex, value))

            invalidFieldFlags.startingHighIndex = isInvalid
            return isInvalid

        },
        padding:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                const list = value.split(',')
                if (list.length > 4) {
                    isInvalid = true
                } else {
                    list.forEach((value)=>{
                        if (!isValueGreaterThanOrEqualToMinValue(value,0)) {
                            isInvalid = true
                        }

                    })
                }                
            }
            invalidFieldFlags.padding = isInvalid
            return isInvalid
        },
        gap:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                const list = value.split(',')
                if (list.length > 2) {
                    isInvalid = true
                } else {
                    list.forEach((value)=>{
                        if (!isValueGreaterThanOrEqualToMinValue(value,0)) {
                            isInvalid = true
                        }

                    })
                }                
            }
            invalidFieldFlags.gap = isInvalid
            return isInvalid
        },
        runwaySize:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !isValueGreaterThanOrEqualToMinValue(value,1)
            }
            invalidFieldFlags.runwaySize = isInvalid
            return isInvalid
        },
        cacheMax:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !isValueGreaterThanOrEqualToMinValue(value,0)
            }
            invalidFieldFlags.cacheMax = isInvalid
            return isInvalid
        },
        scrolltoIndex:(value:string) => {
            const isInvalid = (!isInteger(value)) // || !isValueGreaterThanOrEqualToMinValue(value, listlowindex))
            invalidFieldFlags.scrolltoIndex = isInvalid
            return isInvalid
        },
        scrollToPixel:(value:string) => {
            const isInvalid = (!isInteger(value) && !isValueGreaterThanOrEqualToMinValue(value, 0))
            invalidFieldFlags.scrollToPixel = isInvalid
            return isInvalid
        },
        scrollByPixel:(value:string) => {
            const isInvalid = !isInteger(value)
            invalidFieldFlags.scrollByPixel = isInvalid
            return isInvalid
        },
        listLowIndex:(value:string) => {
            let isInvalid = isBlank(value)
            if (!isInvalid) {
                isInvalid = !isInteger(value)
            }
            if (!isInvalid) {
                isInvalid = !isValueLessThanOrEqualToMaxValue(value,editAPIFunctionArgumentsRef.current.listHighIndex)
            }
            invalidFieldFlags.listLowIndex = isInvalid
            // isInvalidTests.listHighIndex(editAPIFunctionArgumentsRef.current.listHighIndex)
            return isInvalid
        },
        listHighIndex:(value:string) => {
            let isInvalid = isBlank(value)
            if (!isInvalid) {
                isInvalid = !isInteger(value)
            }
            if (!isInvalid) {
                isInvalid = !isValueGreaterThanOrEqualToMinValue(value,editAPIFunctionArgumentsRef.current.listLowIndex)
            }
            invalidFieldFlags.listHighIndex = isInvalid
            return isInvalid
        },
        prependCount:(value:string) => {
            const isInvalid = ((!isInteger(value)) || (!isValueGreaterThanOrEqualToMinValue(value, 0)) )
            invalidFieldFlags.prependCount = isInvalid
            return isInvalid
        },
        appendCount:(value:string) => {
            const isInvalid = ((!isInteger(value)) || (!isValueGreaterThanOrEqualToMinValue(value, 0)) )
            invalidFieldFlags.appendCount = isInvalid
            return isInvalid
        },
        insertFrom:(value:string) => {
            const isInvalid = (!isInteger(value) || 
                    (rangesize && (!isValueGreaterThanOrEqualToMinValue(value, listlowindex)))
                )
            invalidFieldFlags.insertFrom = isInvalid
            isInvalidTests.insertRange(editAPIFunctionArgumentsRef.current.insertRange)
            return isInvalid
        },
        insertRange:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !isValueGreaterThanOrEqualToMinValue(value,editAPIFunctionArgumentsRef.current.insertFrom)
            }
            invalidFieldFlags.insertRange = isInvalid
            return isInvalid
        },
        removeFrom:(value:string) => {
            const isInvalid = (!isInteger(value) || !isValueGreaterThanOrEqualToMinValue(value, listlowindex))
            invalidFieldFlags.removeFrom = isInvalid
            isInvalidTests.removeRange(editAPIFunctionArgumentsRef.current.removeRange)
            return isInvalid
        },
        removeRange:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !isValueGreaterThanOrEqualToMinValue(value,editAPIFunctionArgumentsRef.current.removeFrom)
            }
            invalidFieldFlags.removeRange = isInvalid
            return isInvalid
        },
        moveFrom:(value:string) => {
            const isInvalid = (!isInteger(value) || !isValueGreaterThanOrEqualToMinValue(value, listlowindex))
            invalidFieldFlags.moveFrom = isInvalid
            isInvalidTests.moveRange(editAPIFunctionArgumentsRef.current.moveRange)
            return isInvalid
        },
        moveRange:(value:string) => {
            let isInvalid = false
            if (!isBlank(value)) {
                isInvalid = !isValueGreaterThanOrEqualToMinValue(value,editAPIFunctionArgumentsRef.current.moveFrom)
            }
            invalidFieldFlags.moveRange = isInvalid
            return isInvalid
        },
        moveTo:(value:string) => {
            const isInvalid = (!isInteger(value) || !isValueGreaterThanOrEqualToMinValue(value, listlowindex))
            invalidFieldFlags.moveTo = isInvalid
            return isInvalid
        },
    }

    // display on change functions
    const onChangeFunctions = {
        showAxis:(event:React.ChangeEvent) => {
            const target = event.target as HTMLInputElement
            const value = target.checked

            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.technical.showAxis = value
            sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current].technicalshowAxis = value
            setEditContentTypeProperties({...editContentTypeProperties})
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
            setOptionsState('preparenewopfunctionselector')
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
            setOptionsState('preparenewcontenttype')
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
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.orientation = input
            const newSessionProperties = 
                {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],orientation:input}
            sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        cellHeight:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.cellHeight = input
            if (!isInvalidTests.cellHeight(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cellHeight:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        cellWidth:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.cellWidth = input
            if (!isInvalidTests.cellWidth(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cellWidth:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        cellMinHeight:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.cellMinHeight = input
            if (!isInvalidTests.cellMinHeight(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cellMinHeight:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        cellMinWidth:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.cellMinWidth = input
            if (!isInvalidTests.cellMinWidth(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cellMinWidth:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        startingIndex:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.startingIndex = input
            if (!isInvalidTests.startingIndex(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],startingIndex:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        rangePropertyType:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.rangePropertyType = input
            const newSessionProperties = 
                {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],rangePropertyType:input}
            sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            updateFieldAccessFunctions.propertyFields(sessionContentTypeSelectorRef.current)
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        startingLowIndex:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.startingLowIndex = input
            if (!isInvalidTests.startingLowIndex(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],startingLowIndex:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
            if (!isInvalidTests.startingHighIndex(editContentTypeProperties.startingHighIndex)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],
                        startingHighIndex:editContentTypeProperties.startingHighIndex}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
        },
        startingHighIndex:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.startingHighIndex = input
            if (!isInvalidTests.startingHighIndex(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],startingHighIndex:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
            if (!isInvalidTests.startingLowIndex(editContentTypeProperties.startingLowIndex)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],
                        startingLowIndex:editContentTypeProperties.startingLowIndex}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
        },
        // padding:(input:string) => {
        padding:(event:React.ChangeEvent) => {
            const target = event.target as HTMLSelectElement
            const input = target.value
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.padding = input
            if (!isInvalidTests.padding(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],padding:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        gap:(event:React.ChangeEvent) => {
            const target = event.target as HTMLSelectElement
            const input = target.value
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.gap = input
            if (!isInvalidTests.gap(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],gap:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        runwaySize:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.runwaySize = input
            if (!isInvalidTests.runwaySize(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],runwaySize:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        cache:(event:React.ChangeEvent) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            const target = event.target as HTMLSelectElement
            const value = target.value
            editContentTypeProperties.cache = value
            const newDisplayValues = 
                {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cache:value}
            sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newDisplayValues
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        cacheMax:(input:string) => {
            const editContentTypeProperties = editContentTypePropertiesRef.current
            editContentTypeProperties.cacheMax = input
            if (!isInvalidTests.cacheMax(input)) {
                const newSessionProperties = 
                    {...sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current],cacheMax:input}
                sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current] = newSessionProperties
            }
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        scrolltoIndex:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.scrolltoIndex = input
            if (!isInvalidTests.scrolltoIndex(input)) {
                sessionAPIFunctionArgumentsRef.current.scrolltoIndex = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        scrollToPixel:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.scrollToPixel = input
            if (!isInvalidTests.scrollToPixel(input)) {
                sessionAPIFunctionArgumentsRef.current.scrollToPixel = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        scrollByPixel:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.scrollByPixel = input
            if (!isInvalidTests.scrollByPixel(input)) {
                sessionAPIFunctionArgumentsRef.current.scrollByPixel = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        scrolltobehavior:(event:React.ChangeEvent) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            const target = event.target as HTMLSelectElement
            const value = target.value
            editAPIFunctionArguments.scrolltobehavior = value
            sessionAPIFunctionArgumentsRef.current.scrolltobehavior = value
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        scrollbybehavior:(event:React.ChangeEvent) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            const target = event.target as HTMLSelectElement
            const value = target.value
            editAPIFunctionArguments.scrollbybehavior = value
            sessionAPIFunctionArgumentsRef.current.scrollbybehavior = value
            setEditContentTypeProperties({...editContentTypeProperties})
        },
        listLowIndex:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.listLowIndex = input
            if (!isInvalidTests.listLowIndex(input)) {
                sessionAPIFunctionArgumentsRef.current.listLowIndex = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
            isInvalidTests.listHighIndex(editAPIFunctionArgumentsRef.current.listHighIndex)
        },
        listHighIndex:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.listHighIndex = input
            if (!isInvalidTests.listHighIndex(input)) {
                sessionAPIFunctionArgumentsRef.current.listHighIndex = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
            isInvalidTests.listLowIndex(editAPIFunctionArgumentsRef.current.listLowIndex)
        },
        rangeAPIType:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.rangeAPIType = input
            sessionAPIFunctionArgumentsRef.current.rangeAPIType = input
            updateFieldAccessFunctions.rangeAPI()

            if (input == 'emptyrangeAPI') {
                APIdisabledFlags.listLowIndex = true
                APIdisabledFlags.listHighIndex = true
                if (invalidFieldFlags.listLowIndex) {
                    invalidFieldFlags.listLowIndex = false
                    editAPIFunctionArgumentsRef.current.listLowIndex = sessionAPIFunctionArgumentsRef.current.listLowIndex
                }
                if (invalidFieldFlags.listHighIndex) {
                    invalidFieldFlags.listHighIndex = false
                    editAPIFunctionArgumentsRef.current.listHighIndex = sessionAPIFunctionArgumentsRef.current.listHighIndex
                }
            } else {
                APIdisabledFlags.listLowIndex = false
                APIdisabledFlags.listHighIndex = false
                isInvalidTests.listLowIndex(editAPIFunctionArgumentsRef.current.listLowIndex)
                isInvalidTests.listHighIndex(editAPIFunctionArgumentsRef.current.listHighIndex)
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        prependCount:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.prependCount = input
            if (!isInvalidTests.prependCount(input)) {
                sessionAPIFunctionArgumentsRef.current.prependCount = input
            }
            setEditAPIFunctionArguments({...editAPIFunctionArguments})
        },
        appendCount:(input:string) => {
            const editAPIFunctionArguments = editAPIFunctionArgumentsRef.current
            editAPIFunctionArguments.appendCount = input
            if (!isInvalidTests.appendCount(input)) {
                sessionAPIFunctionArgumentsRef.current.appendCount = input
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
    }

    const APISnapshotFunctions = {
        getCacheIndexMap: () => {
            console.log('[cacheIndexMap, context] =',functionsAPI.getCacheIndexMap())
        },
        getCacheItemMap: () => {
            console.log('[cacheItemMap, context] =',functionsAPI.getCacheItemMap())
        },
        getCradleIndexMap: () => {
            console.log('[cradleIndexMap, context] =',functionsAPI.getCradleIndexMap())
        },
        getPropertiesSnapshot: () => {
            console.log('[properties, context] =',functionsAPI.getPropertiesSnapshot())
        }
    }

    const updateFieldAccessFunctions = {
        contentType:(contentSelection:string) => {

            let disabled
            if (['variablecontent','variablepromises','variabledynamic','variableoversized','variableautoexpand'].includes(contentSelection)) {

                disabled = false
                isInvalidTests.cellMinHeight(editContentTypePropertiesRef.current.cellMinHeight)
                isInvalidTests.cellMinWidth(editContentTypePropertiesRef.current.cellMinWidth)

            } else {

                disabled = true
                invalidFieldFlags.cellMinHeight = 
                    invalidFieldFlags.cellMinWidth = false

            }

            APIdisabledFlags.cellMinHeight =
                APIdisabledFlags.cellMinWidth = disabled

        },
        propertyFields: (contentSelection:string) => {
            if (sessionAllContentTypePropertiesRef.current[contentSelection].rangePropertyType == 
                'rangepropertyvalues') {
                propertyDisabledFlags.startingLowIndex = false
                propertyDisabledFlags.startingHighIndex = false
                rangeTextColors.rangepropertyvalues = 'black'
                rangeTextColors.emptyrangeproperty = 'gray'
            } else {
                if (isInvalidTests.startingLowIndex(
                    editContentTypePropertiesRef.current.startingLowIndex) ||
                    isInvalidTests.startingHighIndex(
                    editContentTypePropertiesRef.current.startingHighIndex)) {

                    editContentTypePropertiesRef.current.startingLowIndex = 
                        sessionAllContentTypePropertiesRef.current[contentSelection].startingLowIndex
                    editContentTypePropertiesRef.current.startingHighIndex = 
                        sessionAllContentTypePropertiesRef.current[contentSelection].startingHighIndex
                    invalidFieldFlagsRef.current.startingLowIndex = false
                    invalidFieldFlagsRef.current.startingHighIndex = false
                }
                propertyDisabledFlags.startingLowIndex = true
                propertyDisabledFlags.startingHighIndex = true
                rangeTextColors.rangepropertyvalues = 'gray'
                rangeTextColors.emptyrangeproperty = 'black'
            }
        },
        rangeAPI:() => {
            if (!functionEnabledSettings.listrange) {
                rangeTextColors.rangeAPIvalues = 'gray'
                rangeTextColors.emptyrangeAPI = 'gray'
                rangeTextColors.rangeAPIvalues = 'gray'
                rangeTextColors.emptyrangeAPI = 'gray'
            } else {
                if (sessionAPIFunctionArgumentsRef.current.rangeAPIType == 
                    'rangeAPIvalues') {
                    rangeTextColors.rangeAPIvalues = 'black'
                    rangeTextColors.emptyrangeAPI = 'gray'
                } else {
                    rangeTextColors.rangeAPIvalues = 'gray'
                    rangeTextColors.emptyrangeAPI = 'black'
                }
            }

        },
        APIFunctions: (service:string = '') => {

            // disable all, and reset error conditions
            for (const field of accessControlledAPIFields) {
                APIdisabledFlags[field] = true
                if (invalidFieldFlags[field]) {
                    invalidFieldFlags[field] = false
                    editAPIFunctionArgumentsRef.current[field] = sessionAPIFunctionArgumentsRef.current[field]
                }
            }
            if (service) {
                switch (service) {
                    case 'goto':{
                        APIdisabledFlags.scrolltoIndex = false
                        isInvalidTests.scrolltoIndex(editAPIFunctionArgumentsRef.current.scrolltoIndex)
                        break
                    }
                    case 'gotopixel': {
                        APIdisabledFlags.scrollToPixel = false
                        APIdisabledFlags.scrolltobehavior = false
                        isInvalidTests.scrollToPixel(editAPIFunctionArgumentsRef.current.scrollToPixel)
                        break
                    }
                    case 'gobypixel': {
                        APIdisabledFlags.scrollByPixel = false
                        APIdisabledFlags.scrollbybehavior = false
                        isInvalidTests.scrollByPixel(editAPIFunctionArgumentsRef.current.scrollByPixel)
                        break
                    }
                    case 'prependCount':{
                        APIdisabledFlags.prependCount = false
                        isInvalidTests.prependCount(editAPIFunctionArgumentsRef.current.prependCount)
                        break
                    }
                    case 'appendCount':{
                        APIdisabledFlags.appendCount = false
                        isInvalidTests.appendCount(editAPIFunctionArgumentsRef.current.appendCount)
                        break
                    }
                    case 'listrange':{
                        APIdisabledFlags.rangeAPIType = false
                        if (editAPIFunctionArgumentsRef.current.rangeAPIType == 'rangeAPIvalues') {
                            APIdisabledFlags.listLowIndex = false
                            APIdisabledFlags.listHighIndex = false
                            isInvalidTests.listLowIndex(editAPIFunctionArgumentsRef.current.listLowIndex)
                            isInvalidTests.listHighIndex(editAPIFunctionArgumentsRef.current.listHighIndex)
                        }
                        break
                    }
                    case 'reload':{

                        break
                    }
                    case 'insert':{
                        APIdisabledFlags.insertFrom = false
                        APIdisabledFlags.insertRange = false
                        isInvalidTests.insertFrom(editAPIFunctionArgumentsRef.current.insertFrom)
                        isInvalidTests.insertRange(editAPIFunctionArgumentsRef.current.insertRange)
                        break
                    }
                    case 'remove':{
                        APIdisabledFlags.removeFrom = false
                        APIdisabledFlags.removeRange = false
                        isInvalidTests.removeFrom(editAPIFunctionArgumentsRef.current.removeFrom)
                        isInvalidTests.removeRange(editAPIFunctionArgumentsRef.current.removeRange)
                        break
                    }
                    case 'move':{
                        APIdisabledFlags.moveFrom = false
                        APIdisabledFlags.moveRange = false
                        APIdisabledFlags.moveTo = false
                        isInvalidTests.moveFrom(editAPIFunctionArgumentsRef.current.moveFrom)
                        isInvalidTests.moveRange(editAPIFunctionArgumentsRef.current.moveRange)
                        isInvalidTests.moveTo(editAPIFunctionArgumentsRef.current.moveTo)
                        break
                    }
                    // case 'remap':{
                    //     APIdisabledFlags.remapDemo = false
                    //     break
                    // }
                    case 'clear':{

                        break
                    }
                }
            }
            setEditAPIFunctionArguments({...editAPIFunctionArgumentsRef.current})
        }

    }

    const updateIndexRange = () => { // for change of content type

        if (originalContentTypeSelectorRef.current === sessionContentTypeSelectorRef.current) {

            const [scrollerProps] = functionsAPIRef.current.getPropertiesSnapshot()
            indexRangeRef.current = scrollerProps.virtualListProps.range

            return

        }

        const contentTypeProperties = 
            sessionAllContentTypePropertiesRef.current[sessionContentTypeSelectorRef.current]
        if (contentTypeProperties.rangePropertyType = 'rangepropertyvalues') {
            indexRangeRef.current = // contentTypeProperties.startingListRange
                [contentTypeProperties.startingLowIndex,contentTypeProperties.startingHighIndex]
        } else {
            indexRangeRef.current = []
        }
        // console.log('updating sessionContentTypeSelectorRef, indexRangeRef, contentTypeProperties\n',sessionContentTypeSelectorRef, indexRangeRef, contentTypeProperties)

    }

    // --------------------------[ state change control ]------------------

    useEffect(()=>{

        optionsAPIRef.current = {
            getInvalidSections
        }
        
    },[])

    // state management
    useEffect(()=>{
        switch (optionsState) {
            case 'setup': {

                const [scrollerProps] = functionsAPIRef.current.getPropertiesSnapshot()
                indexRangeRef.current = scrollerProps.virtualListProps.range

                const contentSelection = sessionContentTypeSelectorRef.current

                updateFieldAccessFunctions.contentType(contentSelection)
                updateFieldAccessFunctions.APIFunctions()
                updateFieldAccessFunctions.propertyFields(contentSelection)
                updateFieldAccessFunctions.rangeAPI()
                setOptionsState('ready')
                break

            }

            case 'preparenewcontenttype': {
                updateIndexRange()
                setOptionsState('newcontenttype')
                break

            }
            case 'newcontenttype': {

                const contentSelection = sessionContentTypeSelectorRef.current

                updateFieldAccessFunctions.contentType(contentSelection)
                updateFieldAccessFunctions.propertyFields(contentSelection)
                setOptionsState('ready')
                break

            }
            case 'preparenewopfunctionselector': {

                setOptionsState('newopfunctionselector')
                break

            }
            case 'newopfunctionselector': {

                updateFieldAccessFunctions.APIFunctions(sessionOperationFunctionSelectorRef.current)
                updateFieldAccessFunctions.rangeAPI()
                setOptionsState('ready')
                break

            }
        }
    },[optionsState, updateFieldAccessFunctions])

    // ------------------------------[ render ]------------------------------
    

    return (

    <Box><VStack align = 'start' alignItems = 'stretch'>

        <FormControl  borderBottom = '1px solid black' paddingBottom = {3}>

            <FormLabel>Select Content Type</FormLabel>

            <Select 
                size = 'md'
                value = {editContentTypeSelector} 
                onChange = {onChangeFunctions.contentType}
            >
                <option value="uniformcontent">Uniform content</option>
                <option value="uniformpromises">Uniform promises</option>
                <option value="uniformautoexpand">Uniform auto expand</option>
                <option value="variablecontent">Variable content</option>
                <option value="variablepromises">Variable promises</option>
                <option value="variabledynamic">Variable dynamic</option>
                <option value="variableoversized">Variable oversized</option>
                <option value="variableautoexpand">Variable auto expand</option>
                <option value="nestinguniform">Nested uniform scrollers</option>
                <option value="nestingvariable">Nested variable scrollers</option>
                <option value="nestingmixed">Nested mixed scrollers</option>
                <option value="nestingmixedpromises">Nested mixed scroller promises</option>
                <option value="nestingmixedautoexpand">Nested mixed scroller auto expand</option>
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
                onChange = {onChangeFunctions.orientation}>
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

                        <FormControl isInvalid = {invalidFieldFlags.cellHeight}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>cellHeight:</FormLabel>

                                <NumberInput 
                                    value = {editContentTypeProperties.cellHeight} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.cellHeight}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.cellHeight}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid = {invalidFieldFlags.cellWidth}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>cellWidth:</FormLabel>

                                <NumberInput 
                                    value = {editContentTypeProperties.cellWidth} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.cellWidth}
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
                            isDisabled = {APIdisabledFlags.cellMinHeight}
                            isInvalid = {invalidFieldFlags.cellMinHeight}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>cellMinHeight:</FormLabel>

                                <NumberInput 
                                    value = {editContentTypeProperties.cellMinHeight} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.cellMinHeight}
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
                            isDisabled = {APIdisabledFlags.cellMinHeight}
                            isInvalid = {invalidFieldFlags.cellMinWidth}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>cellMinWidth:</FormLabel>

                                <NumberInput 
                                    value = {editContentTypeProperties.cellMinWidth} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.cellMinWidth}
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

                    <VStack>

                    <FormControl isInvalid = {invalidFieldFlags.padding} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                            <FormLabel htmlFor = 'padding' fontSize = 'sm'>padding:</FormLabel>

                            <Input 
                                value = {editContentTypeProperties.padding} 
                                size = 'sm'
                                onChange = {onChangeFunctions.padding}
                                id = 'padding'
                                // clampValueOnBlur = {false}
                            />
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.padding}
                        </FormErrorMessage>
                        <Text fontSize = 'sm' paddingBottom = {2}>
                            Blank, or integer, or comma separated list of 2-4 integers. These will be
                            formed into an array for the padding property. Padding applies to the scroller borders.
                        </Text>
                    </FormControl>

                    <FormControl isInvalid = {invalidFieldFlags.gap} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                            <FormLabel htmlFor = 'gap' fontSize = 'sm'>gap:</FormLabel>

                            <Input 
                                value = {editContentTypeProperties.gap} 
                                size = 'sm'
                                id = 'gap'
                                onChange = {onChangeFunctions.gap}
                                // clampValueOnBlur = {false}
                            />
                        </InputGroup>
                        <FormErrorMessage>
                            {errorMessages.gap}
                        </FormErrorMessage>
                        <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                            Blank, or integer, or comma separated list of 2 integers. These will be
                            formed into an array for the gap property. Gap applies to the grid gutters.
                        </Text>
                    </FormControl>

                    </VStack>

                    <Heading size = 'xs'>Starting index</Heading>
                    
                    <FormControl isInvalid = {invalidFieldFlags.startingIndex} >
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                            <FormLabel fontSize = 'sm'>startingIndex:</FormLabel>

                            <NumberInput 
                                value = {editContentTypeProperties.startingIndex} 
                                size = 'sm'
                                onChange = {onChangeFunctions.startingIndex}
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

                    <Heading size = 'xs'>Starting list range</Heading>

                    <RadioGroup 
                        value = {editContentTypeProperties.rangePropertyType} 
                        onChange = {onChangeFunctions.rangePropertyType}
                    >
                        <VStack align = 'start'>
                            <Radio value = 'rangepropertyvalues'>Range Values</Radio>

                            <Stack direction = {['column','row','row']}>
                            
                                <FormControl 
                                    isInvalid = {invalidFieldFlags.startingLowIndex} 
                                    isDisabled = {propertyDisabledFlags.startingLowIndex}
                                >
                                    <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                        <FormLabel fontSize = 'sm'>lowIndex:</FormLabel>

                                        <NumberInput 
                                            value = {editContentTypeProperties.startingLowIndex} 
                                            size = 'sm'
                                            onChange = {onChangeFunctions.startingLowIndex}
                                            clampValueOnBlur = {false}
                                        >
                                            <NumberInputField border = '2px' />
                                        </NumberInput>
                                    </InputGroup>

                                    <FormErrorMessage>
                                        {errorMessages.startingLowIndex}
                                    </FormErrorMessage>
                                </FormControl>

                                <FormControl 
                                    isInvalid = {invalidFieldFlags.startingHighIndex} 
                                    isDisabled = {propertyDisabledFlags.startingHighIndex}
                                >
                                    <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                        <FormLabel fontSize = 'sm'>highIndex:</FormLabel>

                                        <NumberInput 
                                            value = {editContentTypeProperties.startingHighIndex} 
                                            size = 'sm'
                                            onChange = {onChangeFunctions.startingHighIndex}
                                            clampValueOnBlur = {false}
                                        >
                                            <NumberInputField border = '2px' />
                                        </NumberInput>
                                    </InputGroup>

                                    <FormErrorMessage>
                                        {errorMessages.startingHighIndex}
                                    </FormErrorMessage>
                                </FormControl>

                            </Stack>

                            <Text fontSize = 'sm' paddingBottom = {2} color = {rangeTextColors.rangepropertyvalues}>
                                Integers. Either both or neither of <i>lowIndex</i> and <i>highIndex</i> must be set.&nbsp;
                                <i>Starting list range</i> if set will only apply right after a content type change. 
                                It will set the starting list range of the session for the content type. See also
                                'Change virtual list range' in the 'Service functions: operations' section.
                            </Text>

                            <Radio value = 'emptyrangeproperty'>Empty Virtual List</Radio>

                            <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px' color = {rangeTextColors.emptyrangeproperty}>
                                This selection will send an empty range array to the scroller, creating an empty virtual list.&nbsp;
                                It will only apply right after a content type change. 
                                See also 'Change virtual list range' in the 'Service functions: operations' section.
                            </Text>
                        </VStack>
                    </RadioGroup>

                    <Heading size = 'xs'>Runway size</Heading>
                    
                    <FormControl isInvalid = {invalidFieldFlags.runwaySize} >
                        <HStack>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                            <FormLabel fontSize = 'sm'>runwaySize:</FormLabel>

                            <NumberInput 
                                value = {editContentTypeProperties.runwaySize} 
                                size = 'sm'
                                onChange = {onChangeFunctions.runwaySize}
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
                            onChange = {onChangeFunctions.cache}
                        >
                            <option value="cradle">cradle</option>
                            <option value="keepload">keep load</option>
                            <option value="preload">preload</option>
                        </Select>
                    </FormControl>

                    <FormControl isInvalid = {invalidFieldFlags.cacheMax}>
                        <InputGroup size = 'sm' flexGrow = {1.2} alignItems = 'baseline'>

                            <FormLabel fontSize = 'sm'>cacheMax:</FormLabel>

                            <NumberInput 
                                value = {editContentTypeProperties.cacheMax} 
                                size = 'sm'
                                onChange = {onChangeFunctions.cacheMax}
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
                            onChange = {onChangeFunctions.showAxis}
                        >
                            Show axis
                        </Checkbox>
                        <FormHelperText>
                            For debug and instruction only. There is a CSS grid on either side of the axis.
                        </FormHelperText>
                    </FormControl>

                    </VStack>
                </AccordionPanel>

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
                            onChange = {onChangeFunctions.callbackSettings}
                        >
                            Reference index
                        </Checkbox>
                        <FormHelperText>
                            This reports the first index of the tail grid, near the top or left of the viewport.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {editCallbackFlags.boundaryCallback} 
                            size = 'sm'
                            mt = {2}
                            id = 'boundaryCallback'
                            onChange = {onChangeFunctions.callbackSettings}
                        >
                            Boundary callback
                        </Checkbox>
                        <FormHelperText>
                            This reports when the first or last index item of the virtual list is loaded into the Cradle.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {editCallbackFlags.preloadIndexCallback} 
                            size = 'sm'
                            mt = {2}
                            id = 'preloadIndexCallback'
                            onChange = {onChangeFunctions.callbackSettings}
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
                            onChange = {onChangeFunctions.callbackSettings}
                        >
                            Item Exceptions
                        </Checkbox>
                        <FormHelperText>
                            This reports details of a failed <Code>getItemPack</Code> call.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {editCallbackFlags.repositioningFlagCallback} 
                            size = 'sm'
                            mt = {2}
                            id = 'repositioningFlagCallback'
                            onChange = {onChangeFunctions.callbackSettings}
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
                            onChange = {onChangeFunctions.callbackSettings}
                        >
                            Repositioning Index
                        </Checkbox>
                        <FormHelperText>
                            During rapid repositioning mode, this streams the virtual location of the scroller.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {editCallbackFlags.changeListRangeCallback} 
                            size = 'sm'
                            mt = {2}
                            id = 'changeListRangeCallback'
                            onChange = {onChangeFunctions.callbackSettings}
                        >
                            List range change
                        </Checkbox>
                        <FormHelperText>
                            Reports change to list range (lowindex -&gt; highindex) for any standard reason.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Checkbox 
                            isChecked = {editCallbackFlags.deleteListCallback} 
                            size = 'sm'
                            mt = {2}
                            id = 'deleteListCallback'
                            onChange = {onChangeFunctions.callbackSettings}
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
                            onClick = {APISnapshotFunctions.getCacheIndexMap}
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
                            onClick = {APISnapshotFunctions.getCacheItemMap}
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
                            onClick = {APISnapshotFunctions.getCradleIndexMap}
                        >
                            Get Cradle Index Map
                        </Button>
                        <FormHelperText>
                            snapshot (javascript <Code>Map</Code>) of cradle <Code>index</Code> (=key) to 
                            scroller-assigned session <Code>itemID</Code> (=value) map.
                        </FormHelperText>
                    </FormControl>

                    <FormControl borderTop = '1px'>
                        <Button 
                            size = 'sm' 
                            mt = {2} 
                            type = 'button'
                            onClick = {APISnapshotFunctions.getPropertiesSnapshot}
                        >
                            Get Properties Snapshot
                        </Button>
                        <FormHelperText>
                            snapshot of scroller properties.
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

                    <Heading size = 'xs'>Scroll to index</Heading>

                    <HStack alignItems = 'baseline'>

                        <FormControl 
                            isDisabled = {APIdisabledFlags.scrolltoIndex}
                            isInvalid = {invalidFieldFlags.scrolltoIndex}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>index:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.scrolltoIndex} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.scrolltoIndex}
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
                                    onChange = {onChangeFunctions.onChangeEnabler} 
                                    id='goto' 
                                />
                            </InputGroup>
                        </FormControl>

                    </HStack>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. Go to the specified index number in the virtual list.
                    </Text>

                    <Heading size = 'xs'>Scroll to pixel</Heading>

                    <VStack alignItems = 'baseline'>

                        <FormControl 
                            isDisabled = {APIdisabledFlags.scrollToPixel}
                            isInvalid = {invalidFieldFlags.scrollToPixel}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>pixel:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.scrollToPixel} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.scrollToPixel}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.scrollToPixel}
                            </FormErrorMessage>
                        </FormControl>

                        <Text fontSize = 'sm' paddingBottom = {2} >
                            Integer. Scroll to the specified pixel number in the virtual list scrollblock.
                        </Text>

                        <FormControl
                            isDisabled = {APIdisabledFlags.scrolltobehavior}
                        >
                        <HStack alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>behavior:</FormLabel>
                            <Select 
                                value = {editAPIFunctionArguments.scrolltobehavior} 
                                flexGrow = {.8} 
                                size = 'sm'
                                onChange = {onChangeFunctions.scrolltobehavior}
                            >
                                <option value="">default behavior</option>
                                <option value="smooth">smooth</option>
                                <option value="instant">instant</option>
                                <option value="auto">auto</option>
                            </Select>
                        </HStack>
                        </FormControl>

                        <Text fontSize = 'sm' paddingBottom = {2} >
                            Default uses smooth behavior. Otherwise select behavior.
                        </Text>

                        <FormControl borderBottom = '1px'>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                                <FormLabel htmlFor='gotopixel' fontSize = 'sm'>Enable</FormLabel>

                                <Switch 
                                    isChecked = {functionEnabledSettings.gotopixel} 
                                    onChange = {onChangeFunctions.onChangeEnabler} 
                                    id='gotopixel' 
                                />

                            </InputGroup>
                        </FormControl>

                    </VStack>

                    <Heading size = 'xs'>Scroll by pixel</Heading>

                    <VStack alignItems = 'baseline'>

                        <FormControl 
                            isDisabled = {APIdisabledFlags.scrollByPixel}
                            isInvalid = {invalidFieldFlags.scrollByPixel}>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>pixel shift:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.scrollByPixel} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.scrollByPixel}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.scrollByPixel}
                            </FormErrorMessage>
                        </FormControl>

                        <Text fontSize = 'sm' paddingBottom = {2} >
                            Integer. Scroll the distance specified by the pixel ampunt, in the virtual list scrollblock.
                        </Text>

                        <FormControl
                            isDisabled = {APIdisabledFlags.scrollbybehavior}
                        >
                        <HStack alignItems = 'baseline'>
                            <FormLabel fontSize = 'sm'>behavior:</FormLabel>
                            <Select 
                                value = {editAPIFunctionArguments.scrollbybehavior} 
                                flexGrow = {.8} 
                                size = 'sm'
                                onChange = {onChangeFunctions.scrollbybehavior}
                            >
                                <option value="">default behavior</option>
                                <option value="smooth">smooth</option>
                                <option value="instant">instant</option>
                                <option value="auto">auto</option>
                            </Select>
                        </HStack>
                        </FormControl>

                        <Text fontSize = 'sm' paddingBottom = {2} >
                            Default uses smooth behavior. Otherwise select behavior.
                        </Text>

                        <FormControl borderBottom = '1px'>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                                <FormLabel htmlFor='gobypixel' fontSize = 'sm'>Enable</FormLabel>

                                <Switch 
                                    isChecked = {functionEnabledSettings.gobypixel} 
                                    onChange = {onChangeFunctions.onChangeEnabler} 
                                    id='gobypixel' 
                                />

                            </InputGroup>
                        </FormControl>

                    </VStack>

                    <Heading size = 'xs'>Change virtual list range</Heading>

                    <RadioGroup 
                        value = {editAPIFunctionArguments.rangeAPIType} 
                        onChange = {onChangeFunctions.rangeAPIType}
                        isDisabled = {APIdisabledFlags.rangeAPIType}
                    >
                        <VStack align = 'start'>
                            <Radio value = 'rangeAPIvalues'>Range Values</Radio>

                            <Stack direction = {['column','row','row']}>

                                <FormControl 
                                    isDisabled = {APIdisabledFlags.listLowIndex}
                                    isInvalid = {invalidFieldFlags.listLowIndex} >
                                    <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                        <FormLabel fontSize = 'sm'>low index:</FormLabel>

                                        <NumberInput 
                                            value = {editAPIFunctionArguments.listLowIndex} 
                                            size = 'sm'
                                            onChange = {onChangeFunctions.listLowIndex}
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
                                    isDisabled = {APIdisabledFlags.listHighIndex}
                                    isInvalid = {invalidFieldFlags.listHighIndex} >
                                    <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                        <FormLabel fontSize = 'sm'>high index:</FormLabel>

                                        <NumberInput 
                                            value = {editAPIFunctionArguments.listHighIndex} 
                                            size = 'sm'
                                            onChange = {onChangeFunctions.listHighIndex}
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

                            <Text fontSize = 'sm' paddingBottom = {2} color = {rangeTextColors.rangeAPIvalues}>
                                Integers. Set low and high indexes. high index must be greater than or equal to  
                                low index.
                            </Text>

                            <Radio value = 'emptyrangeAPI'>Empty Virtual List</Radio>

                            <Text fontSize = 'sm' paddingBottom = {2} color = {rangeTextColors.emptyrangeAPI}>
                                This selection will send an empty range array to the scroller, creating an empty virtual list.
                            </Text>
                        </VStack>
                    </RadioGroup>

                    <FormControl borderBottom = '1px' >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                            <FormLabel htmlFor='listrange' fontSize = 'sm'>Enable</FormLabel>

                            <Switch 
                                isChecked = {functionEnabledSettings.listrange} 
                                onChange = {onChangeFunctions.onChangeEnabler} 
                                id='listrange' 
                            />
                        </InputGroup>
                    </FormControl>

                    <Heading size = 'xs'>prepend index count to list range</Heading>

                    <HStack alignItems = 'baseline'>

                        <FormControl 
                            isDisabled = {APIdisabledFlags.prependCount}
                            isInvalid = {invalidFieldFlags.prependCount} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>count:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.prependCount} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.prependCount}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.prependCount}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                                <FormLabel htmlFor='prependCount' fontSize = 'sm'>Enable</FormLabel>

                                <Switch 
                                    isChecked = {functionEnabledSettings.prependCount} 
                                    onChange = {onChangeFunctions.onChangeEnabler} 
                                    id='prependCount' 
                                />
                            </InputGroup>
                        </FormControl>

                    </HStack>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. Prepend indexes to the virtual list.
                    </Text>

                    <Heading size = 'xs'>append index count to list range</Heading>

                    <HStack alignItems = 'baseline'>

                        <FormControl 
                            isDisabled = {APIdisabledFlags.appendCount}
                            isInvalid = {invalidFieldFlags.appendCount} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>count:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.appendCount} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.appendCount}
                                    clampValueOnBlur = {false}
                                >
                                    <NumberInputField border = '2px' />
                                </NumberInput>
                            </InputGroup>
                            <FormErrorMessage>
                                {errorMessages.appendCount}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl>
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                                <FormLabel htmlFor='appendCount' fontSize = 'sm'>Enable</FormLabel>

                                <Switch 
                                    isChecked = {functionEnabledSettings.appendCount} 
                                    onChange = {onChangeFunctions.onChangeEnabler} 
                                    id='appendCount' 
                                />
                            </InputGroup>
                        </FormControl>

                    </HStack>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integer. Append indexes to the virtual list.
                    </Text>

                    <Heading size = 'xs'>Insert indexes</Heading>

                    <Stack direction = {['column','row','row']}>

                        <FormControl 
                            isDisabled = {APIdisabledFlags.insertFrom}
                            isInvalid = {invalidFieldFlags.insertFrom} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>from:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.insertFrom} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.insertFrom}
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
                            isDisabled = {APIdisabledFlags.insertRange}
                            isInvalid = {invalidFieldFlags.insertRange} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>range:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.insertRange} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.insertRange}
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
                                onChange = {onChangeFunctions.onChangeEnabler} 
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
                            isDisabled = {APIdisabledFlags.removeFrom}
                            isInvalid = {invalidFieldFlags.removeFrom} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>from:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.removeFrom} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.removeFrom}
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
                            isDisabled = {APIdisabledFlags.removeRange}
                            isInvalid = {invalidFieldFlags.removeRange} >
                            <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                                <FormLabel fontSize = 'sm'>range:</FormLabel>

                                <NumberInput 
                                    value = {editAPIFunctionArguments.removeRange} 
                                    size = 'sm'
                                    onChange = {onChangeFunctions.removeRange}
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
                                onChange = {onChangeFunctions.onChangeEnabler} 
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
                        isDisabled = {APIdisabledFlags.moveFrom}
                        isInvalid = {invalidFieldFlags.moveFrom} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                            <FormLabel fontSize = 'sm'>from:</FormLabel>

                            <NumberInput 
                                value = {editAPIFunctionArguments.moveFrom} 
                                size = 'sm'
                                onChange = {onChangeFunctions.moveFrom}
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
                        isDisabled = {APIdisabledFlags.moveRange}
                        isInvalid = {invalidFieldFlags.moveRange} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                            <FormLabel fontSize = 'sm'>range:</FormLabel>

                            <NumberInput 
                                value = {editAPIFunctionArguments.moveRange} 
                                size = 'sm'
                                onChange = {onChangeFunctions.moveRange}
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
                        isDisabled = {APIdisabledFlags.moveTo}
                        isInvalid = {invalidFieldFlags.moveTo} >
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline'>

                            <FormLabel fontSize = 'sm'>to:</FormLabel>

                            <NumberInput 
                                value = {editAPIFunctionArguments.moveTo} 
                                size = 'sm'
                                onChange = {onChangeFunctions.moveTo}
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
                                onChange = {onChangeFunctions.onChangeEnabler} 
                                id='move' 
                            />
                        </InputGroup>
                    </FormControl>

                    <Text fontSize = 'sm' paddingBottom = {2} borderBottom = '1px'>
                        Integers. Move one or more indexes. 'range' is optional, and must be equal to or 
                        above the 'from' value.
                    </Text> 

                    <Heading size = 'xs'>Reload the cache</Heading>
                    <FormControl>
                        <InputGroup size = 'sm' flexGrow = {1} alignItems = 'baseline' mt = {2}>

                            <FormLabel htmlFor='reload' fontSize = 'sm'>Enable</FormLabel>

                            <Switch 
                                isChecked = {functionEnabledSettings.reload} 
                                onChange = {onChangeFunctions.onChangeEnabler} 
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
                                onChange = {onChangeFunctions.onChangeEnabler} 
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