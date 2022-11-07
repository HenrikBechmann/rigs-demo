// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

import React, {useRef, useState, useEffect} from 'react'

import Scroller from 'react-infinite-grid-scroller'

/*
    CONTENT TYPES are defined just below the SCROLLER CALLBACKS section.
*/

// ==============================[ SCROLLER CALLBACKS ]=========================

/*
    These scroller callbacks are sent to each of the five content types. They can be activated
    in the Callbacks section of the demo Options drawer.
*/

// these settings are selected in the Callbacks section of the Options drawer
// they control the firing of the callbacks. The demo callbacks, when activated, send feedback
// to the browser console.
export const defaultCallbackSettings = {
    referenceIndexCallback:false,
    repositioningIndexCallback:false,
    preloadIndexCallback:false,
    itemExceptionCallback:false,
    changeListsizeCallback:false,
    deleteListCallback:false,
    repositioningFlagCallback:false,
}

// initialize the demo settings with the default settings. These can ba changed in
// the Callbacks section of the Options drawer
export const demoCallbackSettingsRef = {current:{...defaultCallbackSettings} as GenericObject}


// -----------------
// the indivicual callbacks definitions follow...

const referenceIndexCallback = (index:number, location:string, cradleState:string) => {

    demoCallbackSettingsRef.current.referenceIndexCallback && 
        console.log('referenceIndexCallback: index, location, cradleState',
            index, location, cradleState)
   
}
const preloadIndexCallback = (index:number) => {
    
    demoCallbackSettingsRef.current.preloadIndexCallback && 
        console.log('preloadIndexCallback: index', 
            index)

}
const deleteListCallback = (reason:string, deleteList:number[]) => {
    
    demoCallbackSettingsRef.current.deleteListCallback && 
        console.log('deleteListCallback: reason, deleteList',
            reason, deleteList)

}
const repositioningIndexCallback = (index:number) => {
    
    demoCallbackSettingsRef.current.repositioningIndexCallback && 
        console.log('repositioningIndexCallback: index',
            index)

}

const repositioningFlagCallback = (flag:boolean) => {
    
    demoCallbackSettingsRef.current.repositioningFlagCallback && 
        console.log('repositioningFlagCallback: index',
            flag)

}

const changeListsizeCallback = (newlistsize:number) => {
    
    demoCallbackSettingsRef.current.changeListsizeCallback && 
        console.log('changeListsizeCallback: newlistsize', 
            newlistsize)

}

const itemExceptionCallback = (index:number, itemID:number, returnvalue:any, location:string, error:Error) => {
    
    demoCallbackSettingsRef.current.itemExceptionCallback && 
        console.log('itemExceptionCallback: index, itemID, returnvalue, location, error',
            index, itemID, returnvalue, location, error)

}

// the functions object is used by the Options drawer for the snapshots,
// and by the main app for the operations functions selected in the Options drawer.
// the functions are instantiated in the scroller, by the functionsCallback below
export const functionsObjectRef = {current:{} as GenericObject}

// the functions callback returns the funtions API to the caller
const functionsCallback = (functions:GenericObject) => {
    functionsObjectRef.current = functions
}

// -----------------
// The callbacks are bundled for inclusion in the various content type scroller properties below.

const callbacks = {
    functionsCallback,
    referenceIndexCallback,
    repositioningIndexCallback,
    preloadIndexCallback,
    itemExceptionCallback,
    changeListsizeCallback,
    deleteListCallback,
    repositioningFlagCallback,
}

// ==================================[ CONTENT TYPES ]==========================

// -----------------------------[ Simple uniform content ]------------------------

// -----------------
// simple uniform content component definition

// styles for the simple uniform content components
const simpleComponentStyles = {
    inner: {
        position:'absolute',
        top:0,
        left:0,
        padding:'3px',
        backgroundColor:'white', 
        margin:'3px'
    } as React.CSSProperties,
    outer: {
        position:'relative',
        height:'100%', 
        width:'100%',
        backgroundColor:'white',
        border: '1px solid black',
        borderRadius:'8px',
    } as React.CSSProperties
}

// the simple uniform content component
const SimpleItem = (props:any) => {

    const originalindexRef = useRef(props.index)

    return <div style = {simpleComponentStyles.outer}>
        <div style = {simpleComponentStyles.inner}>
            {originalindexRef.current + 1}
        </div>
    </div>

}

// -----------------
// scroller property values for simple uniform content component

