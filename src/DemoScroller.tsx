// copyright (c) 2022 Henrik Bechmann, Toronto

import React, { useRef, useEffect, useState, CSSProperties } from 'react'
import { Grid, GridItem } from '@chakra-ui/react'
import {
    testUniformData, 
    testVariableData, 
    testNestingAccepts, 
    acceptAll, 
    GenericObject, 
    dragDropTransferCallback
} from './demodata'

import GridScroller, { RigsDnd as DndScroller } from 'react-infinite-grid-scroller'

const getDropEffect = (sourceScrollerID:number, targetScrollerID:number, context:GenericObject) => {

    let hostDropEffect

    // if (sourceScrollerID === targetScrollerID) {

    //     hostDropEffect = 'move'

    // } else {

    //     hostDropEffect = 'copy'

    // }

    // console.log('getDropEffect: context',context)

    return hostDropEffect

}

const testDataSource:GenericObject = {

  uniformcontent:testUniformData,
  uniformpromises:testUniformData,
  uniformautoexpand:testUniformData,
  variablecontent:testVariableData,
  variablepromises:testVariableData,
  variabledynamic:testVariableData,
  variableoversized:testVariableData,
  variableautoexpand:testVariableData,
  nestingmixed:testNestingAccepts,
  nestingmixedpromises:testNestingAccepts,
  nestingmixedautoexpand:testNestingAccepts,
  nestinguniform:testNestingAccepts,
  nestingvariable:testNestingAccepts,

}

const framestyle:CSSProperties = {position:'absolute',inset:0}

const StaticGridLayout = (props:any) => {

    const { dndinstalled, dndOptions, uniformprops, nestingprops } = props

    const uniformaccept = acceptAll(testDataSource.uniformcontent)
    const nestedaccept = ['uniform'] // acceptAll(testDataSource.nestinguniform)

    // console.log('uniformaccept, nestedaccept',uniformaccept, nestedaccept)

    const uniformDndOptions = {...dndOptions, accept:uniformaccept}
    const nestedDndOptions = {...dndOptions, accept:nestedaccept}

    // console.log('uniformDndOptions, nestedDndOptions',uniformDndOptions, nestedDndOptions)

    const dnduniformprops = {...uniformprops, profile:uniformDndOptions, dndOptions:uniformDndOptions}
    const dndnestingprops = {...nestingprops, profile:nestedDndOptions, dndOptions:nestedDndOptions}
    dndnestingprops.cellHeight = '250'

    // console.log('dnduniformprops, dndnestingprops',dnduniformprops, dndnestingprops)

    return dndinstalled 
        ? <Grid templateRows = '2fr 1fr' style = {framestyle}>
             <GridItem data-type = 'grid-item-top' >
             <div style = {{position:'relative',height:'100%', backgroundColor:'gray'}}>
                <DndScroller key = 'nestinguniform' {...dndnestingprops}/>
             </div>
             </GridItem>
             <GridItem data-type = 'grid-item-bottom' >
               <div style = {{position:'relative',height:'100%', borderTop:'1px', backgroundColor:'firebrick'}}>
                <DndScroller key = 'uniformcontent' {...dnduniformprops}/>
                </div>
             </GridItem>
          </Grid>

         : <Grid templateRows = '2fr 1fr' style = {framestyle}>
             <GridItem>
             <div style = {{position:'relative',height:'100%', backgroundColor:'gray'}}>
                 <GridScroller key = 'nestinguniform' {...nestingprops}/>
             </div>
             </GridItem>
             <GridItem>
               <div style = {{position:'relative',height:'100%', borderTop:'1px', backgroundColor:'firebrick'}}>
                 <GridScroller key = 'uniformcontent' {...uniformprops}/>
             </div>
             </GridItem>
           </Grid>
}

const StaticLayout = (props:any) => {

    const [scrollerState, setScrollerState] = useState('ready')

   const {
        demoAllContentTypeProperties, 
        // demoContentTypeSelector, 
        dndinstalled, 
        dndmasterenabled, 
        dndrootenabled,
        setDemoState,
    } = props

    const nestingprops = demoAllContentTypeProperties['nestinguniform']
    const uniformprops = demoAllContentTypeProperties['uniformcontent']

    const acceptRef = useRef('-x-none-x-')

    const dndOptionsRef = useRef<GenericObject>({
            accept:acceptRef.current,
            master:{enabled:dndmasterenabled},
            enabled:dndrootenabled,
            dropEffect:undefined // 'move' //'copy',
        })

    useEffect (()=>{

        dndOptionsRef.current = {
            accept:acceptRef.current,
            master:{enabled:dndmasterenabled},
            enabled:dndrootenabled,
            dropEffect:undefined // ,'copy'
        }

        setScrollerState('update')

    },[dndmasterenabled, dndrootenabled])

    useEffect(()=>{

        switch (scrollerState) {
            case 'update':{
                setScrollerState('ready')
                break
            }
        }

    },[scrollerState])

    return <StaticGridLayout 
        dndinstalled = {dndinstalled} 
        dndOptions = {dndOptionsRef.current} 
        uniformprops = { uniformprops }
        nestingprops = { nestingprops }
    />
}

