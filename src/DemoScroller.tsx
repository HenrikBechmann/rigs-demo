// copyright (c) 2022 Henrik Bechmann, Toronto

import React from 'react'

import GridScroller from 'react-infinite-grid-scroller'

const Scroller = ({demoAllContentTypeProperties, demoContentTypeSelector}:any) => {

    return <GridScroller key = {demoContentTypeSelector} {...demoAllContentTypeProperties[demoContentTypeSelector]}/>
}

export default Scroller