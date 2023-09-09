// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

import React, {useRef, useState, useEffect, useMemo} from 'react'

import Scroller from 'react-infinite-grid-scroller'

import { setDemoStatePack } from './App'

/*
    CONTENT TYPES are defined just below the SCROLLER CALLBACKS section.
*/

// -----------------------------[ Test data ]--------------------------------

let globalCreationID = 0

export const testUniformData:GenericObject = {
    Housing:['Studio','1-bed','2-bed','family home'],
    Tool:['hammer','saw','screwdriver','wrench'],
    Food:['bread','onions','mushrooms','potatoes'],
    Furniture:['chair','bed','couch','table'],
}

const testUniformDataColors:GenericObject = {
    Housing:'AntiqueWhite',
    Tool: 'AquaMarine',
    Food: 'Cyan',
    Furniture:'Gold',
}

export const testVariableData:GenericObject = {
    Post:['Frank','Julia','Rachid','Selma'],
    Message:['Karl','Roxi','Jane','Ben'],
    Opinion:['Greg','Summer','John','Gloria'],
    Report:['Mike','Cynthia','Bianca','Jim'],
}

const testVariableDataColors:GenericObject = {
    Post:'BurlyWood',
    Message: 'DarkKhaki',
    Opinion: 'DarkSalmon',
    Report:'LightPink',
}

const chooseRandomGroup = (testData:object) => {

    const groups = Object.keys(testData)
    return groups[getRandomInt(groups.length)]

}

const chooseRandomItem = (list:Array<string>) => {
    return list[getRandomInt(list.length)]
}

function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}

export const acceptAll = (testData:object) => {
    return Object.keys(testData)
}

const acceptOne = (testData:object) => {
    const groups = Object.keys(testData)
    return [groups[getRandomInt(groups.length)]]
}

const acceptTwo = (testData:object) => {
    const first = acceptOne(testData)
    let second = acceptOne(testData)
    while (first == second) {
        second = acceptOne(testData)
    }
    return [first,second]
}

const rotateAccepts = (testData:object,index:number) => {
    const selector = Math.abs(index) % 3
    let accepts
    switch (selector) {
        case 0: {
            return acceptAll(testData)
            break
        }
        case 1: {
            return acceptTwo(testData)
            break
        }
        case 2: {
            return acceptOne(testData)
            break
        }
    }
}

const selectItem = (testData:GenericObject, accepts:Array<string>,index:number) => {

    const selector = (Math.abs(index) % accepts.length)
    const accept:string = accepts[selector]
    const textOptions:Array<any> = testData[accept]

    const textOption = textOptions[getRandomInt(textOptions.length)]

    return [accept, textOption]

}


// =============================================================================
// ==============================[ SCROLLER CALLBACKS ]=========================
// =============================================================================

/*
    The scroller callbacks are sent to all five of the content types. They can be activated
    in the Callbacks section of the demo Options drawer.
*/

// these settings are selected in the Callbacks section of the Options drawer
// They control the firing of the callbacks. The demo callbacks, when activated, send feedback
// to the browser console.
// The callback names are recognized by RIGS, and fired if found.
export const defaultCallbackFlags = {
    referenceIndexCallback:false,
    repositioningIndexCallback:false,
    preloadIndexCallback:false,
    itemExceptionCallback:false,
    changeListSizeCallback:false,
    changeListRangeCallback:false,
    deleteListCallback:false,
    repositioningFlagCallback:false,
    boundaryCallback:false,
}

// initialize the demo settings with the default settings, and export to the App module. 
// These settings can be changed in the Callbacks section of the Options drawer
export const demoCallbackFlagsRef = {current:{...defaultCallbackFlags} as GenericObject}


// -----------------
// the individual callback definitions follow...
// -----------------

const referenceIndexCallback = (index:number, location:string, cradleState:string) => {

    demoCallbackFlagsRef.current.referenceIndexCallback && 
        console.log('referenceIndexCallback: index, location, cradleState',
            index, location, cradleState)
   
}

const boundaryCallback = (position:string, index:number) => {
    demoCallbackFlagsRef.current.boundaryCallback && 
        console.log('boundaryCallback: position, index', position, index)
}

const preloadIndexCallback = (index:number) => {
    
    demoCallbackFlagsRef.current.preloadIndexCallback && 
        console.log('preloadIndexCallback: index', 
            index)

}
const deleteListCallback = (reason:string, deleteList:number[]) => {
    
    demoCallbackFlagsRef.current.deleteListCallback && 
        console.log('deleteListCallback: reason, deleteList',
            reason, deleteList)

}
const repositioningIndexCallback = (index:number) => {
    
    demoCallbackFlagsRef.current.repositioningIndexCallback && 
        console.log('repositioningIndexCallback: index',
            index)

}

