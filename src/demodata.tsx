// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

import React, {useRef, useState, useEffect} from 'react'

import Scroller from 'react-infinite-grid-scroller'

// ----------------------------------[ types ]------------------------------

export type GenericObject = {
    [prop:string]:any
}

// ==============================[ scroller callbacks ]=========================

export const defaultCallbackSettings = {
    referenceIndexCallback:false,
    repositioningIndexCallback:false,
    preloadIndexCallback:false,
    itemExceptionCallback:false,
    changeListsizeCallback:false,
    deleteListCallback:false,
    repositioningFlagCallback:false,
}

export const demoCallbackSettingsRef = {current:{...defaultCallbackSettings} as GenericObject}

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

export const functionsObjectRef = {current:null as GenericObject | null}

const functionsCallback = (functions:GenericObject) => {
    functionsObjectRef.current = functions
}

// for properties
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

// ==================================[ content type components ]==========================

// -----------------------------[ simple items ]------------------------

const simpleScrollerStyles = {

}

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

const SimpleItem = (props:any) => {

    // console.log('loading GenericItem', props)
    const originalindexRef = useRef(props.index)

    return <div style = {simpleComponentStyles.outer}>
        <div style = {simpleComponentStyles.inner}>
            {originalindexRef.current}
        </div>
    </div>

}

const getSimpleItem = (index:number) => {

     if (index == 30) return Promise.reject(new Error('not found'))
     if (index == 40) return 5

     const returnvalue = <SimpleItem index = {index} />

     return returnvalue

}

const getSimpleItemPromise = (index:number) => {

    return new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(<SimpleItem index = {index} />)

        },400 + (Math.random() * 2000))
    })

}

// ---------------------------------[ nested items ]------------------

const nestedScrollerStyles = {

}

const nestedComponentStyles = {
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
    item:{
        padding:'3px',
        border:'1px solid green',
        backgroundColor:'white',
        height:'100%',
        boxSizing:'border-box',
    } as React.CSSProperties
}

const NestedItem = (props:any) => {

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

    return <div data-type = "list-frame" style = {nestedComponentStyles.container} >
        <div data-type = "list-header" style = {nestedComponentStyles.header} >
            List #{index} of {listsize}
        </div>
        <div data-type = "list-content" style = {nestedComponentStyles.frame}>

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

const getEmbeddedUniformItem = (index:any) => {

    return <div style = { nestedComponentStyles.item}> Item {index} of this list </div>

}

const getNestedItem = (index:number) => {

    return <NestedItem 
        index = {index} 
        scrollerProperties = {null}
    />

}

const getNestedItemPromise = (index:number) => {

    return new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(
                <NestedItem 
                    index = {index} 
                    scrollerProperties = {null}
                />
            )

        },400 + (Math.random() * 2000))
    })

}

// ------------------------[ variable items ]----------------------------

const variableScrollerStyles = {

}

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

const VariableItem = (props:any) => {

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
        <div style = {variableComponentStyles.inner}>{getTestString(props.index)}</div>
    </div>
}

const VariableNestedItem = (props:any) => {

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
        <div style = {variableComponentStyles.inner}>{getNestedTestString(props.index)}</div>
    </div>
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
            const teststringinstance = getTestStringDynamic(props.index)
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

// const teststring = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Purus non enim praesent elementum facilisis leo. At volutpat diam ut venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed elementum tempus egestas sed sed risus pretium quam. Tristique risus nec feugiat in fermentum. Sem fringilla ut morbi tincidunt. Malesuada nunc vel risus commodo. Nulla pellentesque dignissim enim sit amet venenatis urna cursus. In egestas erat imperdiet sed euismod nisi porta.'
const teststring = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst.'

const teststrings:string[] = []

const getTestString = (index:number) => {
    if (!teststrings[index]) {
        if ([0,1,51,52,196,197,198,199].includes(index)) {
            teststrings[index] = 'TEST STRING' + index
        } else if (index == 0) {
            teststrings[index] =`${index}: 'test string ' + ${teststring.substr(0,.5 * teststring.length)}`
        } else {
            teststrings[index] =`${index}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`
        }
    }
    return teststrings[index]
}

const getNestedTestString = (index:number) => {

    const returnstring =`${index}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`

    return returnstring
}

const getTestStringDynamic = (index:number) => {

    return `${index}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`

}

const getVariableItem = (index:number) => {

     return <VariableItem index = {index} scrollerProperties = {null}/>    

}

const getEmbeddedVariableItem = (index:number) => {

     return <VariableNestedItem index = {index} scrollerProperties = {null}/>    

}

const getVariableItemPromise = (index:number) => {

    return new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(<VariableItem index = {index} scrollerProperties = {null}/>)

        },400 + (Math.random() * 2000))
    })

}
const getVariableItemDynamic = (index:number) => {

     return <VariableItemDynamic index = {index} scrollerProperties = {null}/>    

}

// ======================================[ scroller properties ]===========================

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

    getItem: getEmbeddedUniformItem,
    styles:null,
    callbacks:null,

}

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

    getItem: getEmbeddedVariableItem,
    styles:null,
    callbacks:null,

}

export const defaultAllContentTypeProperties = {
    simple: {
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

        styles:simpleScrollerStyles,
        getItem:getSimpleItem,
        callbacks,
    },
    simplepromises: {
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

        styles:simpleScrollerStyles,
        getItem:getSimpleItemPromise,
        callbacks,
    },
    nested: {
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

        styles:nestedScrollerStyles,
        getItem:getNestedItem,
        callbacks,
    },
    nestedpromises: {
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

        styles:nestedScrollerStyles,
        getItem:getNestedItemPromise,
        callbacks,
    },
    variable: {
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

        styles:variableScrollerStyles,
        getItem:getVariableItem,
        callbacks,
    },
    variablepromises: {
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

        styles:variableScrollerStyles,
        getItem:getVariableItemPromise,
        callbacks,
    },
    variabledynamic: {
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

        styles:variableScrollerStyles,
        getItem:getVariableItemDynamic,
        callbacks,
    },
}

export const demoAllContentTypePropertiesRef = {current:{...defaultAllContentTypeProperties} as GenericObject}

export const defaultFunctionProperties:GenericObject = {
    gotoIndex:'',
    listsize:'',
    insertFrom:'',
    insertRange:'',
    removeFrom:'',
    removeRange:'',
    moveFrom:'',
    moveRange:'',
    moveTo:'',
    remapDemo:'',
  }


