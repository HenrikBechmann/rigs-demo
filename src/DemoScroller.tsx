// copyright (c) 2022 Henrik Bechmann, Toronto

import React, {useRef} from 'react'

import {testUniformData, acceptAll} from './demodata'

// import GridScroller from 'react-infinite-grid-scroller'

import { RigsDnd as GridScroller } from 'react-infinite-grid-scroller'

const Scroller = ({demoAllContentTypeProperties, demoContentTypeSelector}:any) => {

    const dndOptionsRef = useRef({accepts:acceptAll(testUniformData)})

    // console.log('dndOptions',dndOptionsRef.current)

    const props = {dndOptions:dndOptionsRef.current,...demoAllContentTypeProperties[demoContentTypeSelector]}

    return <GridScroller key = {demoContentTypeSelector} {...props}/>

}

export default Scroller