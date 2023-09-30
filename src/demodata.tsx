// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

import React, {useRef, useState, useEffect, useMemo} from 'react'

import Scroller from 'react-infinite-grid-scroller'

import { setDemoStatePack } from './App'

/*
    CONTENT TYPES are defined just below the SCROLLER CALLBACKS section.
*/

// -----------------------------[ Test data for dnd ]--------------------------------

let globalSourceID = 0

// proxies for index for type selection purposes
let uniformInstanceID = 0
let variableInstanceID = 0

export const testUniformData:GenericObject = {
    Housing:['Studio','1-bed','2-bed','family home'],
    Tools:['hammer','saw','screwdriver','wrench'],
    Food:['bread','onions','mushrooms','potatoes'],
    Furniture:['chair','bed','couch','table'],
}

const testUniformDataColors:GenericObject = {
    Housing:'AntiqueWhite',
    Tools: 'AquaMarine',
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

export const testNestingAccepts:GenericObject = {
    variable:['variable'],
    uniform:['uniform'],
    mixed:['uniform','variable'],
}

// selction drivers for dnd

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
    const [first] = acceptOne(testData)
    let [second] = acceptOne(testData)
    while (first == second) {
        [second] = acceptOne(testData)
    }
    return [first,second]
}

const acceptThree = (testData:object) => {
    const [remove] = acceptOne(testData)
    const list = Object.keys(testData)
    const result = list.filter((item)=> item != remove )
    return result
}

const rotateAccepts = (testData:object,index:number) => {
    const selector = Math.abs(index) % 4
    let accept
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
        case 3: {
            return acceptThree(testData)
            break
        }
    }
}

const getSubscrollerAccepts = (variant:string) => {

    const testData = 
        variant == 'uniform'?
            testUniformData:
            testVariableData

    const instanceID = 
        variant == 'uniform'?
            uniformInstanceID++:
            variableInstanceID++

    return rotateAccepts(testData,instanceID)

}

const selectCellType = (testData:GenericObject, accept:Array<string>,index:number) => {

    const selector = (Math.abs(index) % accept.length)
    const cellType:string = accept[selector]
    const textOptions:Array<any> = testData[cellType]

    const typeText = textOptions[getRandomInt(textOptions.length)]

    return [cellType, typeText]

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
const deleteListCallback = (deleteList:number[], context:object) => {
    
    demoCallbackFlagsRef.current.deleteListCallback && 
        console.log('deleteListCallback: deleteList, context',
            deleteList, context)

}
const repositioningIndexCallback = (index:number) => {
    
    demoCallbackFlagsRef.current.repositioningIndexCallback && 
        console.log('repositioningIndexCallback: index',
            index)

}

const repositioningFlagCallback = (flag:boolean, context:object) => {
    
    demoCallbackFlagsRef.current.repositioningFlagCallback && 
        console.log('repositioningFlagCallback: flag, context',
            flag, context)

}

const changeListSizeCallback = (newlistsize:number, context:object) => {
    
    demoCallbackFlagsRef.current.changeListSizeCallback && 
        console.log('changeListSizeCallback: newlistsize, context', 
            newlistsize, context)

}

const changeListRangeCallback = (newlistrange:number, context:object) => {
    
    demoCallbackFlagsRef.current.changeListRangeCallback && 
        console.log('changeListRangeCallback: newlistrange, context', 
            newlistrange, context)

}

// const itemExceptionCallback = (index:number, itemID:number, returnvalue:any, location:string, error:Error) => {
const itemExceptionCallback = (index:number, context:GenericObject) => {
    
    demoCallbackFlagsRef.current.itemExceptionCallback && 
        console.log('itemExceptionCallback: index, context',
            index, context)

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

    The left column is the list of thirteen content type choices on the Options page
    The right column is the names of the objects holding the scroller properties for those content types
        - you can search for those property objects below to see how they are created
        - all property objects are assembled in a namespace object at the bottom of this module 
            for use by the demo app

    1. simplecontent:           simplecontentProperties,
    2. simplepromises:          simplepromisesProperties,
    3. simpleautoexpand:        simpleautoexpandProperties,
    4. variablecontent:         variablecontentProperties,
    5. variablepromises:        variablepromiseProperties,
    6. variabledynamic:         variabledynamicProperties,
    7. variableoversized:       variableoversizedProperties,
    8. variableautoexpand:      variableautoexpandProperties,
    9. nestingmixed:            nestingmixedProperties,
    10. nestingmixedpromises:   nestingmixedpromisesProperties,
    
    11. nestingmixedautoexpand: nestingmixedautoexpandProperties,
    12. nestinguniform:         nestinguniformProperties,
    13. nestingvariable:        nestingvariableProperties,

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
        // backgroundColor:'white',
        border: '1px solid black',
        borderRadius:'8px',
        overflow:'hidden',
    } as React.CSSProperties
}

