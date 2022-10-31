// copyright (c) 2022 Henrik Bechmann, Toronto

import React from 'react'

import GridScroller from 'react-infinite-grid-scroller'

const Scroller = ({demoAllContentTypeProperties, demoContentType}:any) => {

    return <GridScroller key = {demoContentType} {...demoAllContentTypeProperties[demoContentType]}/>
}

export default Scroller