// the getItem function for simple uniform content
const getSimpleItem = (index:number) => {

     if (index == 30) return Promise.reject(new Error('not found for demo purposes'))
     if (index == 40) return 5

     const returnvalue = <SimpleItem index = {index} />

     return returnvalue

}

// scroller styles
const simpleScrollerStyles = {
    placeholdererrorframe: {
        borderRadius:'8px',
        backgroundColor:'pink',
    },
}

// placeholder messages
const simplePlaceholderMessages = {
    invalid:'invalid component sent for demo purposes'
}

// properties for the simple uniform content scroller
const simplecontent = {
    startingIndex:0,
    estimatedListSize:300,
    orientation:'vertical',
    cellHeight:150,
    cellWidth:150,
    padding:10,
    gap:5,
    runwaySize:4,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem:getSimpleItem,
    styles:simpleScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
}

// -----------------------------[ Simple uniform promises ]------------------------

// the simple content definitions above are used for these promises, except for the following...

// -----------------
// substitute scroller property values for this content

// the getItem function for simple uniform promises
const getSimpleItemPromise = (index:number) => {

    return new Promise((resolve, reject) => {

        setTimeout(()=> {

            resolve(<SimpleItem index = {index} />)

        },400 + (Math.random() * 2000))

    })

}

const simplePromisesScrollerStyles = {
    placeholderframe: {
        borderRadius:'8px',
        backgroundColor:'palegreen',
    },
}


// properties for the simple promises scroller
const simplepromises = {
    startingIndex:0,
    estimatedListSize:300,
    orientation:'vertical',
    cellHeight:150,
    cellWidth:150,
    padding:10,
    gap:5,
    runwaySize:4,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem:getSimpleItemPromise,
    styles:simplePromisesScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
}

// ------------------------[ variable content ]----------------------------

// -----------------
// variable content component definition

let variableComponentStyles = {
    outer:{
        backgroundColor:'white',
        overflow:'scroll',
    } as React.CSSProperties,
    inner:{
        padding:'3px',
        border:'1px solid black',
        borderRadius:'8px',
        backgroundColor:'white', 
    } as React.CSSProperties
}

// const teststring = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Purus non enim praesent elementum facilisis leo. At volutpat diam ut venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed elementum tempus egestas sed sed risus pretium quam. Tristique risus nec feugiat in fermentum. Sem fringilla ut morbi tincidunt. Malesuada nunc vel risus commodo. Nulla pellentesque dignissim enim sit amet venenatis urna cursus. In egestas erat imperdiet sed euismod nisi porta.'
const teststring = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst.'

const getVariableTestString = (index:number) => {
    let teststr
    // if (!teststrings[index]) {
        if ([0,1,51,52,196,197,198,199].includes(index)) {
            teststr = 'SHORT STRING ' + (index + 1) // short string
        } else if (index == 0) {
            teststr =`${index + 1}: 'test string ' + ${teststring.substr(0,.5 * teststring.length)}`
        } else {
            teststr =`${index + 1}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`
        }
    // }
    return teststr
}

const VariableItem = (props:any) => {

    const testStringRef = useRef(getVariableTestString(props.index))

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerProperties.scrollerPropertiesRef.current

    const orientationstyles = 
        (orientation == 'vertical')?
            {
                maxHeight:cellHeight,
                height:'',
                maxWidth:'',
                width:'100%',
            }:
            {
                maxHeight:'',
                height:'100%',
                maxWidth:cellWidth,
                width:'',
            }

    const outerstyles = {...variableComponentStyles.outer, ...orientationstyles}

    return <div style = {outerstyles}>
        <div style = {variableComponentStyles.inner}>{testStringRef.current}</div>
    </div>
}

// -----------------
// scroller property values for variable content

const getVariableItem = (index:number) => {

     return <VariableItem index = {index} scrollerProperties = {null}/>    

}

const variableScrollerStyles = {

}

const variablePlaceholderMessages = {
    
}

const variablecontent = {
    startingIndex:0,
    estimatedListSize:200,
    orientation:'vertical',
    cellHeight:320,
    cellWidth:250,
    cellMinHeight:25,
    cellMinWidth:25,
    padding:10,
    gap:5,
    runwaySize:5,
    cache:'cradle',
    cacheMax:200,
    layout: 'variable',

    getItem:getVariableItem,
    styles:variableScrollerStyles,
    placeholderMessages: variablePlaceholderMessages,
    callbacks,
}
// ------------------------[ variable promises ]----------------------------

// -----------------
// replacement scroller property values for variable promises