// the simple uniform content component
const SimpleItem = (props:any) => {

    const {color, type, typeText, scrollerContext, sourceID} = props

    const isDnd = scrollerContext?.scroller.current.dndEnabled

    // console.log('isDnd, scrollerContext',isDnd, {...scrollerContext})

    if (color) simpleComponentStyles.outer.backgroundColor = color
    let localTypeText
    if (type && typeText) localTypeText = `${type}: ${typeText}`

    const float = useMemo(() => {
        if (isDnd) return <div 
            style = {{float:'left', height: '28px', width:'31px'}} 
            data-type = 'dnd-float'
        />
        else return null

    },[isDnd])

    return <div data-type = 'simple-uniform' style = {simpleComponentStyles.outer}>
        <div style = {simpleComponentStyles.inner}>
            {isDnd && float}
            {`list index ${props.scrollerContext.cell.current.index},`}<br style = {{clear:'left'}}/>
            {`cache itemID ${props.itemID}`}
            {sourceID && <><br />{`sourceID: ${sourceID}`}</>}
            {localTypeText && <><br />{localTypeText}</>}
        </div>
    </div>

}

// -----------------
// scroller property assembly for simple uniform content component
// -----------------

// the getItemPack function for simple uniform content
const getSimpleItemPack = (index:number, itemID:number, context:GenericObject) => {

    const accept = context.accept

    const [cellType, typeText] = selectCellType(testUniformData,accept,index)

    const color = testUniformDataColors[cellType]

    const sourceID = globalSourceID++

    let component

     if (index == 30) {
         component = Promise.reject(new Error(`not found for demo purposes (${index})`))
     } else if (index == 40) {
         component = 5 // deliberate return of an invalid (non-React-component) content type for demo
     } else {
         component = <SimpleItem 
             index = {index} 
             itemID = {itemID} 
             type = {cellType}
             typeText = {typeText}
             color = { color }
             sourceID = {sourceID}
             scrollerContext = {null} />
     }

    const dragText = `sourceID: ${sourceID}, ${cellType}: ${typeText}`

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
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
    // dndHighlights:{
    //     source:"red",
    //     target:"green",
    //     dropped:"plum",
    //     scrolltab:"cyan",
    //     scroller:"blue",
    // }
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
    orientation: 'vertical',
    cellHeight:150,
    cellWidth:150,
    padding:10,
    gap:5,
    runwaySize:4,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

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

// the getItemPack function for simple uniform promises; note the setTimeout
const getSimpleItemPromisePack = (index:number, itemID:number, context:GenericObject) => {

    const accept = context.accept

    const [cellType, typeText] = selectCellType(testUniformData,accept,index)

    const color = testUniformDataColors[cellType]

    const sourceID = globalSourceID++

    const component = new Promise((resolve, reject) => {

        setTimeout(()=> {

            resolve(<SimpleItem 
                index = {index} 
                itemID = {itemID} 
                type = {cellType}
                typeText = {typeText}
                color = { color }
                sourceID = {sourceID}
                scrollerContext = {null}
            />)

        },400 + (Math.random() * 2000))

    })

    const dragText = `sourceID: ${sourceID}, ${cellType}: ${typeText}`

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID },
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

    getItemPack: getSimpleItemPromisePack,
    styles: simplePromisesScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}

// ============================[ 3. Simple auto expand ]==============================

// the simple content component definitions above are used for these items, except for the following...

// -----------------
// scroller property values assembled for this content variant
// -----------------

