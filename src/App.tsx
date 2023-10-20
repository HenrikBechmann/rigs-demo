
// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useEffect, useRef, createContext} from 'react';

import { 

  ChakraProvider, 
  FormControl, Checkbox,
  Box, HStack, Grid, Show,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, 
  UnorderedList, ListItem,
  Heading, Image, Text, Code,
  Button, Link,
  useDisclosure, useToast,

} from '@chakra-ui/react'

import Explanations from './Explanations'
import Options from './Options'
import DemoScroller from './DemoScroller'

// default -> demo <-> session <-> edit

import { 

  defaultAllContentTypeProperties, 
  demoAllContentTypePropertiesRef,

  defaultCallbackFlags,
  demoCallbackFlagsRef, 

  functionsAPIRef,

  GenericObject, // type

} from './demodata'

export const DndEnabledContext = createContext(false)

const defaultAPIFunctionArguments:GenericObject = {
  gotoIndex:'',
  scrollToPixel:'',
  scrollByPixel:'',
  scrolltobehavior:'',
  scrollbybehavior:'',
  rangeAPIType:'rangeAPIvalues',
  listLowIndex:'',
  listHighIndex:'',
  prependCount:'',
  appendCount:'',
  insertFrom:'',
  insertRange:'',
  removeFrom:'',
  removeRange:'',
  moveTo:'',
  moveFrom:'',
  moveRange:'',
}

const contentTitles:GenericObject = {

  uniformcontent:"Uniform content",
  uniformpromises:"Uniform promises",
  uniformautoexpand:"Uniform auto expand",
  variablecontent:"Variable content",
  variablepromises:"Variable promises",
  variabledynamic:"Variable dynamic",
  variableoversized:"Variable oversized",
  variableautoexpand:"Variable autoexpand",
  nestingmixed:"Nested mixed scrollers",
  nestingmixedpromises:"Nested mixed scroller promises",
  nestingmixedautoexpand:"Nested mixed auto expand",
  nestinguniform:"Nested uniform scrollers",
  nestingvariable:"Nested variable scrollers",

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
  )

}

const mapAllPropertiesDemoToSession = (
  demoAllProperties:GenericObject, 
  sessionAllProperties:GenericObject
) => {

    const workingAllProperties = {...sessionAllProperties}

    for (const typeSelector in demoAllProperties) {

        const workingTypeProperties = {...demoAllProperties[typeSelector]}
        const startingListRange = workingTypeProperties.startingListRange
        if (startingListRange) {
            if (startingListRange.length == 0) {
                workingTypeProperties.rangePropertyType = 'emptyrangeproperty'
                workingTypeProperties.startingLowIndex = ''
                workingTypeProperties.startingHighIndex = ''
            } else {
                const [lowindex, highindex] = startingListRange
                workingTypeProperties.rangePropertyType = 'rangepropertyvalues'
                workingTypeProperties.startingLowIndex = lowindex + ''
                workingTypeProperties.startingHighIndex = highindex + ''
            }
        } else {
            workingTypeProperties.rangePropertyType = 'rangepropertyvalues'
            workingTypeProperties.startingLowIndex = ''
            workingTypeProperties.startingHighIndex = ''
        }

        delete workingTypeProperties.startingListRange

        const padding = workingTypeProperties.padding
        if (Array.isArray(padding)) {
            workingTypeProperties.padding = padding.join(',')
        }

        const gap = workingTypeProperties.pad
        if (Array.isArray(gap)) {
            workingTypeProperties.gap = gap.join(',')
        }

        workingAllProperties[typeSelector] = workingTypeProperties
 
    }

    Object.assign(sessionAllProperties, workingAllProperties)

    return sessionAllProperties

}

