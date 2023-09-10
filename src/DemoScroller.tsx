// copyright (c) 2022 Henrik Bechmann, Toronto

import React, {useRef} from 'react'

import {testUniformData, testVariableData, testNestedAccepts, acceptAll, GenericObject} from './demodata'

import GridScroller from 'react-infinite-grid-scroller'

import { RigsDnd as DndScroller } from 'react-infinite-grid-scroller'

const testDataSource:GenericObject = {

  simplecontent:testUniformData,
  simplepromises:testUniformData,
  simpleautoexpand:testUniformData,
  variablecontent:testVariableData,
  variablepromises:testVariableData,
  variabledynamic:testVariableData,
  variableoversized:testVariableData,
  variableautoexpand:testVariableData,
  nestingmixed:testNestedAccepts,
  nestingmixedpromises:{},
  nestinguniform:{},
  nestingmixedautoexpand:{},

}

const Scroller = ({demoAllContentTypeProperties, demoContentTypeSelector}:any) => {

    const testData = testDataSource[demoContentTypeSelector]

    const demoContentTypeSelectorRef = useRef(demoContentTypeSelector)

    const dndOptionsRef = useRef<GenericObject | null>(null)

    if (['simplecontent','simplepromises','simpleautoexpand','variablecontent','variablepromises',
        'variabledynamic','variableoversized','variableautoexpand'].includes(demoContentTypeSelector)) {

        if (demoContentTypeSelector != demoContentTypeSelectorRef.current || !dndOptionsRef.current) {

            demoContentTypeSelectorRef.current = demoContentTypeSelector

            const dndOptions = {
                accepts:acceptAll(testData),
            }

            dndOptionsRef.current = dndOptions

        }

        const props = {dndOptions:dndOptionsRef.current,...demoAllContentTypeProperties[demoContentTypeSelector]}

        return <DndScroller key = {demoContentTypeSelector} {...props}/>

    } else {

        return <GridScroller key = {demoContentTypeSelector} {...demoAllContentTypeProperties[demoContentTypeSelector]}/>        
    
    }

}

export default Scroller