const getSimpleAutoExpansionCount = (position:string, index:number) => {

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

    getItemPack: getSimpleItemPack,
    getExpansionCount:getSimpleAutoExpansionCount,
    styles: simpleAutoExpandScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}

// ==========================[ 4. variable content ]============================

// -----------------
// variable content component definition
// -----------------

let variableComponentStyles = {
    outer:{
        // backgroundColor:'white',
        overflow:'scroll',
    } as React.CSSProperties,
    inner:{
        padding:'3px',
        border:'1px solid black',
        borderRadius:'8px',
        // backgroundColor:'white', 
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

    const {color, type, typeText, scrollerContext, sourceID} = props

    const isDnd = scrollerContext?.scroller.current.dndEnabled

    let localTypeText = '', sourceIDText = ''
    if (type && typeText) localTypeText = `${type} from ${typeText}:`

    if (sourceID) sourceIDText = `sourceID: ${sourceID}`

    const float = useMemo(() => {
        if (isDnd) return <div style = {{float:'left', height: '30px', width:'34px'}} />
        else return null

    },[isDnd])

    const testString = getVariableTestString(props.scrollerContext.cell.current.index, props.itemID)

    const testStringRef = useRef(testString)

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerContext.scroller.current

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
            {sourceIDText && <>{sourceIDText} <br /></>} 
            {localTypeText && <>{localTypeText} <br /></>}
            {testStringRef.current}
        </div>
    </div>
}

// -----------------
// scroller property values assembled for variable content
// -----------------

const getVariableItemPack = (index:number, itemID:number, context:GenericObject) => {

    const accept = context.accept

    const [cellType, typeText] = selectCellType(testVariableData,accept,index)

    const color = testVariableDataColors[cellType]

    const sourceID = globalSourceID++

    let component

     if (index == 30) {
         component = Promise.reject(new Error('not found for demo purposes'))
     } else if (index == 40) {
         component = 5 // deliberate return of an invalid (non-React-component) content type for demo
     } else {
         component = <VariableItem 
             index = {index} 
             itemID = {itemID} 
             type = {cellType}
             typeText = {typeText}
             color = { color }
             sourceID = {sourceID}
             scrollerContext = {null} />
     }

    const dragText = `sourceID: ${sourceID}, ${cellType} from ${typeText}`

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
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

    getItemPack: getVariableItemPack,
    styles: variableScrollerStyles,
    placeholderMessages: variablePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}
// =========================[ 5. variable promises ]================================

// the variable component definitions are reused for the variable promises variant

// -----------------
// scroller property values assembled for variable promises variant
// -----------------

// note the setTimeout function to simulate latency
const getVariableItemPromisePack = (index:number, itemID:number, context:GenericObject) => {

    
    const accept = context.accept

    const [cellType, typeText] = selectCellType(testVariableData,accept,index)

    const color = testVariableDataColors[cellType]

    const sourceID = globalSourceID++

    let component = new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(
                <VariableItem 
                     index = {index} 
                     itemID = {itemID} 
                     type = {cellType}
                     typeText = {typeText}
                     color = { color }
                     sourceID = {sourceID}
                     scrollerContext = {null} 
                 />
            )

        },1000 + (Math.random() * 2000))
    
    })

    const dragText = `sourceID: ${sourceID}, ${cellType} from ${typeText}`

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
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

    getItemPack: getVariableItemPromisePack,
    styles: variableScrollerStyles,
    placeholderMessages: variablePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}
// ===========================[ 6. variable dynamic ]===============================

// -----------------
// variable dynamic content component definition
// -----------------

const getDynamicTestString = (index:number, itemID:number) => {

    return `[${index}]=${itemID} test string => ${teststring.substr(0,Math.random() * teststring.length)}`

}

