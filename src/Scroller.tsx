import React from 'react'

import GridScroller from 'react-infinite-grid-scroller'

const Scroller = (props:any) => {
    // console.log('running Scroller', props)
    return <GridScroller {...props.properties}/>
}

export default Scroller