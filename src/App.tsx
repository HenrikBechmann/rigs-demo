
// copyright (c) 2022 Henrik Bechmann, Toronto, Licence: MIT

import React, {useState, useEffect, useRef} from 'react';

import { 

  ChakraProvider, 
  Box, HStack, Grid, Show,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter,
  Heading, Image, Text,
  useDisclosure, Button, Link,

} from '@chakra-ui/react'

import Explanations from './Explanations'
import Options from './Options'
import DemoScroller from './DemoScroller'

import { 

  defaultAllContentTypeProperties, 
  defaultCallbackSettings,
  defaultFunctionProperties,

  demoAllContentTypePropertiesRef,
  demoCallbackSettingsRef, 

  functionsObjectRef,

  GenericObject, // type

} from './demodata'


const contentTitles:GenericObject = {

  simple:"Simple uniform content",
  simplepromises:"Simple uniform promises",
  variable:"Variable content",
  variablepromises:"Variable promises",
  variabledynamic:"Variable dynamic",
  nested:"Nested uniform scrollers",
  nestedpromises:"Nested uniform scroller promises",

}

function App() {

  const [demoState, setDemoState] = useState('ready')

  // baseline
  const defaultContentType = 'simple'
  const defaultOperationFunction = ''
  // defaultAllContentTypeProperties imported above
  // defaultCallbackSettings imported above
  // defaultFunctionProperties imported above
  
  // assigned from demo versions for edit
  const sessionContentTypeRef = useRef<string>('')
  const sessionOperationFunctionRef = useRef<string>('')
  const sessionAllContentTypePropertiesRef = useRef<GenericObject>({})
  const sessionCallbackSettingsRef = useRef<GenericObject>({})
  const sessionFunctionPropertiesRef = useRef<GenericObject>({})

  // live demo control
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

  const showOptions = () => {
    sessionContentTypeRef.current = demoContentTypeRef.current
    sessionOperationFunctionRef.current = demoOperationFunctionRef.current
    sessionAllContentTypePropertiesRef.current = {...demoAllContentTypePropertiesRef.current}
    sessionCallbackSettingsRef.current = {...demoCallbackSettingsRef.current}
    sessionFunctionPropertiesRef.current = {...demoFunctionPropertiesRef.current}
    onOpenOptions()
  }

  const applyOptions = () => {
    demoContentTypeRef.current = sessionContentTypeRef.current
    demoOperationFunctionRef.current = sessionOperationFunctionRef.current
    demoAllContentTypePropertiesRef.current = {...sessionAllContentTypePropertiesRef.current}
    demoCallbackSettingsRef.current = {...sessionCallbackSettingsRef.current}
    demoFunctionPropertiesRef.current = {...sessionFunctionPropertiesRef.current}
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
            <Image src="https://img.shields.io/badge/npm-1.0.0--Beta--2-brightgreen"/>
          </Link>
        </HStack>

        <Text mt = {[1,1,2]} ml = {[1,1,2]} fontSize = {[9,9,14]}>
          <i>Content:</i> {contentTitles[demoContentTypeRef.current]}</Text>
          
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
          <Button size = {['sm','sm','md']}>
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

    </ChakraProvider>
  )
}

export default App;