const VariableItemDynamic = (props:any) => {

    const {color, type, typeText, scrollerContext, sourceID} = props

    const isDnd = scrollerContext?.scroller.current.dndEnabled

    let localTypeText = '', sourceIDText = ''
    if (type && typeText) localTypeText = `${type} from ${typeText}:`

    if (sourceID) sourceIDText = `sourceID: ${sourceID}`

    const float = useMemo(() => {
        if (isDnd) return <div style = {{float:'left', height: '30px', width:'34px'}} />
        else return null

    },[isDnd])

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerContext.scroller.current

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

    const intervalRef = useRef<NodeJS.Timeout | null>(null)

    const [teststring, setTeststring] = useState('placeholder')
    const teststringRef = useRef<string>()
    teststringRef.current = teststring
    const iterationRef = useRef(0)

    useEffect(()=>{
        intervalRef.current = setInterval(() => {
            iterationRef.current ++
            const teststringinstance = getDynamicTestString(props.scrollerContext.cell.current.index, props.itemID)
            setTeststring(teststringinstance)

        },200 + (Math.random() * 2000))

        return () => {
            const intervalID = intervalRef.current
            clearInterval(intervalID as NodeJS.Timeout)
        }

    },[])

    return <div data-type = 'variable-dynamic' style = {outerstyles}>
        <div style = {innerstyles}>
            {isDnd && float}
            {sourceIDText && <>{sourceIDText} <br /></>} 
            {localTypeText && <>{localTypeText} <br /></>}
            {teststringRef.current}
        </div>
    </div>

}

// -----------------
// scroller property values assembled for dynamic variable content
// -----------------

const getVariableItemDynamicPack = (index:number, itemID:number, context:GenericObject) => {

     // return <VariableItemDynamic index = {index} itemID = {itemID} scrollerContext = {null}/>    

    const accept = context.accept

    const [cellType, typeText] = selectCellType(testVariableData,accept,index)

    const color = testVariableDataColors[cellType]

    const sourceID = globalSourceID++

    let component

     if (index == 30) {
         component = Promise.reject(new Error('not found for demo purposes'))
     } else if (index == 40) {
         component = 5 // deliberate return of an invalid (non-React-component) content type for demo
     } else {
         component = <VariableItemDynamic
             index = {index} 
             itemID = {itemID} 
             type = {cellType}
             typeText = {typeText}
             color = { color }
             sourceID = {sourceID}
             scrollerContext = {null} />
     }

    const dragText = `sourceID: ${sourceID}, ${cellType} from ${typeText}`

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
    }

    return itemPack

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

    getItemPack: getVariableItemDynamicPack,
    styles: variableScrollerStyles,
    placeholderMessages: simplePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}

// ======================[ 7. variable oversized content ]=========================

const oversizedteststring = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Purus non enim praesent elementum facilisis leo. At volutpat diam ut venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed elementum tempus egestas sed sed risus pretium quam. Tristique risus nec feugiat in fermentum. Sem fringilla ut morbi tincidunt. Malesuada nunc vel risus commodo. Nulla pellentesque dignissim enim sit amet venenatis urna cursus. In egestas erat imperdiet sed euismod nisi porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Purus non enim praesent elementum facilisis leo. At volutpat diam ut venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed elementum tempus egestas sed sed risus pretium quam. Tristique risus nec feugiat in fermentum. Sem fringilla ut morbi tincidunt. Malesuada nunc vel risus commodo. Nulla pellentesque dignissim enim sit amet venenatis urna cursus. In egestas erat imperdiet sed euismod nisi porta.'

const getVariableOversizedTestString = (index:number, itemID:number) => {

    let teststr

    teststr =`[${index}]=${itemID} test string => ${oversizedteststring.substr(0,800 + (Math.random() * (oversizedteststring.length - 800)))}`

    return teststr
}

const VariableOversizedItem = (props:any) => {

    const {color, type, typeText, scrollerContext, sourceID} = props

    const isDnd = scrollerContext?.scroller.current.dndEnabled

    let localTypeText = '', sourceIDText = ''
    if (type && typeText) localTypeText = `${type} from ${typeText}:`

    if (sourceID) sourceIDText = `sourceID: ${sourceID}`

    const float = useMemo(() => {
        if (isDnd) return <div style = {{float:'left', height: '30px', width:'34px'}} />
        else return null

    },[isDnd])

    const testStringRef = useRef(getVariableOversizedTestString(props.scrollerContext.cell.current.index, props.itemID))

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerContext.scroller.current

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

    return <div ref = {scrollerElementRef} data-type = 'variable-oversized' style = {outerstyles}>
        <div style = {innerstyles}>
            {isDnd && float}
            {sourceIDText && <>{sourceIDText} <br /></>} 
            {localTypeText && <>{localTypeText} <br /></>}
            {testStringRef.current}
        </div>
    </div>
}

