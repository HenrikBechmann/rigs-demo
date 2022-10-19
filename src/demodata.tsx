import React, {useRef, useState, useEffect} from 'react'

import Scroller from 'react-infinite-grid-scroller'

const getGenericItem = (index:number) => {

    // console.log('getting generic item', index, typeof index)

    // if (index == 0) return <GenericItemDynamic index = {index}/>

     // return <GenericItem index = {index} image = {'https://loremflickr.com/200/300?random='+index}/>
     // if ((index == 130) || (index == 145)) console.log('getGenericItem returning index', index)
     if (index == 30) return Promise.reject(new Error('not found'))
     if (index == 40) return 5
     // if (index == 45) return null
     const returnvalue = <GenericItem index = {index} />
     // console.log('return value from getGenericItem', returnvalue)
     return returnvalue

}

const getGenericItemPromise = (index:number) => {

    return new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(<GenericItem index = {index} />)

        },400 + (Math.random() * 2000))
    })

}

const getNestedItem = (index:number) => {

    return <NestedBox 
        index = {index} 
        childorientation = {defaultProperties.nested.childorientation} 
        setlistsize = {defaultProperties.nested.estimatedListSize}
        scrollerProperties = {null}
    />

}

const getNestedItemPromise = (index:number) => {

    return <NestedBox 
        index = {index} 
        childorientation = {defaultProperties.nested.childorientation} 
        setlistsize = {defaultProperties.nested.estimatedListSize}
        scrollerProperties = {null}
    />

}

const getVariableItem = (index:number) => {

     return <VariableItem index = {index} scrollerProperties = {null}/>    

}

const getVariableItemPromise = (index:number) => {

    return new Promise((resolve, reject) => {
        setTimeout(()=> {

            resolve(<VariableItemDynamic index = {index} scrollerProperties = {null}/>)

        },400 + (Math.random() * 2000))
    })

     // return <VariableItem index = {index} scrollerProperties = {null}/>    

}
const getVariableItemDynamic = (index:number) => {

     return <VariableItemDynamic index = {index} scrollerProperties = {null}/>    

}

export const callbackSettings = {
    referenceIndexCallback:false,
    repositioningIndexCallback:false,
    preloadIndexCallback:false,
    itemExceptionCallback:false,
    changeListsizeCallback:false,
    deleteListCallback:false,
    repositioningFlagCallback:false,
}

const referenceIndexCallback = (index:number, location:string, cradleState:string) => {

    callbackSettings.referenceIndexCallback && console.log('referenceIndexCallback: index, location, cradleState',
        index, location, cradleState)
   
}
const preloadIndexCallback = (index:number) => {
    
    callbackSettings.preloadIndexCallback && console.log('preloadIndexCallback: index', index)

}
const deleteListCallback = (reason:string, deleteList:number[]) => {
    
    callbackSettings.deleteListCallback && console.log('deleteListCallback: reason, deleteList',reason, deleteList)

}
const repositioningIndexCallback = (index:number) => {
    
    callbackSettings.repositioningIndexCallback && console.log('repositioningIndexCallback: index',index)

}

const repositioningFlagCallback = (flag:boolean) => {
    
    callbackSettings.repositioningFlagCallback && console.log('repositioningFlagCallback: index',flag)

}

const changeListsizeCallback = (newlistsize:number) => {
    
    callbackSettings.changeListsizeCallback && console.log('changeListsizeCallback: newlistsize', newlistsize)

}

const itemExceptionCallback = (index:number, itemID:number, returnvalue:any, location:string, error:Error) => {
    
    callbackSettings.itemExceptionCallback && console.log('itemExceptionCallback: index, itemID, returnvalue, location, error',
        index, itemID, returnvalue, location, error)

}

export const functionsRef:GenericObject = {current:null}

type GenericObject = {
    [prop:string]:any
}

const functionsCallback = (functions:GenericObject) => {
    functionsRef.current = functions
}

const callbacks = {
    referenceIndexCallback,
    repositioningIndexCallback,
    preloadIndexCallback,
    itemExceptionCallback,
    changeListsizeCallback,
    deleteListCallback,
    repositioningFlagCallback,
}