const mapAllPropertiesSessionToDemo = (
  sessionAllProperties:GenericObject, 
  demoAllProperties:GenericObject
) => {

    const workingAllProperties = {...demoAllProperties}

    for (const typeSelector in demoAllProperties) {

        const workingTypeProperties = {...sessionAllProperties[typeSelector]}

        const rangePropertyType = workingTypeProperties.rangePropertyType
        const {startingLowIndex, startingHighIndex} = workingTypeProperties
        if (rangePropertyType == 'rangepropertyvalues') {
            if (startingLowIndex && startingHighIndex) { // strings
                workingTypeProperties.startingListRange = [+startingLowIndex, +startingHighIndex]
            } else {
                workingTypeProperties.startingListRange = null
            }
        } else {
                workingTypeProperties.startingListRange = []
        }

        delete workingTypeProperties.rangePropertyType
        delete workingTypeProperties.startingLowIndex
        delete workingTypeProperties.startingHighIndex

        const padding = workingTypeProperties.padding
        if (padding) {
            const paddinglist = padding.toString().split(',')
            paddinglist.forEach((value:string, index:number, list:number[]) => {
                list[index] = +value
            })
            workingTypeProperties.padding = paddinglist
        }

        const gap = workingTypeProperties.gap
        if (gap) {
            const gaplist = gap.toString().split(',')
            gaplist.forEach((value:string, index:number, list:number[]) => {
                list[index] = +value
            })
            workingTypeProperties.gap = gaplist
        }

        workingAllProperties[typeSelector] = workingTypeProperties
 
    }

    Object.assign(demoAllProperties,workingAllProperties)

    return demoAllProperties

}

export const setDemoStatePack:GenericObject = {
    setDemoState:null
}