const repositioningFlagCallback = (flag:boolean) => {
    
    demoCallbackFlagsRef.current.repositioningFlagCallback && 
        console.log('repositioningFlagCallback: index',
            flag)

}

const changeListSizeCallback = (newlistsize:number) => {
    
    demoCallbackFlagsRef.current.changeListSizeCallback && 
        console.log('changeListSizeCallback: newlistsize', 
            newlistsize)

}

const changeListRangeCallback = (newlistrange:number) => {
    
    demoCallbackFlagsRef.current.changeListRangeCallback && 
        console.log('changeListRangeCallback: newlistrange', 
            newlistrange)

}

const itemExceptionCallback = (index:number, itemID:number, returnvalue:any, location:string, error:Error) => {
    
    demoCallbackFlagsRef.current.itemExceptionCallback && 
        console.log('itemExceptionCallback: index, itemID, returnvalue, location, error',
            index, itemID, returnvalue, location, error)

}

// The functions object is used by the Options drawer for the snapshot functions,
// and by the main app for the operations functions selected in the Options drawer.
// The functions are instantiated in the scroller on mounting, by the functionsCallback below
export const functionsAPIRef = {current:{} as GenericObject}

// the functions callback returns the funtions API to the caller on mounting
const functionsCallback = (functions:GenericObject) => {

    functionsAPIRef.current = functions

}

// -----------------
// The callbacks are bundled for inclusion in the various content type scroller property bundles following.
// -----------------

const callbacks = {
    functionsCallback,
    referenceIndexCallback,
    repositioningIndexCallback,
    preloadIndexCallback,
    itemExceptionCallback,
    changeListSizeCallback,
    changeListRangeCallback,
    deleteListCallback,
    repositioningFlagCallback,
    boundaryCallback,
}

// =============================================================================
// ==================================[ CONTENT TYPES ]==========================
// =============================================================================

/*

    There is a section below for each content type. Each section consists of 
    - a first part to define the components to be sent to the scroller
    - a second part to assemble the property values to send to the scroller

    The left column is the list of seven content type choices on the Options page
    The right column is the names of the objects holding the scroller properties for those content types
        - you can search for those property objects below to see how they are created
        - all property objects are assembled in a namespace object at the bottom of this module 
            for use by the demo app

    1. simplecontent:    simplecontentProperties,
    2. simplepromises:   simplepromisesProperties,
    2.1 simpleautoexpand:simpleautoexpandProperties,
    3. variablecontent:  variablecontentProperties,
    4. variablepromises: variablepromiseProperties,
    5. variabledynamic:  variabledynamicProperties,
    6. variableoversized: variableoversizedProperties,
    7. nestedcontent:    nestedcontentProperties,
    8. nestedpromises:   nestedpromisesProperties,
    9. sharedcache:      sharedcacheProperties
    10. draggablenested: draggablenestesProperties

*/

// ========================[ 1. Simple uniform content ]=========================

// -----------------
// simple uniform content component definition
// -----------------

// styles for the simple uniform content components
const simpleComponentStyles = {
    inner: {
        position:'absolute',
        top:0,
        left:0,
        padding:'3px',
        // backgroundColor:'white', 
        margin:'3px'
    } as React.CSSProperties,
    outer: {
        position:'relative',
        height:'100%', 
        width:'100%',
        backgroundColor:'white',
        border: '1px solid black',
        borderRadius:'8px',
        overflow:'hidden',
    } as React.CSSProperties
}

// the simple uniform content component
const SimpleItem = (props:any) => {

    const {color, type, typeSelection, scrollerProperties, creationID} = props

    const isDnd = scrollerProperties?.scrollerPropertiesRef.current.dnd

    // console.log('isDnd, scrollerProperties',isDnd, {...scrollerProperties})

    if (color) simpleComponentStyles.outer.backgroundColor = color
    let typeText
    if (type && typeSelection) typeText = `${type}: ${typeSelection}`

    const float = useMemo(() => {
        if (isDnd) return <div style = {{float:'left', height: '28px', width:'31px'}} />
        else return null

    },[isDnd])

    return <div data-type = 'simple-uniform' style = {simpleComponentStyles.outer}>
        <div style = {simpleComponentStyles.inner}>
            {isDnd && float}
            {`list index ${props.scrollerProperties.cellFramePropertiesRef.current.index},`}<br style = {{clear:'left'}}/>
            {`cache itemID ${props.itemID}`}
            {creationID && <><br />{`creationID: ${creationID}`}</>}
            {typeText && <><br />{typeText}</>}
        </div>
    </div>

}

