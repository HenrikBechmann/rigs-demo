import React from 'react'

import GridScroller from 'react-infinite-grid-scroller'

const Scroller = ({displayProperties, contentType}:any) => {

    return <GridScroller {...displayProperties[contentType]}/>
}

export default Scroller