// -----------------
// scroller property values assembled for variable oversized content
// -----------------

const getVariableOversizedItemPack = (index:number, itemID:number, context:GenericObject) => {

     // return <VariableOversizedItem index = {index} itemID = {itemID} scrollerContext = {null}/>    

    const accept = context.accept

    const [cellType, typeText] = selectCellType(testVariableData,accept,index)

    const color = testVariableDataColors[cellType]

    const sourceID = globalSourceID++

    let component

     if (index == 30) {
         component = Promise.reject(new Error('not found for demo purposes'))
     } else if (index == 40) {
         component = 5 // deliberate return of an invalid (non-React-component) content type for demo
     } else {
         component = <VariableOversizedItem 
             index = {index} 
             itemID = {itemID} 
             type = {cellType}
             typeText = {typeText}
             color = { color }
             sourceID = {sourceID}
             scrollerContext = {null} />
     }

    const dragText = `sourceID: ${sourceID}, ${cellType} from ${typeText}`

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
    }

    return itemPack

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

    getItemPack: getVariableOversizedItemPack,
    styles: variableScrollerStyles,
    placeholderMessages: variablePlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}

// ======================[ 8. variable auto expand ]=========================

const getVariableAutoExpansionCount = (position:string, index:number) => {

    let count = 0

    if (position == 'SOL' && index >= -1000) count = 10

    if (position == 'EOL' && index <= 1000) count = 10

    const statePack:GenericObject = setDemoStatePack

    if (count) {
        statePack.setDemoState('autoexpand')
    }

    return count

}

const variableAutoexpandScrollerStyles = {
    viewport:{
        overscrollBehavior:'none'
    },
}

const variableAutoexpandPlaceholderMessages = {
    
}

const variableautoexpandProperties = {
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

    getItemPack: getVariableItemPack,
    getExpansionCount:getVariableAutoExpansionCount,
    styles: variableAutoexpandScrollerStyles,
    placeholderMessages: variableAutoexpandPlaceholderMessages,
    callbacks,
    technical: {
        showAxis:false
    },
}

// ======================[ 9. nesting mixed (uniform and variable) subscrollers ]=========================

// For this there is a scroller, that contains cells of scrollers (subscrollers)
// The subscroller content comes in two variants - variable content, and uniform content

// -----------------
// nested sub scrollers cell component definition
// -----------------
// --------------------[ subscroller component definition ]-----------------------

// subscrollers are passed a variant property which defines content

const subcrollerComponentStyles = {
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
        fontSize:'small',
    } as React.CSSProperties,
    frame:{
        position:'relative',
        width:'100%',
        backgroundColor:'beige',
        flex:'1',
    } as React.CSSProperties,
}

const subScrollerStyles = {
    // dndDragIcon:{
    //     top:'5px',
    // },
}

const SubscrollerComponent = (props:any) => {

    const [testState, setTestState] = useState('setup')
    const testStateRef = useRef<string|null>(null)
    testStateRef.current = testState

    const { 
        index, 
        itemID,
        scrollerContext,
        cacheAPI,
        variant,
        dndOptions,
        sourceID,
    } = props

    const properties = 
        (variant == 'uniform')?
            uniformSubscrollerProperties:
            variableSubscrollerProperties

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
        getItemPack,
        cache,
        layout,
        styles,
    } = properties

    const { scroller } = scrollerContext

    const dynamicorientationRef = useRef<null | string>(null)

    useEffect(() =>{

        const { orientation } = scroller.current
        dynamicorientationRef.current = 
            (orientation == 'vertical')?
                'horizontal':
                'vertical'

    },[scroller.current.orientation])

    const { size:listsize, lowindex } = scroller.current.virtualListProps

    useEffect(()=>{

        switch (testState) {
            case 'setup':
            case 'revised': {
                setTestState('ready')
                break
            }
        }

    },[testState])

    const isDnd = scrollerContext?.scroller.current.dndEnabled

    const float = useMemo(() => {
        if (isDnd) return <div 
            style = {{float:'left', height: '28px', width:'18px'}} 
            data-type = 'dnd-float'
        />
        else return null

    },[isDnd])

    return <div data-type = "list-frame" style = {subcrollerComponentStyles.container} >
        <div data-type = "list-header" style = {subcrollerComponentStyles.header} >
            {isDnd && float}
            [{props.scrollerContext.cell.current.index}]={itemID} {index + 1 - lowindex}/{listsize}
            {' sourceID: '+ sourceID + '; ' + dndOptions.accept.join(', ')}
        </div>
        <div data-type = "list-content" style = {subcrollerComponentStyles.frame}>

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
                getItemPack = {getItemPack}
                callbacks = { null }
                placeholder = { null }
                styles = { styles }
                layout = { layout }
                dndOptions = { dndOptions }
                scrollerContext = { scrollerContext }
                cacheAPI = {cacheAPI}
            />

        </div>

    </div>

}