// -----------------
// scroller property assembly for simple uniform content component
// -----------------

// the getItem function for simple uniform content
const getSimpleItem = (index:number, itemID:number) => {

     if (index == 30) return Promise.reject(new Error('not found for demo purposes'))
     if (index == 40) return 5 // deliberate return of an invalid (non-React-component) content type for demo

     const component = <SimpleItem index = {index} itemID = {itemID} scrollerProperties = {null} />

     return component

}

const getSimpleItemPack = (index:number, itemID:number, context:GenericObject) => {

    const accepts = context.accepts

    const [accept, typeSelection] = selectItem(testUniformData,accepts,index)

    const color = testUniformDataColors[accept]

    const creationID = globalCreationID++

    let component

     if (index == 30) {
         component = Promise.reject(new Error('not found for demo purposes'))
     } else if (index == 40) {
         component = 5 // deliberate return of an invalid (non-React-component) content type for demo
     } else {
         component = <SimpleItem 
             index = {index} 
             itemID = {itemID} 
             type = {accept}
             typeSelection = {typeSelection}
             color = { color }
             creationID = {creationID}
             scrollerProperties = {null} />
     }

    const itemPack = {
        content:component,
        dndOptions:{type:accept},
        profile:{color, type:accept, typeSelection, creationID},
    }

     return itemPack

}