const ScrollerController = (props:any) => {

    let component
    if (props.demoContentTypeSelector == 'staticlayout') {
        component = <StaticLayout {...props} />
    } else {
        component = <Scroller {...props} />
    }
    return component
}

export default ScrollerController

const Scroller = (
    {
        demoAllContentTypeProperties, 
        demoContentTypeSelector, 
        dndinstalled, 
        dndmasterenabled, 
        dndrootenabled,
        setDemoState,
    }:any) => {

    const [scrollerState, setScrollerState] = useState('ready')

    const respondToDndRangeChange = (
        sourceScrollerID:number, 
        sourceIndex:number, 
        targetScrollerID:number, 
        targetIndex:number, 
        context:GenericObject
    ) => {

        if (context.item.dropEffect == 'copy' || (sourceScrollerID !== targetScrollerID)) {
            setDemoState('revised')
        }

        dragDropTransferCallback(sourceScrollerID, sourceIndex, targetScrollerID, targetIndex, context)

    }

    const 
        testData = testDataSource[demoContentTypeSelector],

        demoContentTypeSelectorRef = useRef(demoContentTypeSelector),

        profileRef = useRef<GenericObject | null>(null),
        acceptRef = useRef<string[] | null>(null)

    if (demoContentTypeSelector != demoContentTypeSelectorRef.current || !acceptRef.current) {

        // choose accept list. All options are listed to be explicit
        let accept
        if (['uniformcontent','uniformpromises','uniformautoexpand','variablecontent','variablepromises',
            'variabledynamic','variableoversized','variableautoexpand'].includes(demoContentTypeSelector)) {

            accept = acceptAll(testData)
            acceptRef.current = accept

        } else if (['nestingmixed','nestingmixedpromises','nestingmixedautoexpand',
            'nestinguniform','nestingvariable'].includes(demoContentTypeSelector)) {

            if (['nestingmixed','nestingmixedpromises','nestingmixedautoexpand',].includes(demoContentTypeSelector)) {
                accept = testNestingAccepts.mixed
            } else if (demoContentTypeSelector == 'nestinguniform') {
                accept = testNestingAccepts.uniform
            } else if (demoContentTypeSelector == 'nestingvariable') {
                accept = testNestingAccepts.variable
            }
            acceptRef.current = accept

        }

        demoContentTypeSelectorRef.current = demoContentTypeSelector

        const profile = {
            accept:acceptRef.current,
        }

        profileRef.current = profile

    }

    const dndOptionsRef = useRef<GenericObject>({
            accept:acceptRef.current,
            master:{enabled:dndmasterenabled},
            enabled:dndrootenabled,
            dropEffect:undefined // 'move' //'copy',
        })

    useEffect (()=>{


        dndOptionsRef.current = {
            accept:acceptRef.current,
            master:{enabled:dndmasterenabled},
            enabled:dndrootenabled,
            dropEffect:undefined // ,'copy'
        }

        setScrollerState('update')

    },[dndmasterenabled, dndrootenabled, demoContentTypeSelector])

    useEffect(()=>{

        switch (scrollerState) {
            case 'update':{
                setScrollerState('ready')
                break
            }
        }

    },[scrollerState])

    const contentTypeProperties = { ...(demoAllContentTypeProperties[demoContentTypeSelector]) }

    const callbacks = contentTypeProperties.callbacks ?? {}

    callbacks.dragDropTransferCallback = respondToDndRangeChange

    contentTypeProperties.callbacks = callbacks

    if (dndinstalled) {

        const props = {
            ...contentTypeProperties,
            profile:profileRef.current, 
            dndOptions:dndOptionsRef.current,
            getDropEffect,
        }

        return <DndScroller key = {demoContentTypeSelector} {...props}/>

    } else { // dnd not installed

        // const props = {dndOptions:dndOptionsRef.current,...demoAllContentTypeProperties[demoContentTypeSelector]}
        const props = {
            ...contentTypeProperties,
            profile:profileRef.current, 
        }

        return <GridScroller key = {demoContentTypeSelector} {...props}/>        

    }

}
