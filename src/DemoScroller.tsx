// copyright (c) 2022 Henrik Bechmann, Toronto

import React, {useRef} from 'react'

import {testUniformData, testVariableData, testNestingAccepts, acceptAll, GenericObject} from './demodata'

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
  nestingmixed:testNestingAccepts,
  nestingmixedpromises:testNestingAccepts,
  nestingmixedautoexpand:testNestingAccepts,
  nestinguniform:testNestingAccepts,
  nestingvariable:testNestingAccepts,

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

    } else if (['nestingmixed','nestingmixedpromises','nestingmixedautoexpand',
        'nestinguniform','nestingvariable'].includes(demoContentTypeSelector)){

        if (demoContentTypeSelector != demoContentTypeSelectorRef.current || !dndOptionsRef.current) {

            demoContentTypeSelectorRef.current = demoContentTypeSelector

            let accepts
            if (['nestingmixed','nestingmixedpromises','nestingmixedautoexpand',].includes(demoContentTypeSelector)) {
                accepts = testNestingAccepts.mixed
            } else if (demoContentTypeSelector == 'nestinguniform') {
                accepts = testNestingAccepts.uniform
            } else if (demoContentTypeSelector == 'nestingvariable') {
                accepts = testNestingAccepts.variable
            }

            const dndOptions = {
                accepts,
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