const getVariableItemPromise = (index:number) => {

    return new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(<VariableItem index = {index} scrollerProperties = {null}/>)

        },400 + (Math.random() * 2000))
    })

}

const variablepromises = {
    startingIndex:0,
    estimatedListSize:200,
    orientation:'vertical',
    cellHeight:320,
    cellWidth:250,
    cellMinHeight:25,
    cellMinWidth:25,
    padding:10,
    gap:5,
    runwaySize:5,
    cache:'cradle',
    cacheMax:200,
    layout: 'variable',

    getItem:getVariableItemPromise,
    styles:variableScrollerStyles,
    placeholderMessages: variablePlaceholderMessages,
    callbacks,
}
// ------------------------[ variable dynamic ]----------------------------

// -----------------
// variable dynamic content component definition

const getDynamicTestString = (index:number) => {

    return `${index + 1}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`

}

const VariableItemDynamic = (props:any) => {

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerProperties.scrollerPropertiesRef.current

    const orientationstyles = 
        (orientation == 'vertical')?
            {
                maxHeight:cellHeight,
                height:'',
                maxWidth:'',
                width:'100%',
            }:
            {
                maxHeight:'',
                height:'100%',
                maxWidth:cellWidth,
                width:'',
            }

    const outerstyles = {...variableComponentStyles.outer, ...orientationstyles}

    const originalindexRef = useRef(props.index)

    const intervalRef = useRef<NodeJS.Timer | null>(null)

    const [teststring, setTeststring] = useState('test string')
    const teststringRef = useRef<string>()
    teststringRef.current = teststring
    const iterationRef = useRef(0)

    useEffect(()=>{
        intervalRef.current = setInterval(() => {
            iterationRef.current ++
            const teststringinstance = getDynamicTestString(props.index)
            // console.log('iteration:', iterationRef.current )
            setTeststring(teststringinstance)

        },200 + (Math.random() * 2000))

        return () => {
            clearInterval(intervalRef.current as NodeJS.Timer)
        }

    },[])

    return <div style = {outerstyles}>
        <div style = {variableComponentStyles.inner}>{teststringRef.current}</div>
    </div>

}

// -----------------
// scroller property values for this content

const getVariableItemDynamic = (index:number) => {

     return <VariableItemDynamic index = {index} scrollerProperties = {null}/>    

}

const variabledynamic = {
    startingIndex:0,
    estimatedListSize:200,
    orientation:'vertical',
    cellHeight:320,
    cellWidth:250,
    cellMinHeight:25,
    cellMinWidth:25,
    padding:10,
    gap:5,
    runwaySize:5,
    cache:'cradle',
    cacheMax:200,
    layout: 'variable',

    getItem:getVariableItemDynamic,
    styles:variableScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
}
// ---------------------------------[ nested scrollers ]------------------

// -----------------
// nested scroller component definition

const nestedScrollerComponentStyles = {
    container: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:'beige',
        height:'100%',
        borderRadius:'8px',
        border:'6px ridge gray',
    } as React.CSSProperties,
    header:{
        padding:'3px',
        backgroundColor:'silver',
        border:'2p solid darkgray',
    } as React.CSSProperties,
    frame:{
        position:'relative',
        width:'100%',
        backgroundColor:'beige',
        flex:'1',
    } as React.CSSProperties,
}

const NestedScroller = (props:any) => {

    const [testState, setTestState] = useState('setup')
    const testStateRef = useRef<string|null>(null)
    testStateRef.current = testState

    const { 
        index, 
        scrollerProperties,
    } = props

    const variant = 
        ((index % 2) == 0)?
        'uniform':
        'variable'

    const properties = 
        (variant == 'uniform')?
        nestedUniformScrollerProperties:
        nestedVariableScrollerProperties

    const {
        orientation, 
        gap, 
        padding, 
        cellHeight, 
        cellWidth, 
        runwaySize, 
        startingIndex, 
        estimatedListSize, 
        getItem, 
        cache,
        layout,
    } = properties

    const { scrollerPropertiesRef } = scrollerProperties

    const dynamicorientationRef = useRef<null | string>(null)

    useEffect(() =>{

        const { orientation } = scrollerPropertiesRef.current
        dynamicorientationRef.current = 
            (orientation == 'vertical')?
                'horizontal':
                'vertical'

    },[scrollerPropertiesRef.current.orientation])

    const { listsize } = scrollerPropertiesRef.current

    useEffect(()=>{

        switch (testState) {
            case 'setup':
            case 'revised': {
                setTestState('ready')
                break
            }
        }

    },[testState])

    return <div data-type = "list-frame" style = {nestedScrollerComponentStyles.container} >
        <div data-type = "list-header" style = {nestedScrollerComponentStyles.header} >
            List #{index + 1} of {listsize}
        </div>
        <div data-type = "list-content" style = {nestedScrollerComponentStyles.frame}>

            <Scroller 
                orientation = { dynamicorientationRef.current } 
                cache = { cache }
                gap = {gap}
                padding = {padding}
                cellHeight = {cellHeight}
                cellWidth = {cellWidth}
                runwaySize = {runwaySize}
                estimatedListSize = {estimatedListSize}
                startingIndex = {startingIndex}
                getItem = {getItem}
                callbacks = {null}
                placeholder = {null}
                styles = { null }
                layout = { layout }
                scrollerProperties = { scrollerProperties }
            />

        </div>

    </div>

}

