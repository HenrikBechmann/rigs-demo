import React from 'react'

import GridScroller from 'react-infinite-grid-scroller'

const Scroller = ({applyProperties, contentType}:any) => {

    return <GridScroller key = {contentType} {...applyProperties[contentType]}/>
}

export default Scroller