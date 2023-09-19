// copyright (c) 2022 Henrik Bechmann, Toronto

import React, {useRef} from 'react'

import {testUniformData, testVariableData, testNestingAccepts, acceptAll, GenericObject} from './demodata'

import GridScroller, { RigsDnd as DndScroller } from 'react-infinite-grid-scroller'

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

    // if (demoContentTypeSelector != demoContentTypeSelectorRef.current || !dndOptionsRef.current) {

    //         demoContentTypeSelectorRef.current = demoContentTypeSelector
    //     const dndOptions = {
    //         accept:acceptAll(testData),
    //     }

    //     dndOptionsRef.current = dndOptions

    // }

    // const props = {dndOptions:dndOptionsRef.current,...demoAllContentTypeProperties[demoContentTypeSelector]}

    if ([/*'simplecontent',*/'simplepromises','simpleautoexpand','variablecontent','variablepromises',
        'variabledynamic','variableoversized','variableautoexpand'].includes(demoContentTypeSelector)) {

        if (demoContentTypeSelector != demoContentTypeSelectorRef.current || !dndOptionsRef.current) {

            demoContentTypeSelectorRef.current = demoContentTypeSelector

            const dndOptions = {
                accept:acceptAll(testData),
            }

            dndOptionsRef.current = dndOptions

        }

        const props = {dndOptions:dndOptionsRef.current,...demoAllContentTypeProperties[demoContentTypeSelector]}

        return <DndScroller key = {demoContentTypeSelector} {...props}/>

    } else if (['nestingmixed','nestingmixedpromises','nestingmixedautoexpand',
        'nestinguniform','nestingvariable'].includes(demoContentTypeSelector)){

        if (demoContentTypeSelector != demoContentTypeSelectorRef.current || !dndOptionsRef.current) {

            demoContentTypeSelectorRef.current = demoContentTypeSelector

            let accept
            if (['nestingmixed','nestingmixedpromises','nestingmixedautoexpand',].includes(demoContentTypeSelector)) {
                accept = testNestingAccepts.mixed
            } else if (demoContentTypeSelector == 'nestinguniform') {
                accept = testNestingAccepts.uniform
            } else if (demoContentTypeSelector == 'nestingvariable') {
                accept = testNestingAccepts.variable
            }

            const dndOptions = {
                accept,
            }

            dndOptionsRef.current = dndOptions

        }

        const props = {dndOptions:dndOptionsRef.current,...demoAllContentTypeProperties[demoContentTypeSelector]}

        return <DndScroller key = {demoContentTypeSelector} {...props}/>

    } else {

        if (demoContentTypeSelector != demoContentTypeSelectorRef.current || !dndOptionsRef.current) {

                demoContentTypeSelectorRef.current = demoContentTypeSelector
            const dndOptions = {
                accept:acceptAll(testData),
            }

            dndOptionsRef.current = dndOptions

        }

        const props = {dndOptions:dndOptionsRef.current,...demoAllContentTypeProperties[demoContentTypeSelector]}

        // return <GridScroller key = {demoContentTypeSelector} {...demoAllContentTypeProperties[demoContentTypeSelector]}/>        
    
        return <GridScroller key = {demoContentTypeSelector} {...props}/>        

    }

}

export default Scroller