// -----------------
// content for variable scroller variant

const getVariableNestedTestString = (index:number) => {

    const str =`${index + 1}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`

    return str
}

const VariableNestedItem = (props:any) => {

    const testStringRef = useRef(getVariableNestedTestString(props.index))

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerProperties.scrollerPropertiesRef.current

    const orientationstyles = 
        (orientation == 'vertical')?
            {
                maxHeight:cellHeight,
                height:'',
                maxWidth:'',
                width:'100%',
            }:
            {
                maxHeight:'',
                height:'100%',
                maxWidth:cellWidth,
                width:'',
            }

    const outerstyles = {...variableComponentStyles.outer, ...orientationstyles}

    return <div style = {outerstyles}>
        <div style = {variableComponentStyles.inner}>{testStringRef.current}</div>
    </div>
}

const getVariableNestedItem = (index:number) => {

     return <VariableNestedItem index = {index} scrollerProperties = {null}/>    

}

// -----------------
// properties for variable scroller variant

const nestedVariableScrollerProperties = {

    startingIndex:0,
    estimatedListSize:100,
    orientation:'vertical',
    cellHeight:300,
    cellWidth:250,
    padding:6,
    gap:2,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'variable',

    getItem: getVariableNestedItem,
    styles:null,
    placeholderMessages: null,
    callbacks:null,

}

// -----------------
// uniform content variant component definition

const uniformNestedItemStyle = {
        padding:'3px',
        border:'1px solid green',
        backgroundColor:'white',
        height:'100%',
        boxSizing:'border-box',
    } as React.CSSProperties

// -----------------
// uniform content variant scroller properties

const getUniformNestedItem = (index:any) => {

    return <div style = { uniformNestedItemStyle}> Item {index} of this list </div>

}

const nestedUniformScrollerProperties = {

    startingIndex:0,
    estimatedListSize:100,
    orientation:'vertical',
    cellHeight:40,
    cellWidth:250,
    padding:6,
    gap:2,
    runwaySize:4,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem: getUniformNestedItem,
    styles:null,
    placeholderMessages: null,
    callbacks:null,

}

// -----------------
// scroller property values for the nested scroller

const getNestedScroller = (index:number) => {

    return <NestedScroller 
        index = {index} 
        scrollerProperties = {null}
    />

}

const nestedScrollerStyles = {

}

const nestedcontent = {
    startingIndex:0,
    estimatedListSize:200,
    orientation:'vertical',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem:getNestedScroller,
    styles:nestedScrollerStyles,
    placeholderMessages: null,
    callbacks,
}

// ---------------------------------[ nested scroller promises ]------------------

// -----------------
// replacement scroller property values for the nested scroller promises

const getNestedScrollerPromise = (index:number) => {

    return new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(
                <NestedScroller 
                    index = {index} 
                    scrollerProperties = {null}
                />
            )

        },400 + (Math.random() * 2000))
    })

}

const nestedpromises = {
    startingIndex:0,
    estimatedListSize:200,
    orientation:'vertical',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem:getNestedScrollerPromise,
    styles:nestedScrollerStyles,
    placeholderMessages: null,
    callbacks,
}

// ==============================[ consolidated scroller properties namespace ]=========================

export const defaultAllContentTypeProperties = {
    simplecontent,
    simplepromises,
    nestedcontent,
    nestedpromises,
    variablecontent,
    variablepromises,
    variabledynamic,
}

export const demoAllContentTypePropertiesRef = {current:{...defaultAllContentTypeProperties} as GenericObject}

// ----------------------------------[ type definition ]----------------------------

export type GenericObject = {
    [prop:string]:any
}