export const defaultProperties = {
    simple: {
        orientation:'vertical',
        cellHeight:150,
        cellWidth:150,
        padding:10,
        gap:5,
        runwaySize:4,
        cache:'cradle',
        cacheMax:200,

        startingIndex:0,
        estimatedListSize:200,
        getItem:getGenericItem,
        callbacks,
    },
    simplepromises: {
        orientation:'vertical',
        cellHeight:150,
        cellWidth:150,
        padding:10,
        gap:5,
        runwaySize:4,
        cache:'cradle',
        cacheMax:200,

        startingIndex:0,
        estimatedListSize:200,
        getItem:getGenericItemPromise,
        callbacks,
    },
    nested: {
        childorientation:'horizontal',
        cellHeight:400,
        cellWidth:250,
        padding:5,
        gap:5,
        runwaySize:2,
        cache:'cradle',
        cacheMax:200,

        startingIndex:0,
        estimatedListSize:400,
        getItem:getNestedItem,
        callbacks,
    },
    nestedpromises: {
        childorientation:'horizontal',
        cellHeight:400,
        cellWidth:250,
        padding:5,
        gap:5,
        runwaySize:2,
        cache:'cradle',
        cacheMax:200,

        startingIndex:0,
        estimatedListSize:400,
        getItem:getNestedItemPromise,
        callbacks,
    },
    variable: {
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

        startingIndex:0,
        estimatedListSize:200,
        getItem:getVariableItem,
        callbacks,
    },
    variablepromises: {
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

        startingIndex:50,
        estimatedListSize:200,
        getItem:getVariableItemPromise,
        callbacks,
    },
    variabledynamic: {
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

        startingIndex:0,
        estimatedListSize:200,
        getItem:getVariableItemDynamic,
        callbacks,
    },
}

// -----------------------------[ generic items ]------------------------

const genericstyleinner:React.CSSProperties = {
    position:'absolute',
    top:0,
    left:0,
    padding:'3px',
    backgroundColor:'white', 
    margin:'3px'
}

const genericstyleouter:React.CSSProperties = {
    position:'relative',
    height:'100%', 
    width:'100%',
    backgroundColor:'white',
    border: '1px solid black',
    borderRadius:'8px',
}

const GenericItem = (props:any) => {

    // console.log('loading GenericItem', props)
    const originalindexRef = useRef(props.index)

    return <div style = {genericstyleouter}>
        <div style = {genericstyleinner}>
            {originalindexRef.current + 1}
        </div>
    </div>

}

// ------------------------[ variable items ]----------------------------

const teststring = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna id volutpat lacus laoreet non curabitur gravida arcu. Arcu odio ut sem nulla pharetra diam. Amet facilisis magna etiam tempor orci eu. Consequat mauris nunc congue nisi vitae suscipit. Est ultricies integer quis auctor elit. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Purus non enim praesent elementum facilisis leo. At volutpat diam ut venenatis. Porttitor leo a diam sollicitudin tempor id eu nisl nunc. Sed elementum tempus egestas sed sed risus pretium quam. Tristique risus nec feugiat in fermentum. Sem fringilla ut morbi tincidunt. Malesuada nunc vel risus commodo. Nulla pellentesque dignissim enim sit amet venenatis urna cursus. In egestas erat imperdiet sed euismod nisi porta.'

let variablestyles = {
    // outer:{position:'relative',height:'100%', width:'100%',backgroundColor:'white'},
    outer:{
        backgroundColor:'white',
        overflow:'scroll',
        height: '100%',
        width:'100%',
        maxHeight:'',
        maxWidth: ''
    },
    inner:{
        // position:'absolute',
        // top:0,
        // left:0,
        padding:'3px',
        opacity:.5,
        borderRadius:'8px',
        backgroundColor:'white', 
        // minHeight:'0px',
        // maxHeight:'none',
        // minWidth:'0px',
        // maxWidth:'none',
        // margin:'3px'
    }
}

const teststrings:string[] = []

const getTestString = (index:number) => {
    // console.log('getTestString',index)
    if (!teststrings[index]) {
        if ([0,1,51,52,196,197,198,199].includes(index)) {
            teststrings[index] = 'TEST STRING' + index
        } else if (index == 0) {
            teststrings[index] =`${index + 1}: 'test string ' + ${teststring.substr(0,.5 * teststring.length)}`
        } else {
            teststrings[index] =`${index + 1}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`
        }
    }
    return teststrings[index]
}

const getTestStringDynamic = (index:number) => {
    // console.log('getTestString',index)
    return `${index + 1}: 'test string ' + ${teststring.substr(0,Math.random() * teststring.length)}`
}

const VariableItem = (props:any) => {

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerProperties.scrollerPropertiesRef.current

    const outerstyles:React.CSSProperties = {...variablestyles.outer}

    if (orientation == 'vertical') {
        outerstyles.maxHeight = cellHeight
        outerstyles.height = ''
        outerstyles.maxWidth = ''
        outerstyles.width = '100%'
    } else {
        outerstyles.maxHeight = ''
        outerstyles.height = '100%'
        outerstyles.maxWidth = cellWidth
        outerstyles.width = ''
    }

    return <div style = {outerstyles}>
        <div style = {variablestyles.inner as React.CSSProperties}>{getTestString(props.index)}</div>
    </div>
}


