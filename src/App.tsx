
// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useEffect, useRef} from 'react';

import { 

  ChakraProvider, 
  Box, HStack, Grid, Show,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, 
  UnorderedList, ListItem,
  Heading, Image, Text, Code,
  useDisclosure, Button, Link, useToast,

} from '@chakra-ui/react'

import Explanations from './Explanations'
import Options from './Options'
import DemoScroller from './DemoScroller'

import { 

  defaultAllContentTypeProperties, 
  defaultCallbackSettings,

  demoAllContentTypePropertiesRef,
  demoCallbackSettingsRef, 

  functionsObjectRef,

  GenericObject, // type

} from './demodata'


const defaultFunctionProperties:GenericObject = {
  gotoIndex:'',
  listsize:'',
  insertFrom:'',
  insertRange:'',
  removeFrom:'',
  removeRange:'',
  moveFrom:'',
  moveRange:'',
  moveTo:'',
  remapDemo:'backwardsort',
}

const contentTitles:GenericObject = {

  simplecontent:"Simple uniform content",
  simplepromises:"Simple uniform promises",
  variablecontent:"Variable content",
  variablepromises:"Variable promises",
  variabledynamic:"Variable dynamic",
  variableoversized:"Variable oversized",
  nestedcontent:"Nested uniform scrollers",
  nestedpromises:"Nested uniform scroller promises",

}