// scroller styles
const simpleScrollerStyles = {
    viewport:{
        overscrollBehavior:'none'
    },
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
const simplecontentProperties = {
    startingIndex:0,
    startingListSize:300,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:150,
    cellWidth:150,
    padding:10,
    gap:5,
    runwaySize:4,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem: getSimpleItem,
    getItemPack: getSimpleItemPack,
    styles: simpleScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}

// ============================[ 2. Simple uniform promises ]==============================

// the simple content component definitions above are used for these promises, except for the following...

// -----------------
// scroller property values assembled for this content variant
// -----------------

// the getItem function for simple uniform promises; note the setTimeout
const getSimpleItemPromise = (index:number, itemID:number) => {

    return new Promise((resolve, reject) => {

        setTimeout(()=> {

            resolve(<SimpleItem index = {index} itemID = {itemID} scrollerProperties = {null}/>)

        },400 + (Math.random() * 2000))

    })

}

const getSimpleItemPromisePack = (index:number, itemID:number, context:GenericObject) => {

    const accepts = context.accepts

    const [accept, typeSelection] = selectItem(testUniformData,accepts,index)

    const color = testUniformDataColors[accept]

    const creationID = globalCreationID++

    const component = new Promise((resolve, reject) => {

        setTimeout(()=> {

            resolve(<SimpleItem 
                index = {index} 
                itemID = {itemID} 
                type = {accept}
                typeSelection = {typeSelection}
                color = { color }
                creationID = {creationID}
                scrollerProperties = {null}
            />)

        },400 + (Math.random() * 2000))

    })

    const itemPack = {
        content:component,
        dndOptions:{type:accept},
        profile:{color, type:accept, typeSelection, creationID },
    }

     return itemPack
}

const simplePromisesScrollerStyles = {
    viewport:{
        overscrollBehavior:'none'
    },
    placeholderframe: {
        borderRadius:'8px',
        backgroundColor:'palegreen',
    },
}


// properties for the simple promises scroller
const simplepromisesProperties = {
    startingIndex:0,
    startingListSize:300,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:150,
    cellWidth:150,
    padding:10,
    gap:5,
    runwaySize:4,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem: getSimpleItemPromise,
    getItemPack: getSimpleItemPromisePack,
    styles: simplePromisesScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}

// ============================[ 2.1 Simple auto expand ]==============================

// the simple content component definitions above are used for these items, except for the following...

// -----------------
// scroller property values assembled for this content variant
// -----------------

const getAutoExpansionCount = (position:string, index:number) => {

    let count = 0

    if (position == 'SOL' && index >= -1000) count = 10

    if (position == 'EOL' && index <= 1000) count = 10

    const statePack:GenericObject = setDemoStatePack

    if (count) {
        statePack.setDemoState('autoexpand')
    }

    return count

}

const simpleAutoExpandScrollerStyles = {
    viewport:{
        overscrollBehavior:'none'
    },
    placeholderframe: {
        borderRadius:'8px',
        backgroundColor:'palegreen',
    },
}


// properties for the simple promises scroller
const simpleAutoExpandProperties = {
    startingIndex:0,
    startingListSize:300,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:150,
    cellWidth:150,
    padding:10,
    gap:5,
    runwaySize:4,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem: getSimpleItem,
    getItemPack: getSimpleItemPack,
    getExpansionCount:getAutoExpansionCount,
    styles: simpleAutoExpandScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}

// ==========================[ 3. variable content ]============================

// -----------------
// variable content component definition
// -----------------

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

const getVariableTestString = (index:number, itemID:number) => {

    let teststr

    if ([0,1,51,52,196,197,198,199].includes(index)) {
        teststr = 'SHORT STRING ' + ` [${index}]=${itemID}`// short string for demo
    } else if (index == 3) {
        teststr =`[${index}]=${itemID} test string => ${teststring.substr(0,.5 * teststring.length)}`
    } else {
        teststr =`[${index}]=${itemID} test string => ${teststring.substr(0,Math.random() * teststring.length)}`
    }

    return teststr
}

const VariableItem = (props:any) => {

    const {color, type, typeSelection, scrollerProperties, creationID} = props

    const isDnd = scrollerProperties?.scrollerPropertiesRef.current.dnd

    let typeText = '', creationIDText = ''
    if (type && typeSelection) typeText = `${type} from ${typeSelection}:`

    if (creationID) creationIDText = `creationID: ${creationID}`

    const float = useMemo(() => {
        if (isDnd) return <div style = {{float:'left', height: '30px', width:'34px'}} />
        else return null

    },[isDnd])

    const testString = getVariableTestString(props.scrollerProperties.cellFramePropertiesRef.current.index, props.itemID)

    const testStringRef = useRef(testString)

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
    const innerstyles = {...variableComponentStyles.inner}

    color && (innerstyles.backgroundColor = color)

    // ------------------------[ handle scroll position recovery ]---------------------

    // define required data repo
    const scrollerElementRef = useRef<any>(null),
        scrollPositionsRef = useRef({scrollTop:0, scrollLeft:0}),
        wasCachedRef = useRef(false)

    // define the scroll event handler
    const scrollerEventHandler = (event:React.UIEvent<HTMLElement>) => {

        const scrollerElement = event.currentTarget

        // save scroll positions if the scroller element is not cached
        if (!(!scrollerElement.offsetHeight && !scrollerElement.offsetWidth)) {

            const scrollPositions = scrollPositionsRef.current

            scrollPositions.scrollTop = scrollerElement.scrollTop
            scrollPositions.scrollLeft = scrollerElement.scrollLeft

        }

    }

    // register the scroll event handler
    useEffect(()=>{

        const scrollerElement = scrollerElementRef.current

        scrollerElement.addEventListener('scroll', scrollerEventHandler)

        // unmount
        return () => {
            scrollerElement.removeEventListener('scroll', scrollerEventHandler)
        }

    },[])

    // define the cache sentinel
    const cacheSentinel = () => {
        const scrollerElement = scrollerElementRef.current

        if (!scrollerElement) return // first iteration

        const isCached = (!scrollerElement.offsetWidth && !scrollerElement.offsetHeight) // zero values == cached

        if (isCached != wasCachedRef.current) { // there's been a change

            wasCachedRef.current = isCached

            if (!isCached) { // restore scroll positions

                const {scrollTop, scrollLeft} = scrollPositionsRef.current

                scrollerElement.scrollTop = scrollTop
                scrollerElement.scrollLeft = scrollLeft

            }

        }

    }

    // run the cache sentinel on every iteration
    cacheSentinel()

    // register the scroller element
    return <div ref = {scrollerElementRef} data-type = 'variable-content' style = {outerstyles}>
        <div style = {innerstyles}>
            {isDnd && float}
            {creationIDText && <>{creationIDText} <br /></>} 
            {typeText && <>{typeText} <br /></>}
            {testStringRef.current}
        </div>
    </div>
}

// -----------------
// scroller property values assembled for variable content
// -----------------

const getVariableItem = (index:number, itemID:number) => {

     return <VariableItem index = {index} itemID = {itemID} scrollerProperties = {null}/>    

}

const getVariableItemPack = (index:number, itemID:number, context:GenericObject) => {

    const accepts = context.accepts

    const [accept, typeSelection] = selectItem(testVariableData,accepts,index)

    const color = testVariableDataColors[accept]

    const creationID = globalCreationID++

    let component

     if (index == 30) {
         component = Promise.reject(new Error('not found for demo purposes'))
     } else if (index == 40) {
         component = 5 // deliberate return of an invalid (non-React-component) content type for demo
     } else {
         component = <VariableItem 
             index = {index} 
             itemID = {itemID} 
             type = {accept}
             typeSelection = {typeSelection}
             color = { color }
             creationID = {creationID}
             scrollerProperties = {null} />
     }

    const itemPack = {
        content:component,
        dndOptions:{type:accept},
        profile:{color, type:accept, typeSelection, creationID},
    }

    return itemPack

}

const variableScrollerStyles = {
    viewport:{
        overscrollBehavior:'none'
    },
}

const variablePlaceholderMessages = {
    
}

const variablecontentProperties = {
    startingIndex:0,
    startingListSize:200,
    // startingListRange:[-60,60],
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

    getItem: getVariableItem,
    getItemPack: getVariableItemPack,
    styles: variableScrollerStyles,
    placeholderMessages: variablePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}
// =========================[ 4. variable promises ]================================

// the variable component definitions are reused for the variable promises variant

// -----------------
// scroller property values assembled for variable promises variant
// -----------------

// note the setTimeout function to simulate latency
const getVariableItemPromise = (index:number, itemID:number) => {

    return new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(<VariableItem index = {index} itemID = {itemID} scrollerProperties = {null}/>)

        },1000 + (Math.random() * 2000))
    })

}