const VariableItemDynamic = (props:any) => {

    const {

        orientation,
        cellWidth,
        cellHeight

    } = props.scrollerProperties.scrollerPropertiesRef.current

    const outerstyles = {...variablestyles.outer}

    if (orientation == 'vertical') {
        outerstyles.maxHeight = cellHeight
        outerstyles.height = ''
        outerstyles.maxWidth = ''
        outerstyles.width = '100%'
    } else {
        outerstyles.maxHeight = ''
        outerstyles.height = '100%'
        outerstyles.maxWidth = cellWidth
        outerstyles.width = ''
    }

    const originalindexRef = useRef(props.index)

    const intervalRef = useRef<NodeJS.Timer | null>(null)

    const [teststring, setTeststring] = useState('test string')
    const teststringRef = useRef<string>()
    teststringRef.current = teststring
    const iterationRef = useRef(0)
    // console.log('running dynamic', iteration)
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
        <div style = {variablestyles.inner as React.CSSProperties}>{teststringRef.current}</div>
    </div>
}

// ---------------------------[ styles ]-----------------------

const uistyles = {
    viewportframe: {
        top:0,
        bottom:0,
        right:0, 
        left:0,
        position:'absolute', 
        margin:'10px', 
        border:'1px solid black'
    },
    framewrapper: {
        position:'relative',
        height:'500px',
    },
    optionswrapper: {
        padding:'8px',
        height:'160px',
        overflow:'auto',
    },
}

const genericcomponentstyles = {
    viewport:{
        backgroundColor:'green',
        overscrollBehavior:'none',
    },
    scrollblock:{
        backgroundColor:'brown',
    },
    cradle:{
        backgroundColor:'black',
    },
    scrolltracker:{
        backgroundColor:'cyan',
    }
}

const styles = {
    container: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:'beige',
        height:'100%',
    },
    header:{
        padding:'3px',
        backgroundColor:'silver',
        border:'2p solid darkgray',
    },
    frame:{
        position:'relative',
        width:'100%',
        backgroundColor:'beige',
        flex:'1',
    },
    item:{
        padding:'3px',
        border:'1px solid green',
        backgroundColor:'white',
        height:'100%',
        boxSizing:'border-box',
    }
}

const getListItem = (index:any) => {

    return <div style = { styles.item as React.CSSProperties }> Item {index + 1} of this list </div>

}

const settings = {

    orientation:'vertical',
    gap:2,
    padding:6,
    cellHeight:40,
    cellWidth:230,
    runway:4,
    offset:0,
    listsize:100,
    getListItem: getListItem,

}

const NestedBox = (props:any) => {

    // console.log('TestListBox props',props)

    const [testState, setTestState] = useState('setup')
    const testStateRef = useRef<string|null>(null)
    testStateRef.current = testState

    const { 
        index, 
        setlistsize, 
        childorientation, 
        scrollerProperties,
    } = props

    const {
        orientation, 
        gap, 
        padding, 
        cellHeight, 
        cellWidth, 
        runway, 
        offset, 
        listsize, 
        getListItem, 
    } = settings

    const { scrollerPropertiesRef } = scrollerProperties

    // console.log('testlist box scrollerPropertiesRef',scrollerPropertiesRef, scrollerProperties)

    const dynamicorientationRef = useRef(childorientation)

    const printedNumberRef = useRef(index)

    useEffect(() =>{
        if (testStateRef.current == 'setup') return
        const { orientation } = scrollerPropertiesRef.current
        if (orientation == 'vertical') {
            dynamicorientationRef.current = 'horizontal'
        } else {
            dynamicorientationRef.current = 'vertical'
        }
        setTestState('revised')

    },[scrollerPropertiesRef.current.orientation])

    const { cache } = scrollerPropertiesRef.current

    useEffect(()=>{

        switch (testState) {
            case 'setup':
            case 'revised': {
                setTestState('ready')
                break
            }
        }

    },[testState])

    return <div data-type = "list-frame" style = {styles.container as React.CSSProperties} >
        <div data-type = "list-header" style = {styles.header as React.CSSProperties} >
            List #{printedNumberRef.current + 1} of {setlistsize}
        </div>
        <div data-type = "list-content" style = {styles.frame as React.CSSProperties}>

            <Scroller 
                orientation = { dynamicorientationRef.current } 
                cache = { cache }
                gap = {gap}
                padding = {padding}
                cellHeight = {cellHeight}
                cellWidth = {cellWidth}
                runwaySize = {runway}
                estimatedListSize = {listsize}
                startingIndex = {offset}
                getItem = {getListItem}
                callbacks = {null}
                placeholder = {null}
                styles = { null }
                layout = { null }
                scrollerProperties = { scrollerProperties }
            />

        </div>

    </div>

}
