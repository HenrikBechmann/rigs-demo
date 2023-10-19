// copyright (c) 2022 Henrik Bechmann, Toronto

import React, {useRef} from 'react'

import {testUniformData, testVariableData, testNestingAccepts, acceptAll, GenericObject} from './demodata'

import GridScroller, { RigsDnd as DndScroller } from 'react-infinite-grid-scroller'

const getDropEffect = (sourceScrollerID:number, targetScrollerID:number, context:GenericObject) => {

    let hostDropEffect

    // if (sourceScrollerID === targetScrollerID) {

    //     hostDropEffect = 'move'

    // } else {

    //     hostDropEffect = 'copy'

    // }

    // console.log('getDropEffect: context',context)

    return hostDropEffect

}

const testDataSource:GenericObject = {

  uniformcontent:testUniformData,
  uniformpromises:testUniformData,
  uniformautoexpand:testUniformData,
  variablecontent:testVariableData,
  variablepromises:testVariableData,
  variabledynamic:testVariableData,
  variableoversized:testVariableData,
  variableautoexpand:testVariableData,
  nestingmixed:testNestingAccepts,
  nestingmixedpromises:testNestingAccepts,
  nestingmixedautoexpand:testNestingAccepts,
  nestinguniform:testNestingAccepts,
  nestingvariable:testNestingAccepts,

}

const Scroller = (
    {
        demoAllContentTypeProperties, 
        demoContentTypeSelector, 
        dndinstalled, 
        dndmasterenabled, 
        dndrootenabled
    }:any) => {

    console.log('dndinstalled, dndmasterenabled, dndrootenabled',dndinstalled, dndmasterenabled, dndrootenabled)

    // const 
    //     dndinstalled = false,
    //     dndmasterenabled = false,
    //     dndrootenabled = false

    const testData = testDataSource[demoContentTypeSelector]

    const demoContentTypeSelectorRef = useRef(demoContentTypeSelector)

    const dndOptionsRef = useRef<GenericObject | null>(null)
    const profileRef = useRef<GenericObject | null>(null)
    const acceptRef = useRef<string[] | null>(null)

    // choose accept list. All options are listed to be explicit

    if (demoContentTypeSelector != demoContentTypeSelectorRef.current || !acceptRef.current) {

        let accept
        if (['uniformcontent','uniformpromises','uniformautoexpand','variablecontent','variablepromises',
            'variabledynamic','variableoversized','variableautoexpand'].includes(demoContentTypeSelector)) {

            accept = acceptAll(testData)
            acceptRef.current = accept

        } else if (['nestingmixed','nestingmixedpromises','nestingmixedautoexpand',
            'nestinguniform','nestingvariable'].includes(demoContentTypeSelector)) {

            if (['nestingmixed','nestingmixedpromises','nestingmixedautoexpand',].includes(demoContentTypeSelector)) {
                accept = testNestingAccepts.mixed
            } else if (demoContentTypeSelector == 'nestinguniform') {
                accept = testNestingAccepts.uniform
            } else if (demoContentTypeSelector == 'nestingvariable') {
                accept = testNestingAccepts.variable
            }
            acceptRef.current = accept

        }

        demoContentTypeSelectorRef.current = demoContentTypeSelector

    }

    if (dndinstalled) {

        const dndOptions = {
            accept:acceptRef.current,
            master:{enabled:dndmasterenabled},
            enabled:dndrootenabled,
            dropEffect:undefined // 'move' //'copy',
        }

        const profile = {accept:dndOptions.accept}

        dndOptionsRef.current = dndOptions
        profileRef.current = profile

        const props = {
            ...demoAllContentTypeProperties[demoContentTypeSelector],
            profile:profileRef.current, 
            dndOptions:dndOptionsRef.current,
            getDropEffect,
        }

        return <DndScroller key = {demoContentTypeSelector} {...props}/>

    } else { // dnd not installed

        console.log('running not installed')
        const profile = {
            accept:acceptRef.current,
        }

        // console.log('GridScroller dndOptions',dndOptions, testData)

        profileRef.current = profile

        // const props = {dndOptions:dndOptionsRef.current,...demoAllContentTypeProperties[demoContentTypeSelector]}
        const props = {
            ...demoAllContentTypeProperties[demoContentTypeSelector],
            profile:profileRef.current, 
        }

        return <GridScroller key = {demoContentTypeSelector} {...props}/>        

    }

}

export default Scroller