const getVariableItemPromisePack = (index:number, itemID:number, context:GenericObject) => {

    
    const accepts = context.accepts

    const [accept, typeSelection] = selectItem(testVariableData,accepts,index)

    const color = testVariableDataColors[accept]

    const creationID = globalCreationID++

    let component = new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(
                <VariableItem 
                     index = {index} 
                     itemID = {itemID} 
                     type = {accept}
                     typeSelection = {typeSelection}
                     color = { color }
                     creationID = {creationID}
                     scrollerProperties = {null} 
                 />
            )

        },1000 + (Math.random() * 2000))
    
    })         

    const itemPack = {
        content:component,
        dndOptions:{type:accept},
        profile:{color, type:accept, typeSelection, creationID},
    }

    return itemPack

}

const variablepromiseProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
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

    getItem: getVariableItemPromise,
    getItemPack: getVariableItemPromisePack,
    styles: variableScrollerStyles,
    placeholderMessages: variablePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}
// ===========================[ 5. variable dynamic ]===============================

// -----------------
// variable dynamic content component definition
// -----------------

const getDynamicTestString = (index:number, itemID:number) => {

    return `[${index}]=${itemID} test string => ${teststring.substr(0,Math.random() * teststring.length)}`

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

    // const originalindexRef = useRef(props.index)

    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const [teststring, setTeststring] = useState('placeholder')
    const teststringRef = useRef<string>()
    teststringRef.current = teststring
    const iterationRef = useRef(0)

    useEffect(()=>{
        intervalRef.current = setInterval(() => {
            iterationRef.current ++
            const teststringinstance = getDynamicTestString(props.scrollerProperties.cellFramePropertiesRef.current.index, props.itemID)
            setTeststring(teststringinstance)

        },200 + (Math.random() * 2000))

        return () => {
            const intervalID = intervalRef.current
            clearInterval(intervalID as NodeJS.Timeout)
        }

    },[])

    return <div data-type = 'variable-dynamic' style = {outerstyles}>
        <div style = {variableComponentStyles.inner}>{teststringRef.current}</div>
    </div>

}

// -----------------
// scroller property values assembled for dynamic variable content
// -----------------

const getVariableItemDynamic = (index:number, itemID:number) => {

     return <VariableItemDynamic index = {index} itemID = {itemID} scrollerProperties = {null}/>    

}

const variabledynamicProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
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

    getItem: getVariableItemDynamic,
    styles: variableScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}
// ======================[ 6. variable oversized content ]=========================

const oversizedteststring = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Purus non enim praesent elementum facilisis leo. At volutpat diam ut venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed elementum tempus egestas sed sed risus pretium quam. Tristique risus nec feugiat in fermentum. Sem fringilla ut morbi tincidunt. Malesuada nunc vel risus commodo. Nulla pellentesque dignissim enim sit amet venenatis urna cursus. In egestas erat imperdiet sed euismod nisi porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Purus non enim praesent elementum facilisis leo. At volutpat diam ut venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed elementum tempus egestas sed sed risus pretium quam. Tristique risus nec feugiat in fermentum. Sem fringilla ut morbi tincidunt. Malesuada nunc vel risus commodo. Nulla pellentesque dignissim enim sit amet venenatis urna cursus. In egestas erat imperdiet sed euismod nisi porta.'

const getVariableOversizedTestString = (index:number, itemID:number) => {

    let teststr

    teststr =`[${index}]=${itemID} test string => ${oversizedteststring.substr(0,800 + (Math.random() * (oversizedteststring.length - 800)))}`

    return teststr
}

