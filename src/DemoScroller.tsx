// copyright (c) 2022 Henrik Bechmann, Toronto

import React, {useRef} from 'react'

import {testUniformData, testVariableData, acceptAll, GenericObject} from './demodata'

// import GridScroller from 'react-infinite-grid-scroller'

import { RigsDnd as GridScroller } from 'react-infinite-grid-scroller'

const testDataSource:GenericObject = {

  simplecontent:testUniformData,
  simplepromises:testUniformData,
  simpleautoexpand:testUniformData,
  variablecontent:testVariableData,
  variablepromises:testVariableData,
  variabledynamic:testVariableData,
  variableoversized:testVariableData,
  nestedcontent:"",
  nestedpromises:"",
  sharedcache:"",
  draggablenested:"",

}

const Scroller = ({demoAllContentTypeProperties, demoContentTypeSelector}:any) => {

    const testData = testDataSource[demoContentTypeSelector]

    const demoContentTypeSelectorRef = useRef(demoContentTypeSelector)

    const dndOptionsRef = useRef({accepts:acceptAll(testData)})

    if (demoContentTypeSelector != demoContentTypeSelectorRef.current) {

        demoContentTypeSelectorRef.current = demoContentTypeSelector

        dndOptionsRef.current.accepts = acceptAll(testData)

    }

    const props = {dndOptions:dndOptionsRef.current,...demoAllContentTypeProperties[demoContentTypeSelector]}

    return <GridScroller key = {demoContentTypeSelector} {...props}/>

}

export default Scroller