function App() {

  const 
      [demoState, setDemoState] = useState('setup'),

      dndInstalledRef = useRef(true),
      dndMasterEnabledRef = useRef(true),
      dndRootEnabledRef = useRef(true)

    const dndinstalled = (event:React.ChangeEvent) => {
        const target = event.target as HTMLInputElement
        const isChecked = target.checked
        dndInstalledRef.current = isChecked
        setDemoState('updatedndsettings')
    }
    const dndmasterenabled = (event:React.ChangeEvent) => {
        const target = event.target as HTMLInputElement
        const isChecked = target.checked
        dndMasterEnabledRef.current = isChecked
        setDemoState('updatedndsettings')
    }
    const dndrootenabled = (event:React.ChangeEvent) => {
        const target = event.target as HTMLInputElement
        const isChecked = target.checked
        dndRootEnabledRef.current = isChecked
        setDemoState('updatedndsettings')
    }

  useEffect(()=>{

      setDemoStatePack.setDemoState = setDemoState

  },[])

  // baseline - static
  const defaultContentTypeSelector = 'nestinguniform' // 'uniformcontent'
  const defaultOperationFunctionSelector = ''
  // defaultAllContentTypeProperties imported above
  // defaultCallbackFlags imported above
  // defaultAPIFunctionArguments defined above

  const indexRangeRef = useRef([])
  
  // assigned from demo versions for edit
  const 
      sessionContentTypeSelectorRef = useRef<string>(''),
      sessionOperationFunctionSelectorRef = useRef<string>(''),
      sessionAllContentTypePropertiesRef = useRef<GenericObject>({}),
      sessionCallbackFlagsRef = useRef<GenericObject>({}),
      sessionAPIFunctionArgumentsRef = useRef<GenericObject>({})

  // live demo control, initialized by baseline, updated by session data
  const 
      demoContentTypeSelectorRef = useRef<string>(defaultContentTypeSelector),
      demoOperationFunctionSelectorRef = useRef(defaultOperationFunctionSelector),
      // demoAllContentTypePropertiesRef imported above
      // demoCallbackFlagsRef imported above
      demoAPIFunctionArgumentsRef = useRef<GenericObject>({...defaultAPIFunctionArguments})

  // drawer management
  const 
      { isOpen:isOpenOptions, onOpen:onOpenOptions, onClose:onCloseOptions } = useDisclosure(),
      { isOpen:isOpenExplanations, onOpen:onOpenExplanations, onClose:onCloseExplanations } = useDisclosure()

  const optionsButtonRef = useRef(null)
  const explanationsButtonRef = useRef(null)

  // error handling
  const optionsAPIRef = useRef<GenericObject>({})
  const {isOpen:isOpenErrors, onOpen:onOpenErrors, onClose:onCloseErrors } = useDisclosure()

  const functionToast = useToast()

  const invalidSectionsRef = useRef<any>(null)

  // ---- buttons response
  const showOptions = () => {

    sessionContentTypeSelectorRef.current = demoContentTypeSelectorRef.current
    sessionOperationFunctionSelectorRef.current = demoOperationFunctionSelectorRef.current
    sessionAllContentTypePropertiesRef.current = 
      mapAllPropertiesDemoToSession(
        demoAllContentTypePropertiesRef.current,
        sessionAllContentTypePropertiesRef.current
     )
    sessionCallbackFlagsRef.current = {...demoCallbackFlagsRef.current}
    sessionAPIFunctionArgumentsRef.current = {...demoAPIFunctionArgumentsRef.current}

    onOpenOptions()

  }

  const applyOptions = () => {

    demoContentTypeSelectorRef.current = sessionContentTypeSelectorRef.current
    demoOperationFunctionSelectorRef.current = sessionOperationFunctionSelectorRef.current
    demoAllContentTypePropertiesRef.current = 
      mapAllPropertiesSessionToDemo(
        sessionAllContentTypePropertiesRef.current,
        demoAllContentTypePropertiesRef.current
      )
    demoCallbackFlagsRef.current = {...sessionCallbackFlagsRef.current}
    demoAPIFunctionArgumentsRef.current = {...sessionAPIFunctionArgumentsRef.current}

    invalidSectionsRef.current = optionsAPIRef.current.getInvalidSections()

    if (invalidSectionsRef.current.size) {

      onOpenErrors()

    } else {

      onCloseOptions()

      if (demoOperationFunctionSelectorRef.current) {
        applyFunction()
      }

    }

    setDemoState('apply')

  }

  const applyFunction = () => {

    functionToast({
      title: 'API called:',
      description: <div>{

        getFunctionToastContent( // runs the function as a side effect

          demoOperationFunctionSelectorRef.current, 
          demoAPIFunctionArgumentsRef.current,
          functionsAPIRef.current)

        }</div>,

      status: 'success',
      isClosable: true,
    })

    demoOperationFunctionSelectorRef.current = ''

  }

  const resetOptions = () => {

    demoContentTypeSelectorRef.current = defaultContentTypeSelector
    demoOperationFunctionSelectorRef.current = defaultOperationFunctionSelector
    demoAllContentTypePropertiesRef.current = {...defaultAllContentTypeProperties}
    demoCallbackFlagsRef.current = {...defaultCallbackFlags}
    demoAPIFunctionArgumentsRef.current = {...defaultAPIFunctionArguments}

    onCloseOptions()

    setDemoState('resetall')
    
  }

  useEffect(()=>{

    switch (demoState) {
      case 'setup':
      case 'apply': 
      case 'autoexpand':
      case 'resetall': {

        setTimeout(()=>{ // allow cycle for load scroller, get functions and indexRange

          if (functionsAPIRef.current.getPropertiesSnapshot) {
              const [props] = functionsAPIRef.current.getPropertiesSnapshot()
              indexRangeRef.current = props.virtualListProps.range
          }
          setDemoState('ready') 

        },100)
        break

      }

      case 'openoptions': 
      case 'updatedndsettings':
      case 'openexplanations':{

        setDemoState('ready')
        break

      }
    }

  },[demoState])
  // overscrollBehavior is set here to attempt to stop reload in mobile. not working
  return (
    <ChakraProvider>
    <DndEnabledContext.Provider value = {dndMasterEnabledRef.current}>
    <Box height = '100vh' style={{overscrollBehavior:'none'}}><Grid height = '100%' autoFlow = 'row' autoRows = 'max-content 1fr' style={{overscrollBehavior:'none'}}>

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
            <Image src="https://img.shields.io/badge/npm-2.0.0-brightgreen"/>
          </Link>
        </HStack>
        <Text mt = {[1,1,2]} ml = {[1,1,2]} fontSize = {[9,9,14]}>
          <i>Content:</i> {contentTitles[demoContentTypeSelectorRef.current]},&nbsp; 
          {demoAllContentTypePropertiesRef.current[demoContentTypeSelectorRef.current].orientation}, 
          range = [{indexRangeRef.current[0]},{indexRangeRef.current[1]}]
        </Text>
        <HStack align = 'center' justify = 'start'>
            <FormControl>
                <Text as = 'span' align = 'center' fontSize = {14} ml={1} ><i>Drag and drop: </i></Text>
                <Checkbox
                    isChecked = {dndInstalledRef.current} 
                    size = 'sm'
                    mt = {1}
                    onChange = {dndinstalled}
                >
                    installed | &nbsp;
                </Checkbox>
                { dndInstalledRef.current &&
                <><Checkbox
                    isChecked = {dndMasterEnabledRef.current} 
                    size = 'sm'
                    mt = {1}
                    onChange = {dndmasterenabled}
                >
                    sub-scrollers enabled | &nbsp;
                </Checkbox>
                <Checkbox
                    isChecked = {dndRootEnabledRef.current} 
                    size = 'sm'
                    mt = {1}
                    onChange = {dndrootenabled}
                >
                    root scroller enabled
                </Checkbox></>
                }
            </FormControl>
        </HStack>
      </Box>

      <Box margin = {[1,2,3]} border = '1px' position = 'relative' >

        <DemoScroller 
          demoContentTypeSelector = {demoContentTypeSelectorRef.current} 
          demoAllContentTypeProperties = {demoAllContentTypePropertiesRef.current} 
          dndinstalled = {dndInstalledRef.current}
          dndmasterenabled = {dndMasterEnabledRef.current}
          dndrootenabled = {dndRootEnabledRef.current}
        />

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
            sessionContentTypeSelectorRef = { sessionContentTypeSelectorRef }
            sessionOperationFunctionSelectorRef = { sessionOperationFunctionSelectorRef }

            // dynamic ref objects
            sessionAllContentTypePropertiesRef = { sessionAllContentTypePropertiesRef } 
            sessionCallbackFlagsRef = { sessionCallbackFlagsRef }
            sessionAPIFunctionArgumentsRef = { sessionAPIFunctionArgumentsRef }

            // functions
            functionsAPIRef = { functionsAPIRef }
            optionsAPIRef = { optionsAPIRef }

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
    </DndEnabledContext.Provider>
    </ChakraProvider>
  )
}