const VariableOversizedItem = (props:any) => {

    const testStringRef = useRef(getVariableOversizedTestString(props.scrollerProperties.cellFramePropertiesRef.current.index, props.itemID))

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

    // ------------------------[ handle scroll position recovery ]---------------------

    // define required data repo
    const scrollerElementRef = useRef<any>(null),
        scrollPositionsRef = useRef({scrollTop:0, scrollLeft:0}),
        wasCachedRef = useRef(false)

    // define the scroll event handler
    const scrollerEventHandler = (event:React.UIEvent<HTMLElement>) => {

        const scrollerElement = event.currentTarget

        // save scroll positions if the scroller element is not cached
        if (!(!scrollerElement.offsetHeight && !scrollerElement.offsetWidth)) {

            const scrollPositions = scrollPositionsRef.current

            scrollPositions.scrollTop = scrollerElement.scrollTop
            scrollPositions.scrollLeft = scrollerElement.scrollLeft

        }

    }

    // register the scroll event handler
    useEffect(()=>{

        const scrollerElement = scrollerElementRef.current

        scrollerElement.addEventListener('scroll', scrollerEventHandler)

        // unmount
        return () => {
            scrollerElement.removeEventListener('scroll', scrollerEventHandler)
        }

    },[])

    // define the cache sentinel
    const cacheSentinel = () => {
        const scrollerElement = scrollerElementRef.current

        if (!scrollerElement) return // first iteration

        const isCached = (!scrollerElement.offsetWidth && !scrollerElement.offsetHeight) // zero values == cached

        if (isCached != wasCachedRef.current) { // there's been a change

            wasCachedRef.current = isCached

            if (!isCached) { // restore scroll positions

                const {scrollTop, scrollLeft} = scrollPositionsRef.current

                scrollerElement.scrollTop = scrollTop
                scrollerElement.scrollLeft = scrollLeft

            }

        }

    }

    // run the cache sentinel on every iteration
    cacheSentinel()

    return <div ref = {scrollerElementRef} data-type = 'variable-oversized' style = {outerstyles}>
        <div style = {variableComponentStyles.inner}>{testStringRef.current}</div>
    </div>
}

// -----------------
// scroller property values assembled for variable oversized content
// -----------------

const getVariableOversizedItem = (index:number, itemID:number) => {

     return <VariableOversizedItem index = {index} itemID = {itemID} scrollerProperties = {null}/>    

}

const variableoversizedProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:800,
    cellWidth:400,
    cellMinHeight:300,
    cellMinWidth:200,
    padding:10,
    gap:5,
    runwaySize:5,
    cache:'cradle',
    cacheMax:200,
    layout: 'variable',

    getItem: getVariableOversizedItem,
    styles: variableScrollerStyles,
    placeholderMessages: variablePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}

// ======================[ 7. nested scrollers content (scroller of sub-scrollers) ]=========================

// For this there is a scroller, that contains cells of scrollers (subscrollers)
// The subscroller content comes in two variants - variable content, and uniform content

// -----------------
// nested scrollers cell component definition
// -----------------

