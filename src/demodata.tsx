// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

import React, {useRef, useState, useEffect, useMemo, useContext} from 'react'

import Scroller from 'react-infinite-grid-scroller'

import { setDemoStatePack, DndEnabledContext } from './App'

import {FormControl, Checkbox} from '@chakra-ui/react'

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
    changeListRangeCallback:false,
    deleteListCallback:false,
    repositioningFlagCallback:false,
    boundaryCallback:false,
    dragDropTransferCallback:false,
}

// initialize the demo settings with the default settings, and export to the App module. 
// These settings can be changed in the Callbacks section of the Options drawer
export const demoCallbackFlagsRef = {current:{...defaultCallbackFlags} as GenericObject}


// -----------------
// the individual callback definitions follow...
// -----------------

const referenceIndexCallback = (index:number, context:GenericObject) => { //location:string, cradleState:string) => {

    demoCallbackFlagsRef.current.referenceIndexCallback && 
        console.log('referenceIndexCallback: index, context',
            index, context)
   
}

const boundaryCallback = (position:string, index:number, context:GenericObject) => {
    demoCallbackFlagsRef.current.boundaryCallback && 
        console.log('boundaryCallback: position, index, context', position, index, context)
}

export const dragDropTransferCallback = (
    sourceScrollerID:number, sourceIndex:number, targetScrollerID:number, targetIndex:number, context:GenericObject) => {

    demoCallbackFlagsRef.current.dragDropTransferCallback && 
        console.log('dragDropTransferCallback: sourceScrollerID, sourceIndex, targetScrollerID targetIndex, context', 
            sourceScrollerID, sourceIndex, targetScrollerID, targetIndex, context)

}

const preloadIndexCallback = (index:number, context:GenericObject) => {
    
    demoCallbackFlagsRef.current.preloadIndexCallback && 
        console.log('preloadIndexCallback: index, context', 
            index, context)

}
const deleteListCallback = (deleteList:number[], context:object) => {
    
    demoCallbackFlagsRef.current.deleteListCallback && 
        console.log('deleteListCallback: deleteList, context',
            deleteList, context)

}
const repositioningIndexCallback = (index:number, context:object) => {
    
    demoCallbackFlagsRef.current.repositioningIndexCallback && 
        console.log('repositioningIndexCallback: index, context',
            index, context)

}

const repositioningFlagCallback = (flag:boolean, context:object) => {
    
    demoCallbackFlagsRef.current.repositioningFlagCallback && 
        console.log('repositioningFlagCallback: flag, context',
            flag, context)

}

const changeListRangeCallback = (newlistrange:number[], context:object) => {

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
    changeListRangeCallback,
    deleteListCallback,
    repositioningFlagCallback,
    boundaryCallback,
    dragDropTransferCallback,
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

    1. uniformcontent:          uniformcontentProperties,
    2. uniformpromises:         uniformpromisesProperties,
    3. uniformautoexpand:       uniformautoexpandProperties,
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
        fontSize:'small',
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

    const {color, type, typeText, itemID, scrollerContext, sourceID} = props

    const isDnd = scrollerContext?.scroller.current.dndEnabled

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

    const indexstring = `list index ${scrollerContext.cell.current.index}, `
    const itemIDstring = `cache itemID ${itemID}`
    const sourceIDstring = `sourceID: ${sourceID}`

    return <div data-type = 'simple-uniform' style = {simpleComponentStyles.outer}>
        <div style = {simpleComponentStyles.inner}>
            {isDnd && float}
            {indexstring}
            {itemIDstring}, &nbsp;
            {sourceID && sourceIDstring}, &nbsp;
            {localTypeText && localTypeText}
        </div>
    </div>

}

// -----------------
// scroller property assembly for simple uniform content component
// -----------------