// --------------------[ variable subscroller cell content ]-----------------------

let variableSubscrollerItemStyles = {
    outer:{
        // backgroundColor:'white',
        overflow:'scroll',
    } as React.CSSProperties,
    inner:{
        padding:'3px',
        border:'1px solid black',
        borderRadius:'8px',
        // backgroundColor:'white',
        fontSize:'small',
    } as React.CSSProperties
}

const getVariableSubscrollerTestString = (index:number, itemID:number) => {

    const str =`[${index}]=${itemID} test string => ${teststring.substr(0,Math.random() * teststring.length)}`

    return str
}

const VariableSubscrollerItem = (props:any) => {

    const {color, type, typeText, scrollerContext, sourceID} = props

    const isDnd = scrollerContext?.scroller.current.dndEnabled

    let localTypeText = '', sourceIDText = ''
    if (type && typeText) localTypeText = `${type} from ${typeText}:`

    if (sourceID) sourceIDText = `sourceID: ${sourceID}`

    const float = useMemo(() => {
        if (isDnd) return <div style = {{float:'left', height: '30px', width:'34px'}} />
        else return null

    },[isDnd])

    const testStringRef = useRef(getVariableSubscrollerTestString(props.scrollerContext.cell.current.index, props.itemID))

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerContext.scroller.current

    const orientationstyles = 
        (orientation == 'vertical')?
            {
                maxHeight:cellHeight,
                height:'',
                maxWidth:'',
                width:'100%',
                fontSize:'small',
            }:
            {
                maxHeight:'',
                height:'100%',
                maxWidth:cellWidth,
                width:'',
                fontSize:'small',
            }

    const outerstyles = {...variableSubscrollerItemStyles.outer, ...orientationstyles}
    const innerstyles = {...variableComponentStyles.inner}

    color && (innerstyles.backgroundColor = color)

    return <div data-type = 'variable-subscroller' style = {outerstyles}>
        <div style = {innerstyles}>
            {isDnd && float}
            {sourceIDText && <>{sourceIDText} <br /></>} 
            {localTypeText && <>{localTypeText} <br /></>}
            {testStringRef.current}
        </div>
    </div>
}

const getVariableSubscrollerItemPack = (index:number, itemID:number, context:GenericObject) => {

    const accept = context.accept

    const [cellType, typeText] = selectCellType(testVariableData,accept,index)

    const color = testVariableDataColors[cellType]

    const sourceID = globalSourceID++

    const component = 
        <VariableSubscrollerItem 
            index = {index} 
            itemID = {itemID} 
            type = {cellType}
            typeText = {typeText}
            color = { color }
            sourceID = {sourceID}
            scrollerContext = {null}
        />

    const dragText = `sourceID: ${sourceID}, ${cellType} from ${typeText}`

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
    }

     return itemPack

}

const variableSubscrollerProperties = {

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

    getItemPack: getVariableSubscrollerItemPack,
    styles:subScrollerStyles,
    placeholderMessages: null,
    callbacks:null,
    technical: {
        showAxis:false
    },

}

// -------------------[ uniform subscroller cell content ]-----------------

// -----------------
// (the subscroller content component itself is a simple div, so is defined in the getUniformSubscrollerItemPack function below)
// -----------------

const uniformSubscrollerItemStyles = {
        padding:'3px',
        border:'1px solid green',
        // backgroundColor:'white',
        height:'100%',
        boxSizing:'border-box',
        fontSize:'small',
    } as React.CSSProperties