const nestedSubscrollerComponentStyles = {
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

const SubscrollerComponent = (props:any) => {

    const [testState, setTestState] = useState('setup')
    const testStateRef = useRef<string|null>(null)
    testStateRef.current = testState

    const { 
        index, 
        itemID,
        scrollerProperties,
    } = props

    const variant =
        ((index % 2) == 0)?
        'uniform':
        'variable'

    const properties = 
        (variant == 'uniform')?
            nestedUniformSubscrollerProperties:
            nestedVariableSubscrollerProperties

    const {
        // orientation, 
        gap, 
        padding, 
        cellHeight, 
        cellWidth, 
        runwaySize, 
        startingIndex, 
        startingListSize,
        startingListRange, 
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

    const { size:listsize, lowindex } = scrollerPropertiesRef.current.virtualListProps

    useEffect(()=>{

        switch (testState) {
            case 'setup':
            case 'revised': {
                setTestState('ready')
                break
            }
        }

    },[testState])

    return <div data-type = "list-frame" style = {nestedSubscrollerComponentStyles.container} >
        <div data-type = "list-header" style = {nestedSubscrollerComponentStyles.header} >
            [{props.scrollerProperties.cellFramePropertiesRef.current.index}]={itemID} List #{index + 1 - lowindex} of {listsize}
        </div>
        <div data-type = "list-content" style = {nestedSubscrollerComponentStyles.frame}>

            <Scroller 
                orientation = { dynamicorientationRef.current } 
                cache = { cache }
                gap = {gap}
                padding = {padding}
                cellHeight = {cellHeight}
                cellWidth = {cellWidth}
                runwaySize = {runwaySize}
                startingListSize = {startingListSize}
                startingListRange = {startingListRange}
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

// --------------------[ 7a. subscoller variable cell content variant ]-----------------------

// -----------------
// content for variable subscroller variant
// -----------------

const getVariableNestedTestString = (index:number, itemID:number) => {

    const str =`[${index}]=${itemID} test string => ${teststring.substr(0,Math.random() * teststring.length)}`

    return str
}

const VariableSubscrollerItem = (props:any) => {

    const testStringRef = useRef(getVariableNestedTestString(props.scrollerProperties.cellFramePropertiesRef.current.index, props.itemID))

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

    return <div data-type = 'variable-subscroller' style = {outerstyles}>
        <div style = {variableComponentStyles.inner}>{testStringRef.current}</div>
    </div>
}

// -----------------
// properties assembled for variable subscroller variant
// -----------------

const getVariableSubscrollerItem = (index:number, itemID:number) => {

     return <VariableSubscrollerItem index = {index} itemID = {itemID} scrollerProperties = {null}/>    

}

const nestedVariableSubscrollerProperties = {

    startingIndex:0,
    startingListSize:100,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:300,
    cellWidth:250,
    padding:6,
    gap:2,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'variable',

    getItem: getVariableSubscrollerItem,
    styles:null,
    placeholderMessages: null,
    callbacks:null,
    technical: {
        showAxis:false
    },

}

// -------------------[ 7b. subscroller uniform  cell content variant ]-----------------

// -----------------
// component definition for uniform subscroller variant
// (the component itself is a simple div, so is defined in the getUniformSubscrollerItem function below)
// -----------------

const uniformSubscrollerItemStyle = {
        padding:'3px',
        border:'1px solid green',
        backgroundColor:'white',
        height:'100%',
        boxSizing:'border-box',
    } as React.CSSProperties

// -----------------
// properties assembled for uniform subscroller variant
// -----------------

const getUniformSubscrollerItem = (index:any, itemID:number) => {

    return <div style = { uniformSubscrollerItemStyle}>[{index}]={itemID}</div>

}

const nestedUniformSubscrollerProperties = {

    startingIndex:0,
    startingListSize:100,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:40,
    cellWidth:250,
    padding:6,
    gap:2,
    runwaySize:4,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem: getUniformSubscrollerItem,
    styles:null,
    placeholderMessages: null,
    callbacks:null,
    technical: {
        showAxis:false
    },

}

// --------------------[ back to 7. - scroller of subscrollers properties ]----------------------

// -----------------
// scroller property values assembled for the nested scroller
// -----------------

const getSubscroller = (index:number, itemID:number) => {

    return <SubscrollerComponent 
        index = {index} 
        itemID = {itemID}
        scrollerProperties = {null}
    />

}

const nestedScrollerStyles = {
    viewport:{
        overscrollBehavior:'none'
    },
}

const nestedcontentProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem:getSubscroller,
    styles:nestedScrollerStyles,
    placeholderMessages: null,
    callbacks,
    technical:{
        showAxis:false
    },
}

// =======================[ 8. scroller of subscrollers content item promises ]========================

// -----------------
// scroller property values assembled for the nested scroller promises variant
// -----------------

// note the setTimeout
const getNestedSubscrollerPromise = (index:number, itemID:number) => {

    return new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(
                <SubscrollerComponent 
                    index = {index} 
                    itemID = {itemID}
                    scrollerProperties = {null}
                />
            )

        },400 + (Math.random() * 2000))
    })

}

const nestedpromisesProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem:getNestedSubscrollerPromise,
    styles:nestedScrollerStyles,
    placeholderMessages: null,
    callbacks,
    technical: {
        showAxis:false
    },
}

// --------------------[ 9. - scroller of shared cache properties ]----------------------