// the getItemPack function for simple uniform content
const getSimpleItemPack = (index:number, itemID:number, context:GenericObject) => {

    const accept = context.scrollerProfile.accept;
    let cellType, typeText, originalTypeText, color, sourceID, copyCount

    if (context.contextType == 'dndFetchRequest') {

        ({ type:cellType } = context.item.dndOptions)
        const { profile } = context.item
        const { dropEffect } = context.item;
        ({ 
            typeText,
            originalTypeText,
            color,
            sourceID,
        } = context.item.profile)
        if (dropEffect == 'copy') {
            ({ copyCount } = profile);
            copyCount = copyCount ?? 0
            copyCount++
            if (!originalTypeText) {
                originalTypeText = typeText
            } else {
                typeText = originalTypeText
            }
            typeText = `copy (${copyCount}) ` + typeText
        }

    } else {

        const acceptlist = accept.filter((item:any)=>{
            return !['__NATIVE_FILE__','__NATIVE_URL__','__NATIVE_TEXT__'].includes(item)
        });

        ([cellType, typeText] = selectCellType(testUniformData,acceptlist,index))

        color = testUniformDataColors[cellType]

        sourceID = globalSourceID++

    }

    let dragText = `sourceID: ${sourceID}, ${cellType}: ${typeText}`
    if (copyCount) {
        dragText = `copy (${copyCount}) ` + dragText
    }


    let component

     if (index == 30) {
         component = Promise.reject(new Error(`not found for demo purposes (${index})`))
     } else if (index == 35) {
         return undefined
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

    const profile:GenericObject = {color, type:cellType, typeText, sourceID}
    if (copyCount) {
        profile.copyCount = copyCount
    }
    if (originalTypeText) {
        profile.originalTypeText = originalTypeText
    }

    const itemPack = {
        component,
        dndOptions:{type:cellType, dragText},
        profile,
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
const uniformcontentProperties = {
    startingIndex:0,
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

    const accept = context.scrollerProfile.accept

    let [cellType, typeText] = selectCellType(testUniformData,accept,index)

    if (context.contextType == 'dndFetchRequest') {

        const { dropEffect } = context.item;

        if (dropEffect == 'copy') {
            typeText += ' (copy)'
        }

    }

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
        component,
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
const uniformpromisesProperties = {
    startingIndex:0,
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
const uniformautoexpandProperties = {
    startingIndex:0,
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

const getVariableString = () => {
    return teststring.substr(0,Math.random() * teststring.length)
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

    const testStringRef = useRef<any>(null)

    if (!testStringRef.current) {

        const testString = getVariableString()

        testStringRef.current = testString

    }

    const presentationString = useMemo(()=>{
        return `[${props.scrollerContext.cell.current.index}]=${props.scrollerContext.cell.current.itemID} test string => ` +
        testStringRef.current
    },[props.scrollerContext.cell.current.index, props.scrollerContext.cell.current.itemID])

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerContext.scroller.current

    const orientationstyles = 
        (orientation == 'vertical')
            ?{
                maxHeight:cellHeight,
                height:'',
                maxWidth:'',
                width:'100%',
            }
            :{
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
            {presentationString}
        </div>
    </div>
}

// -----------------
// scroller property values assembled for variable content
// -----------------

const getVariableItemPack = (index:number, itemID:number, context:GenericObject) => {

    const accept = context.scrollerProfile.accept

    let [cellType, typeText] = selectCellType(testVariableData,accept,index)

    if (context.contextType == 'dndFetchRequest') {

        const { dropEffect } = context.item;

        if (dropEffect == 'copy') {
            typeText += ' (copy)'
        }

    }

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
        component,
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
    startingListRange:[-60,60],
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

    
    const accept = context.scrollerProfile.accept

    let [cellType, typeText] = selectCellType(testVariableData,accept,index)

    if (context.contextType == 'dndFetchRequest') {

        const { dropEffect } = context.item;

        if (dropEffect == 'copy') {
            typeText += ' (copy)'
        }

    }

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
        component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
    }

    return itemPack

}

const variablepromiseProperties = {
    startingIndex:0,
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

const getDynamicTestString = () => {

    return `${teststring.substr(0,Math.random() * teststring.length)}`

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
            const teststringinstance = 
                `[${scrollerContext.cell.current.index}]=${scrollerContext.cell.current.itemID} test string => ` 
                + getDynamicTestString()
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

    const accept = context.scrollerProfile.accept

    let [cellType, typeText] = selectCellType(testVariableData,accept,index)

    if (context.contextType == 'dndFetchRequest') {

        const { dropEffect } = context.item;

        if (dropEffect == 'copy') {
            typeText += ' (copy)'
        }

    }

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
        component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
    }

    return itemPack

}

const variabledynamicProperties = {
    startingIndex:0,
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

const getVariableOversizedTestString = () => {

    let teststr

    teststr =`${oversizedteststring.substr(0,800 + (Math.random() * (oversizedteststring.length - 800)))}`

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

    const testStringRef = useRef(getVariableOversizedTestString())

    const presentationString = useMemo(() => {
        return `[${props.scrollerContext.cell.current.index}]=${props.scrollerContext.cell.current.itemID} test string => `
        + testStringRef.current
    },[props.scrollerContext.cell.current.index, props.scrollerContext.cell.current.itemID])

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
            {presentationString}
        </div>
    </div>
}

// -----------------
// scroller property values assembled for variable oversized content
// -----------------

const getVariableOversizedItemPack = (index:number, itemID:number, context:GenericObject) => {

     // return <VariableOversizedItem index = {index} itemID = {itemID} scrollerContext = {null}/>    

    const accept = context.scrollerProfile.accept

    let [cellType, typeText] = selectCellType(testVariableData,accept,index)

    if (context.contextType == 'dndFetchRequest') {

        const { dropEffect } = context.item;

        if (dropEffect == 'copy') {
            typeText += ' (copy)'
        }

    }

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
        component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
    }

    return itemPack

}

const variableoversizedProperties = {
    startingIndex:0,
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
    startingListRange:[-60,60],
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

    const [subscrollerState, setSubscrollerState] = useState('setup')
    const subscrollerStateRef = useRef<string|null>(null)
    subscrollerStateRef.current = subscrollerState

    const dndEnabledContext = useContext( DndEnabledContext )

    const { 
        index, 
        itemID,
        scrollerContext,
        context,
        variant,
        dndOptions,
        sourceID,
        profile,
        callbacks:generalcallbacks,
    } = props

    const properties = 
        (variant == 'uniform')?
            uniformSubscrollerProperties:
            variableSubscrollerProperties

    const {
        // orientation, 
        gap, 
        // padding, 
        cellHeight, 
        cellWidth, 
        runwaySize, 
        getItemPack,
        cache,
        layout,
        styles,
    } = properties

    let { startingListRange, padding, startingIndex }:
        {
            startingListRange:number[] | number,
            padding:number[] | number,
            startingIndex:number,
            
        } = properties

    if (index === 1) {
        startingListRange = [-30,30]
        padding = [20,10]
    }

    const startingIndexRef = useRef(startingIndex)

    const dndOptionsRef = useRef(dndOptions)
    dndOptionsRef.current = dndOptions

    useEffect(()=>{

        dndOptionsRef.current.enabled = dndEnabledContext
        setSubscrollerState('revised')

    },[dndEnabledContext])

    const { scroller } = scrollerContext

    const dynamicorientationRef = useRef<null | string>(null)

    const subscrollerAPIRef = useRef({} as GenericObject)

    const functionsCallback = (functions:GenericObject) => {

        subscrollerAPIRef.current = functions

    }

    const callbacks = {
        functionsCallback,
        deleteListCallback,
        changeListRangeCallback,
        dragDropTransferCallback,
    }
    useEffect(() =>{

        const { orientation } = scroller.current
        dynamicorientationRef.current = 
            (orientation == 'vertical')?
                'horizontal':
                'vertical'

    },[scroller.current.orientation])

    const { size:listsize, lowindex } = scroller.current.virtualListProps

    useEffect(()=>{

        switch (subscrollerState) {
            case 'setup':
            case 'revised': {
                setSubscrollerState('ready')
                break
            }
        }

    },[subscrollerState])

    const isDnd = scrollerContext?.scroller.current.dndEnabled

    const float = useMemo(() => {
        if (isDnd) return <div 
            style = {{float:'left', height: '28px', width:'18px'}} 
            data-type = 'dnd-float'
        />
        else return null

    },[isDnd])

    const checkdnd = (event:React.ChangeEvent) => {
        const target = event.target as HTMLInputElement
        const isChecked = target.checked
        dndOptionsRef.current.enabled = isChecked
        setSubscrollerState('revised')
    }

    let desc = profile.accept.join(', ')

    if (context.contextType == 'dndFetchRequest') {

        const { dropEffect } = context.item;

        if (dropEffect == 'copy') {
            desc += ' (subscroller template copy)'
        }

    }

    return <div data-type = "list-frame" style = {subcrollerComponentStyles.container} >
        <div data-type = "list-header" style = {subcrollerComponentStyles.header} >
            {isDnd && float}
            [{scrollerContext.cell.current.index}]={itemID} {index + 1 - lowindex}/{listsize}
            {
                ' sourceID: '+ sourceID + '; ' 
                + desc
            }
            {scrollerContext.scroller.current.dndInstalled 
            && <FormControl borderTop = '1px' style = {{clear:'left'}}>
                <Checkbox 
                    isChecked = {dndOptionsRef.current.enabled} 
                    size = 'sm'
                    mt = {2}
                    onChange = {checkdnd}
                >
                    Drag and drop
                </Checkbox>
            </FormControl>}
        </div>

        <div data-type = "list-content" style = {subcrollerComponentStyles.frame}>

            <Scroller 
                orientation = { dynamicorientationRef.current } 
                cache = { cache }
                gap = { gap}
                padding = { padding }
                cellHeight = { cellHeight }
                cellWidth = { cellWidth }
                runwaySize = { runwaySize }
                startingListRange = { startingListRange }
                startingIndex = { startingIndexRef.current }
                getItemPack = { getItemPack }
                callbacks = { callbacks }
                placeholder = { null }
                styles = { styles }
                layout = { layout }
                dndOptions = { dndOptionsRef.current }
                profile = { profile }
                scrollerContext = { scrollerContext }
                // cacheAPI = { cacheAPI }
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

    const accept = context.scrollerProfile.accept

    let [cellType, typeText] = selectCellType(testVariableData,accept,index)

    if (context.contextType == 'dndFetchRequest') {

        const { dropEffect } = context.item;

        if (dropEffect == 'copy') {
            typeText += ' (copy)'
        }

    }

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
        component,
        dndOptions:{type:cellType, dragText},
        profile:{color, type:cellType, typeText, sourceID},
    }

     return itemPack

}

const variableSubscrollerProperties = {

    startingIndex:0,
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
        return <div 
            style = {{float:'left', height: '28px', width:'34px'}} 
            data-type = 'dnd-float'
        />

    },[])

    return <div 
        data-type = 'uniform-subscroller-item'
        style = { styles }>
            {isDnd && float}
            [{props.scrollerContext.cell.current.index}]={itemID} {type}: {typeText}
            {sourceID && <><br />{`sourceID: ${sourceID}`}</>}
    </div>

}

const getUniformSubscrollerItemPack = (index:any, itemID:number, context:GenericObject) => {

    const accept = context.scrollerProfile.accept
    let cellType, typeText, originalTypeText, color, sourceID, copyCount

    if (context.contextType == 'dndFetchRequest') {

        ({ type:cellType } = context.item.dndOptions)
        const { profile } = context.item
        const { dropEffect } = context.item;
        ({ 
            typeText,
            originalTypeText,
            color,
            sourceID,
        } = context.item.profile)
        if (dropEffect == 'copy') {
            ({ copyCount } = profile);
            copyCount = copyCount ?? 0
            copyCount++
            if (!originalTypeText) {
                originalTypeText = typeText
            } else {
                typeText = originalTypeText
            }
            typeText = `copy (${copyCount}) ` + typeText
        }

    } else {

        ([cellType, typeText] = selectCellType(testUniformData,accept,index));

        color = testUniformDataColors[cellType]

        sourceID = globalSourceID++

    }

    let dragText = `sourceID: ${sourceID}, ${cellType}: ${typeText}`
    if (copyCount) {
        dragText = `copy (${copyCount}) ` + dragText
    }

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

    // const dragText = `sourceID: ${sourceID}, ${cellType}: ${typeText}`
    const profile:GenericObject = {color, type:cellType, typeText, sourceID}
    if (copyCount) {
        profile.copyCount = copyCount
    }
    if (originalTypeText) {
        profile.originalTypeText = originalTypeText
    }

    const itemPack = {
        component,
        dndOptions:{type:cellType, dragText},
        profile,
    }

     return itemPack

}

const uniformSubscrollerProperties = {

    startingIndex:0,
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

    const variant = context.scrollerProfile.accept[selector]

    const cellType = variant

    let accept
    if (context.contextType == 'dndFetchRequest') {

        accept = context.item.profile.accept

    } else {

        accept = getSubscrollerAccepts(cellType) || []

    }

    const sourceID = globalSourceID++

    const dragText = `sourceID: ${sourceID}, ${accept.join(', ')}`

    const dndOptions = {
        accept,
    }

    const component = <SubscrollerComponent 
        index = { index } 
        itemID = { itemID }
        variant = { variant }
        sourceID = {sourceID}
        dndOptions = { dndOptions }
        profile = {{accept}}
        context = {context}
        scrollerContext = { null }
    />

    const itemPack = {
        component,
        dndOptions:{type:cellType, dragText},
        profile:{ type:cellType, sourceID, accept},
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

    const variant = context.scrollerProfile.accept[selector]

    const cellType = variant

    let accept:any

    if (context.contextType == 'dndFetchRequest') {

        accept = context.item.profile.accept

    } else {

        accept = getSubscrollerAccepts(cellType) || []

    }

    const sourceID = globalSourceID++

    const dragText = `sourceID: ${sourceID}, ${accept.join(', ')}`

    const dndOptions = {
        accept,
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
                    profile = {{accept}}
                    context = { context }
                    scrollerContext = {null}
                />
            )

        },400 + (Math.random() * 2000))
    })

    const itemPack = {
        component,
        dndOptions:{type:cellType, dragText},
        profile:{ type:cellType, sourceID, accept},
    }

     return itemPack
}