export default App

// as side effect runs the requested function
const getFunctionToastContent = (
  functionSelector:string, 
  APIFunctionArguments:GenericObject,
  functionsAPI:GenericObject) => {

  let codeblock
  let seeconsole = false
  switch (functionSelector) {
    case 'goto': {
      functionsAPI.scrollToIndex(APIFunctionArguments.scrolltoIndex)
      codeblock = `functionsAPI.scrollToIndex(${APIFunctionArguments.scrolltoIndex})`
      break
    }
    case 'gotopixel': {
      if (APIFunctionArguments.scrolltobehavior) {
          functionsAPI.scrollToPixel(APIFunctionArguments.scrollToPixel,APIFunctionArguments.scrolltobehavior)
          codeblock = `functionsAPI.scrollToPixel(${APIFunctionArguments.scrollToPixel},"${APIFunctionArguments.scrolltobehavior}")`
      } else {
          functionsAPI.scrollToPixel(APIFunctionArguments.scrollToPixel)
          codeblock = `functionsAPI.scrollToPixel(${APIFunctionArguments.scrollToPixel})`
      }
      break
    }
    case 'gobypixel': {
      if (APIFunctionArguments.scrollbybehavior) {
          functionsAPI.scrollByPixel(APIFunctionArguments.scrollByPixel,APIFunctionArguments.scrollbybehavior)
          codeblock = `functionsAPI.scrollByPixel(${APIFunctionArguments.scrollByPixel},"${APIFunctionArguments.scrollbybehavior}")`
      } else {
          functionsAPI.scrollByPixel(APIFunctionArguments.scrollByPixel)
          codeblock = `functionsAPI.scrollByPixel(${APIFunctionArguments.scrollByPixel})`
      }
      break
    }
    case 'listrange': {
      if (APIFunctionArguments.rangeAPIType == 'rangeAPIvalues') {
          functionsAPI.setListRange([APIFunctionArguments.listLowIndex, APIFunctionArguments.listHighIndex])
          codeblock = `functionsAPI.setListRange([${APIFunctionArguments.listLowIndex},${APIFunctionArguments.listHighIndex}])`
      } else {
          functionsAPI.setListRange([])
          codeblock = `functionsAPI.setListRange([])`
      }
      break
    }
    case 'prependCount': {
      functionsAPI.prependIndexCount(APIFunctionArguments.prependCount)
      codeblock = `functionsAPI.prependIndexCount(${APIFunctionArguments.prependCount})`
      break
    }
    case 'appendCount': {
      functionsAPI.appendIndexCount(APIFunctionArguments.appendCount)
      codeblock = `functionsAPI.appendIndexCount(${APIFunctionArguments.appendCount})`
      break
    }
    case 'reload': {
      functionsAPI.reload()
      codeblock = `functionsAPI.reload()`
      break
    }
    case 'insert': {
      const result = functionsAPI.insertIndex(
        APIFunctionArguments.insertFrom, APIFunctionArguments.insertRange)
      console.log('[changes = [changedList, replacedList, removedList, deletedList], context]',result)
      if (APIFunctionArguments.insertRange) {
        codeblock = `functionsAPI.insertIndex(${APIFunctionArguments.insertFrom},${APIFunctionArguments.insertRange})`
      } else {
        codeblock = `functionsAPI.insertIndex(${APIFunctionArguments.insertFrom})`
      }
      seeconsole = true
      break
    }
    case 'remove': {
      const result = functionsAPI.removeIndex(
        APIFunctionArguments.removeFrom, APIFunctionArguments.removeRange)
      console.log('[changes = [changedList, replacedList, removedList, deletedList],context]',result)
      if (APIFunctionArguments.removeRange) {
        codeblock = `functionsAPI.removeIndex(${APIFunctionArguments.removeFrom},${APIFunctionArguments.removeRange})`
      } else {
        codeblock = `functionsAPI.removeIndex(${APIFunctionArguments.removeFrom})`
      }
      seeconsole = true
      break
    }
    case 'move': {
      const result = functionsAPI.moveIndex(
        APIFunctionArguments.moveTo, APIFunctionArguments.moveFrom, APIFunctionArguments.moveRange)
      if (APIFunctionArguments.moveRange) {
        codeblock = `functionsAPI.moveIndex(${APIFunctionArguments.moveTo},${APIFunctionArguments.moveFrom},${APIFunctionArguments.moveRange})`
      } else {
        codeblock = `functionsAPI.moveIndex(${APIFunctionArguments.moveTo},${APIFunctionArguments.moveFrom})`
      }
      console.log('[processedIndexList, movedIndexList, displacedIndexList, context]', result)
      seeconsole = true
      break
    }
    case 'clear':{
      functionsAPI.clearCache()
      codeblock = `functionsAPI.clearCache()`
      break
    }

  }

  return <>

    <Code>{codeblock}</Code>
    {seeconsole && <Text>See the browser console for feedback.</Text>}

  </>
}