const SharedCacheComponent = (props:any) => {

    const [testState, setTestState] = useState('setup')
    const testStateRef = useRef<string|null>(null)
    testStateRef.current = testState

    const { 
        index, 
        itemID,
        scrollerProperties,
        cacheAPI,
    } = props

    const properties = nestedUniformSubscrollerProperties

    const {
        // orientation, 
        gap, 
        padding, 
        cellHeight, 
        cellWidth, 
        runwaySize, 
        startingIndex, 
        startingListSize, 
        startingListRange,
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

    const { size:listsize, lowindex } = scrollerPropertiesRef.current.virtualListProps

    useEffect(()=>{

        switch (testState) {
            case 'setup':
            case 'revised': {
                setTestState('ready')
                break
            }
        }

    },[testState])

    return <div data-type = "list-frame" style = {nestedSubscrollerComponentStyles.container} >
        <div data-type = "list-header" style = {nestedSubscrollerComponentStyles.header} >
            [{props.scrollerProperties.cellFramePropertiesRef.current.index}]={itemID} List #{index + 1 - lowindex} of {listsize}
        </div>
        <div data-type = "list-content" style = {nestedSubscrollerComponentStyles.frame}>

            <Scroller 
                orientation = { dynamicorientationRef.current } 
                cache = { cache }
                gap = {gap}
                padding = {padding}
                cellHeight = {cellHeight}
                cellWidth = {cellWidth}
                runwaySize = {runwaySize}
                startingListSize = {startingListSize}
                startingListRange = {startingListRange}
                startingIndex = {startingIndex}
                getItem = {getItem}
                callbacks = {null}
                placeholder = {null}
                styles = { null }
                layout = { layout }
                scrollerProperties = { scrollerProperties }
                cacheAPI = {cacheAPI}
            />

        </div>

    </div>

}

// -----------------
// scroller property values assembled for the nested scroller
// -----------------

const getSharedCacheSubscroller = (index:number, itemID:number) => {

    return <SharedCacheComponent 
        index = {index} 
        itemID = {itemID}
        scrollerProperties = {null}
        cacheAPI = {null}
    />

}

const sharedcacheScrollerStyles = {
    viewport:{
        overscrollBehavior:'none'
    },
}

const sharedcacheProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem:getSharedCacheSubscroller,
    styles:sharedcacheScrollerStyles,
    placeholderMessages: null,
    callbacks,
    technical:{
        showAxis:false
    },
}

// --------------------[ 10. - scroller of draggable nested properties ]----------------------


const DraggableNestedComponent = (props:any) => {

    const [testState, setTestState] = useState('setup')
    const testStateRef = useRef<string|null>(null)
    testStateRef.current = testState

    const { 
        index, 
        itemID,
        scrollerProperties,
        cacheAPI,
    } = props

    const properties = nestedUniformSubscrollerProperties

    const {
        // orientation, 
        gap, 
        padding, 
        cellHeight, 
        cellWidth, 
        runwaySize, 
        startingIndex, 
        startingListSize, 
        startingListRange,
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

    const { size:listsize, lowindex } = scrollerPropertiesRef.current.virtualListProps

    useEffect(()=>{

        switch (testState) {
            case 'setup':
            case 'revised': {
                setTestState('ready')
                break
            }
        }

    },[testState])

    return <div data-type = "list-frame" style = {nestedSubscrollerComponentStyles.container} >
        <div data-type = "list-header" style = {nestedSubscrollerComponentStyles.header} >
            [{props.scrollerProperties.cellFramePropertiesRef.current.index}]={itemID} List #{index + 1 - lowindex} of {listsize}
        </div>
        <div data-type = "list-content" style = {nestedSubscrollerComponentStyles.frame}>

            <Scroller 
                orientation = { dynamicorientationRef.current } 
                cache = { cache }
                gap = {gap}
                padding = {padding}
                cellHeight = {cellHeight}
                cellWidth = {cellWidth}
                runwaySize = {runwaySize}
                startingListSize = {startingListSize}
                startingListRange = {startingListRange}
                startingIndex = {startingIndex}
                getItem = {getItem}
                callbacks = {null}
                placeholder = {null}
                styles = { null }
                layout = { layout }
                scrollerProperties = { scrollerProperties }
                cacheAPI = {cacheAPI}
            />

        </div>

    </div>

}

// -----------------
// scroller property values assembled for the nested scroller
// -----------------

const getDraggbleNestedSubscroller = (index:number, itemID:number) => {

    return <SharedCacheComponent 
        index = {index} 
        itemID = {itemID}
        scrollerProperties = {null}
        cacheAPI = {null}
    />

}

const draggablenestedScrollerStyles = {
    viewport:{
        overscrollBehavior:'none'
    },
}

const draggablenestedProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItem:getSharedCacheSubscroller,
    styles:sharedcacheScrollerStyles,
    placeholderMessages: null,
    callbacks,
    technical:{
        showAxis:false
    },
}


// ==============================[ consolidated scroller properties namespace ]=========================

// this is exported for the App module to use
export const defaultAllContentTypeProperties = {
    simplecontent:simplecontentProperties,
    simplepromises:simplepromisesProperties,
    simpleautoexpand:simpleAutoExpandProperties,
    variablecontent:variablecontentProperties,
    variablepromises:variablepromiseProperties,
    variabledynamic:variabledynamicProperties,
    variableoversized:variableoversizedProperties,
    nestedcontent:nestedcontentProperties,
    nestedpromises:nestedpromisesProperties,
    sharedcache:sharedcacheProperties,
    draggablenested: draggablenestedProperties,
}

// this is exported for the App module to use
export const demoAllContentTypePropertiesRef = {current:{...defaultAllContentTypeProperties} as GenericObject}

// ----------------------------------[ type definition ]----------------------------

export type GenericObject = {
    [prop:string]:any
}