const nestingmixedpromisesProperties = {
    startingIndex:0,
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

    const [variant] = context.scrollerProfile.accept

    const cellType = variant

    let accept:any

    if (context.contextType == 'dndFetchRequest') {

        accept = context.item.profile.accept

    } else {

        accept = getSubscrollerAccepts(cellType) || []

    }

    const sourceID = globalSourceID++

    const dragText = `sourceID: ${sourceID}, ${accept.join(', ')}`

    const dndOptions = {
        accept,
    }

    const component = <SubscrollerComponent 
        index = {index} 
        itemID = {itemID}
        variant = {variant}
        sourceID = {sourceID}
        profile = {{accept}}
        dndOptions = { dndOptions }
        context = { context }
        scrollerContext = {null}
    />

    const itemPack = {
        component,
        dndOptions:{type:cellType, dragText},
        profile:{ type:cellType, sourceID, accept},
    }

     return itemPack
}

const nestinguniformProperties = {
    startingIndex:0,
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

    const [variant] = context.scrollerProfile.accept

    const cellType = variant

    let accept:any

    if (context.contextType == 'dndFetchRequest') {

        accept = context.item.profile.accept

    } else {

        accept = getSubscrollerAccepts(cellType) || []

    }

    const sourceID = globalSourceID++

    let dragText = `sourceID: ${sourceID}, ${accept.join(', ')}`

    const dndOptions = {
        accept,
    }

    const component = <SubscrollerComponent 
        index = {index} 
        itemID = {itemID}
        variant = {variant}
        sourceID = {sourceID}
        profile = {{accept}}
        dndOptions = { dndOptions }
        context = { context }
        scrollerContext = {null}
    />

    const itemPack = {
        component,
        dndOptions:{type:cellType, dragText},
        profile:{ type:cellType, sourceID, accept},
    }

     return itemPack
}

const nestingvariableProperties = {
    startingIndex:0,
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


const staticlayoutProperties = {
    layout: 'static',
}
// ==============================[ consolidated scroller properties namespace ]=========================

// this is exported for the App module to use
export const defaultAllContentTypeProperties = {
    uniformcontent:uniformcontentProperties,
    uniformpromises:uniformpromisesProperties,
    uniformautoexpand:uniformautoexpandProperties,
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
    staticlayout:staticlayoutProperties,
}

// this is exported for the App module to use
export const demoAllContentTypePropertiesRef = {current:{...defaultAllContentTypeProperties} as GenericObject}

// ----------------------------------[ type definition ]----------------------------

export type GenericObject = {
    [prop:string]:any
}