const ErrorBox = (props:any) => {
  const { invalidSections, isOpen, onClose } = props
  if (!isOpen) return null
  const listitems:any[] = []
  let count = 0
  invalidSections.forEach((title:string)=>{
    listitems.push(<ListItem key = {count++}>{title}</ListItem>)
  })

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent fontSize = {[9,9,14]}>
          <ModalHeader >There are errors</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Please correct the errors in the following sections before proceeding.</Text>
            <UnorderedList ml = {4}>
              {listitems}
            </UnorderedList>
          </ModalBody >
          <ModalFooter>
            <Button onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function App() {

  const [demoState, setDemoState] = useState('ready')

  // baseline - static
  const defaultContentType = 'simplecontent'
  const defaultOperationFunction = ''
  // defaultAllContentTypeProperties imported above
  // defaultCallbackSettings imported above
  // defaultFunctionProperties defined above
  
  // assigned from demo versions for edit
  const sessionContentTypeRef = useRef<string>('')
  const sessionOperationFunctionRef = useRef<string>('')
  const sessionAllContentTypePropertiesRef = useRef<GenericObject>({})
  const sessionCallbackSettingsRef = useRef<GenericObject>({})
  const sessionFunctionPropertiesRef = useRef<GenericObject>({})

  // live demo control, initialized by baseline, updated by session data
  const demoContentTypeRef = useRef<string>(defaultContentType)
  const demoOperationFunctionRef = useRef(defaultOperationFunction)
  // demoAllContentTypePropertiesRef imported above
  // demoCallbackSettingsRef imported above
  const demoFunctionPropertiesRef = useRef<GenericObject>({...defaultFunctionProperties})

  // drawer management
  const { isOpen:isOpenOptions, onOpen:onOpenOptions, onClose:onCloseOptions } = useDisclosure()
  const { isOpen:isOpenExplanations, onOpen:onOpenExplanations, onClose:onCloseExplanations } = useDisclosure()

  const optionsButtonRef = useRef(null)
  const explanationsButtonRef = useRef(null)

  // error handling
  const functionsRef = useRef<GenericObject>({})
  const {isOpen:isOpenErrors, onOpen:onOpenErrors, onClose:onCloseErrors } = useDisclosure()

  const functionToast = useToast()

  // buttons
  const showOptions = () => {
    sessionContentTypeRef.current = demoContentTypeRef.current
    sessionOperationFunctionRef.current = demoOperationFunctionRef.current
    sessionAllContentTypePropertiesRef.current = {...demoAllContentTypePropertiesRef.current}
    sessionCallbackSettingsRef.current = {...demoCallbackSettingsRef.current}
    sessionFunctionPropertiesRef.current = {...demoFunctionPropertiesRef.current}
    onOpenOptions()
  }

  const invalidSectionsRef = useRef<any>(null)

  const applyOptions = () => {
    demoContentTypeRef.current = sessionContentTypeRef.current
    demoOperationFunctionRef.current = sessionOperationFunctionRef.current
    demoAllContentTypePropertiesRef.current = {...sessionAllContentTypePropertiesRef.current}
    demoCallbackSettingsRef.current = {...sessionCallbackSettingsRef.current}
    demoFunctionPropertiesRef.current = {...sessionFunctionPropertiesRef.current}

    invalidSectionsRef.current = functionsRef.current.invalidSections()
    if (invalidSectionsRef.current.size) {
      onOpenErrors()
    } else {
      onCloseOptions()
      if (demoOperationFunctionRef.current) {
        applyFunction()
      }
    }
  }

  const applyFunction = () => {
    functionToast({
      title: 'API called:',
      description: <div>{
        getFunctionToastContent( // runs the function as a side effect
          demoOperationFunctionRef.current, 
          demoFunctionPropertiesRef.current,
          functionsObjectRef.current)}
      </div>,
      status: 'success',
      isClosable: true,
    })
    demoOperationFunctionRef.current = ''
  }

  const resetOptions = () => {
    demoContentTypeRef.current = defaultContentType
    demoOperationFunctionRef.current = defaultOperationFunction
    demoAllContentTypePropertiesRef.current = {...defaultAllContentTypeProperties}
    demoCallbackSettingsRef.current = {...defaultCallbackSettings}
    demoFunctionPropertiesRef.current = {...defaultFunctionProperties}
    onCloseOptions()
  }

  useEffect(()=>{

    switch (demoState) {
      case 'openoptions': 
      case 'openexplanations':
      case 'apply': 
      case 'resetall': {
        setDemoState('ready')
        break
      }
    }

  },[demoState])

  return (
    <ChakraProvider>

    <Box height = '100vh'><Grid height = '100%' autoFlow = 'row' autoRows = 'max-content 1fr'>

      <Box padding = {[1,1,2]}>

        <Show above = 'sm'>
          <Heading fontSize = {[20,20,30]} mb = {[1,1,2]}>react-infinite-grid-scroller (RIGS) demo</Heading>
        </Show>
        <Show below = 'sm'>
          <Heading fontSize = {[20,20,30]} mb = {[1,1,2]}>RIGS scroller demo</Heading>
        </Show>

        <HStack align = 'center' justify = 'start'>
          <Button ref = {explanationsButtonRef} size = {['sm','sm','md']} onClick = {onOpenExplanations}>
            Explanations
          </Button>
          <Button ref = {optionsButtonRef} size = {['sm','sm','md']} onClick = {showOptions}>
            Options
          </Button>
          <Link href="https://www.npmjs.com/package/react-infinite-grid-scroller" rel="nofollow" isExternal>
            <Image src="https://img.shields.io/badge/npm-1.0.0--Beta--3-brightgreen"/>
          </Link>
        </HStack>

        <Text mt = {[1,1,2]} ml = {[1,1,2]} fontSize = {[9,9,14]}>
          <i>Content:</i> {contentTitles[demoContentTypeRef.current]},&nbsp; 
          {demoAllContentTypePropertiesRef.current[demoContentTypeRef.current].orientation}</Text>
          
      </Box>

      <Box margin = {[1,2,3]} border = '1px' position = 'relative' >

        <DemoScroller 
          demoContentType = {demoContentTypeRef.current} 
          demoAllContentTypeProperties = {demoAllContentTypePropertiesRef.current} />

      </Box>

    </Grid></Box>

    <Drawer
      isOpen={isOpenOptions}
      placement='right'
      size = 'sm'
      onClose={onCloseOptions}
      finalFocusRef={optionsButtonRef}
    >
      <DrawerOverlay />

      <DrawerContent>

        <DrawerCloseButton />

        <DrawerHeader borderBottom = '1px'>Scroller Options</DrawerHeader>

        <DrawerBody>

          <Options 

            // simple values
            sessionContentTypeRef = { sessionContentTypeRef }
            sessionOperationFunctionRef = { sessionOperationFunctionRef }

            // dynamic ref objects
            sessionAllContentTypePropertiesRef = { sessionAllContentTypePropertiesRef } 
            sessionCallbackSettingsRef = { sessionCallbackSettingsRef }
            sessionFunctionPropertiesRef = { sessionFunctionPropertiesRef }

            // static
            functionsObjectRef = { functionsObjectRef }
            functionsRef = { functionsRef }

          />

        </DrawerBody>

        <DrawerFooter justifyContent = 'start' borderTop = '1px'>

          <HStack>
          <Button size = {['sm','sm','md']} onClick = {applyOptions}>
            Apply
          </Button>
          <Button size = {['sm','sm','md']} onClick = {onCloseOptions}>
            Cancel
          </Button>
          <Button size = {['sm','sm','md']} onClick = {resetOptions}>
            Reset All
          </Button>
          </HStack>

        </DrawerFooter>

      </DrawerContent>

    </Drawer>

    <Drawer
      isOpen={isOpenExplanations}
      placement='left'
      size = 'md'
      onClose={onCloseExplanations}
      finalFocusRef={explanationsButtonRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Explanations</DrawerHeader>

        <DrawerBody>
          <Explanations />
        </DrawerBody>

      </DrawerContent>
    </Drawer>

    <ErrorBox 
      isOpen = {isOpenErrors} 
      invalidSections = {invalidSectionsRef.current}
      onClose = {onCloseErrors}
    />

    </ChakraProvider>
  )
}

export default App

// as side effect runs the requested function
const getFunctionToastContent = (
  functionindex:string, 
  functionProperties:GenericObject,
  functionsObject:GenericObject) => {

  let codeblock
  let seeconsole = false
  switch (functionindex) {
    case 'goto': {
      functionsObject.scrollToIndex(functionProperties.scrolltoIndex)
      codeblock = `functionsObject.scrollToIndex(${functionProperties.scrolltoIndex})`
      break
    }
    case 'listsize': {
      functionsObject.setListsize(functionProperties.listsize)
      codeblock = `functionsObject.setListsize(${functionProperties.listsize})`
      break
    }
    case 'reload': {
      functionsObject.reload()
      codeblock = `functionsObject.reload()`
      break
    }
    case 'insert': {
      const result = functionsObject.insertIndex(
        functionProperties.insertFrom, functionProperties.insertRange)
      console.log('[changeList, replaceList]',result)
      if (functionProperties.insertRange) {
        codeblock = `functionsObject.insertIndex(${functionProperties.insertFrom},${functionProperties.insertRange})`
      } else {
        codeblock = `functionsObject.insertIndex(${functionProperties.insertFrom})`
      }
      seeconsole = true
      break
    }
    case 'remove': {
      const result = functionsObject.removeIndex(
        functionProperties.removeFrom, functionProperties.removeRange)
      console.log('[changeList, replaceList]',result)
      if (functionProperties.removeRange) {
        codeblock = `functionsObject.removeIndex(${functionProperties.removeFrom},${functionProperties.removeRange})`
      } else {
        codeblock = `functionsObject.removeIndex(${functionProperties.removeFrom})`
      }
      seeconsole = true
      break
    }
    case 'move': {
      const result = functionsObject.moveIndex(
        functionProperties.moveTo, functionProperties.moveFrom, functionProperties.moveRange)
      if (functionProperties.moveRange) {
        codeblock = `functionsObject.moveIndex(${functionProperties.moveTo},${functionProperties.moveFrom},${functionProperties.moveRange})`
      } else {
        codeblock = `functionsObject.moveIndex(${functionProperties.moveTo},${functionProperties.moveFrom})`
      }
      console.log('processedIndexList', result)
      seeconsole = true
      break
    }
    case 'remap': {
      switch (functionProperties.remapDemo) {
        case 'backwardsort':{
          remapindex_backwardsort(functionsObject)
          break
        }
      }
      codeblock = `functionsObject.remapIndexes(changeMap)`
      seeconsole = true
      break
    }
    case 'clear':{
      functionsObject.clearCache()
      codeblock = `functionsObject.clearCache()`
      break
    }

  }

  return <>

    <Code>{codeblock}</Code>
    {seeconsole && <Text>See the browser console for feedback.</Text>}

  </>
}

const remapindex_backwardsort = (functionsObject:GenericObject) => {

  const cradleindexmap = functionsObject.getCradleIndexMap()
  if (!cradleindexmap) return

  const cradleindexarray:Array<number[]> = Array.from(cradleindexmap)
  cradleindexarray.sort((a:number[],b:number[]) => {
      const aval = a[0], bval = b[0]
      return aval - bval
  })

  const indexarray = cradleindexarray.map((item:number[]) => item[0])
  const cacheItemIDarray = cradleindexarray.map((item:number[]) => item[1])
  cacheItemIDarray.reverse()

  const changeMap = new Map()

  for (const i in indexarray) {
    changeMap.set(indexarray[i],cacheItemIDarray[i])
  }
  const returnarray = functionsObject.remapIndexes(changeMap)

  console.log(`remapIndexes:
[modifiedIndexesList,
remappedIndexesList,
deletedIndexesList,
orphanedItemsIDList,
orphanedIndexesList,
errorEntriesMap,
changeMap]`, 
  returnarray)

}