// -----------------
// properties assembled for uniform subscroller variant
// -----------------

const UniformSubscrollerItem = (props:any) => {

    const {
        index,
        itemID,
        type,
        typeText,
        color,
        sourceID,
        scrollerContext,
    } = props

    const isDnd = scrollerContext?.scroller.current.dndEnabled

    const styles = {...uniformSubscrollerItemStyles, backgroundColor:color}

    const float = useMemo(() => {
        if (isDnd) return <div 
            style = {{float:'left', height: '28px', width:'34px'}} 
            data-type = 'dnd-float'
        />
        else return null

    },[isDnd])

    return <div 
        data-type = 'uniform-subscroller-item'
        style = { styles }>
            {isDnd && float}
            [{props.scrollerContext.cell.current.index}]={itemID} {type}: {typeText}
            {sourceID && <><br />{`sourceID: ${sourceID}`}</>}
    </div>

}

const getUniformSubscrollerItemPack = (index:any, itemID:number, context:GenericObject) => {

    const accept = context.accept

    const [cellType, typeText] = selectCellType(testUniformData,accept,index)

    const color = testUniformDataColors[cellType]

    const sourceID = globalSourceID++

    const component = 
        <UniformSubscrollerItem 
            index = {index} 
            itemID = {itemID} 
            type = {cellType}
            typeText = {typeText}
            color = { color }
            sourceID = {sourceID}
            scrollerContext = {null}
        />

    const dragText = `sourceID: ${sourceID}, ${cellType}: ${typeText}`

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
    }

     return itemPack

}

const uniformSubscrollerProperties = {

    startingIndex:0,
    startingListSize:100,
    startingListRange:[-50,50],
    orientation:'vertical',
    cellHeight:45,
    cellWidth:250,
    padding:6,
    gap:2,
    runwaySize:4,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItemPack: getUniformSubscrollerItemPack,
    styles:subScrollerStyles,
    placeholderMessages: null,
    callbacks:null,
    technical: {
        showAxis:false
    },

}

// --------------------[ nesting mixed scroller properties ]----------------------

const getMixedSubscrollerPack = (index:number, itemID:number, context:GenericObject) => {

    const selector = (Math.abs(index) % 2)

    const variant = context.accept[selector]

    const cellType = variant

    const accept = getSubscrollerAccepts(cellType) || []

    const sourceID = globalSourceID++

    const dragText = `sourceID: ${sourceID}, ${accept.join(', ')}`

    const dndOptions = {
        type:cellType,
        accept,
        dragText,
    }

    const component = <SubscrollerComponent 
        index = { index } 
        itemID = { itemID }
        variant = { variant }
        sourceID = {sourceID}
        dndOptions = { dndOptions }
        cacheAPI = { null }
        scrollerContext = { null }
    />

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{ type:cellType, sourceID},
    }

     return itemPack

}

const nestingScrollerStyles = {
    viewport:{
        overscrollBehavior:'none',
    },
    dndDragIcon: {
        top:'5px',
    }
}

const nestingmixedProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'horizontal',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItemPack:getMixedSubscrollerPack,
    styles:nestingScrollerStyles,
    placeholderMessages: null,
    callbacks,
    technical:{
        showAxis:false
    },
}

// =======================[ 10. nesting mixed subscroller item promises ]========================

// -----------------
// scroller property values assembled for the nested scroller promises variant
// -----------------

// note the setTimeout
const getMixedSubscrollerPromisePack = (index:number, itemID:number, context:GenericObject) => {

    const selector = (Math.abs(index) % 2)

    const variant = context.accept[selector]

    const cellType = variant

    const accept = getSubscrollerAccepts(cellType) || [] // "possibly undefined" below

    const sourceID = globalSourceID++

    const dragText = `sourceID: ${sourceID}, ${accept.join(', ')}`

    const dndOptions = {
        type:cellType,
        accept,
        dragText,
    }

    const component = new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(
                <SubscrollerComponent 
                    index = {index} 
                    itemID = {itemID}
                    variant = {variant}
                    sourceID = {sourceID}
                    dndOptions = { dndOptions }
                    cacheAPI = {null}
                    scrollerContext = {null}
                />
            )

        },400 + (Math.random() * 2000))
    })

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{ type:cellType, sourceID},
    }

     return itemPack
}

const nestingmixedpromisesProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'horizontal',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItemPack:getMixedSubscrollerPromisePack,
    styles:nestingScrollerStyles,
    placeholderMessages: null,
    callbacks,
    technical: {
        showAxis:false
    },
}

// --------------------[ 11. - nesting mixed subscroller auto expand ]----------------------


const getNestingMixedAutoExpansionCount = (position:string, index:number) => {

    let count = 0

    if (position == 'SOL' && index >= -1000) count = 10

    if (position == 'EOL' && index <= 1000) count = 10

    const statePack:GenericObject = setDemoStatePack

    if (count) {
        statePack.setDemoState('autoexpand')
    }

    return count

}

const nestingmixedautoexpandProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'horizontal',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItemPack:getMixedSubscrollerPack,
    getExpansionCount:getNestingMixedAutoExpansionCount,
    styles:nestingScrollerStyles,
    placeholderMessages: null,
    callbacks,
    technical: {
        showAxis:false
    },
}

// --------------------[ 12. - nesting uniform scrollers ]----------------------

// -----------------
// scroller property values assembled for the nested scroller
// -----------------

const getUniformSubscrollerPack = (index:number, itemID:number, context:GenericObject) => {

    const variant = 'uniform'

    const cellType = variant

    const accept = getSubscrollerAccepts(variant) || []

    const sourceID = globalSourceID++

    const dragText = `sourceID: ${sourceID}, ${accept.join(', ')}`

    const dndOptions = {
        type:cellType,
        accept,
        dragText,
    }

    const component = <SubscrollerComponent 
        index = {index} 
        itemID = {itemID}
        variant = {variant}
        sourceID = {sourceID}
        dndOptions = { dndOptions }
        cacheAPI = {null}
        scrollerContext = {null}
    />

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{ type:cellType, sourceID},
    }

     return itemPack
}

const nestinguniformProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'horizontal',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItemPack:getUniformSubscrollerPack,
    styles:nestingScrollerStyles,
    placeholderMessages: null,
    callbacks,
    technical:{
        showAxis:false
    },
}

// --------------------[ 13. - nesting variable scrollers ]----------------------

// -----------------
// scroller property values assembled for the nested scroller
// -----------------

const getVariableSubscrollerPack = (index:number, itemID:number, context:GenericObject) => {

    const variant = 'variable'

    const cellType = variant

    const accept = getSubscrollerAccepts(variant) || []

    const sourceID = globalSourceID++

    const dragText = `sourceID: ${sourceID}, ${accept.join(', ')}`

    const dndOptions = {
        type:cellType,
        accept,
        dragText,
    }

    const component = <SubscrollerComponent 
        index = {index} 
        itemID = {itemID}
        variant = {variant}
        sourceID = {sourceID}
        dndOptions = { dndOptions }
        cacheAPI = {null}
        scrollerContext = {null}
    />

    const itemPack = {
        content:component,
        dndOptions:{type:cellType, dragText},
        profile:{ type:cellType, sourceID},
    }

     return itemPack
}

const nestingvariableProperties = {
    startingIndex:0,
    startingListSize:200,
    startingListRange:[-50,50],
    orientation:'horizontal',
    cellHeight:400,
    cellWidth:300,
    padding:5,
    gap:5,
    runwaySize:3,
    cache:'cradle',
    cacheMax:200,
    layout: 'uniform',

    getItemPack:getVariableSubscrollerPack,
    styles:nestingScrollerStyles,
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
    variableautoexpand:variableautoexpandProperties,
    nestingmixed:nestingmixedProperties,
    nestingmixedpromises:nestingmixedpromisesProperties,
    nestingmixedautoexpand: nestingmixedautoexpandProperties,
    nestinguniform:nestinguniformProperties,
    nestingvariable:nestingvariableProperties,
}

// this is exported for the App module to use
export const demoAllContentTypePropertiesRef = {current:{...defaultAllContentTypeProperties} as GenericObject}

// ----------------------------------[ type definition ]----------------------------

export type GenericObject = {
    [prop:string]:any
}
