import React from 'react'

import GridScroller from 'react-infinite-grid-scroller'

const Scroller = ({applyProperties, contentType}:any) => {

    return <GridScroller {...applyProperties[contentType]}/>
}

export default Scroller