
/*

  TODO
  - stack input fields for small screens
  - investigate flash of scroller on resize or refresh
  - loading of simple components very slow in chakra - seems to be delayed
    - touching the scroller while waiting resolves the wait

*/

import React, {useState, useEffect, useRef} from 'react';

import { 
  ChakraProvider, 
  Box, HStack, Grid, Show,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, DrawerFooter,
  Heading, Image,
  useDisclosure, Button, Link,
} from '@chakra-ui/react'

import Explanations from './Explanations'
import Options from './Options'
import DemoScroller from './DemoScroller'

import { defaultProperties, callbackSettings, functionsRef } from './demodata'

function App() {

  const { isOpen:isOpenOptions, onOpen:onOpenOptions, onClose:onCloseOptions } = useDisclosure()
  const { isOpen:isOpenExplanations, onOpen:onOpenExplanations, onClose:onCloseExplanations } = useDisclosure()

  const optionsButtonRef = React.useRef(null)
  const explanationsButtonRef = React.useRef(null)

  // for modification by Options panel
  const displayPropertiesRef = useRef(defaultProperties)
  const contentTypeRef = useRef('simple')
  const callbackSettingsRef = useRef(callbackSettings)
  const functionPropertiesRef = useRef<any>({})
  const operatingFunctionRef = useRef<string>(null)

  // for application to Scroller
  const [applyProperties, setApplyProperties] = useState(displayPropertiesRef.current)
  const [applyType, setApplyType] = useState(contentTypeRef.current)

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
          <Button ref = {optionsButtonRef} size = {['sm','sm','md']} onClick = {onOpenOptions}>
            Options
          </Button>
          <Link href="https://www.npmjs.com/package/react-infinite-grid-scroller" rel="nofollow" isExternal>
            <Image src="https://img.shields.io/badge/npm-1.0.0--Beta--2-brightgreen"/>
          </Link>
        </HStack>
      </Box>
      <Box margin = {[1,2,3]} border = '1px' position = 'relative' >

        <DemoScroller contentType = {applyType} displayProperties = {applyProperties} />

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
            displayPropertiesRef = { displayPropertiesRef } 
            contentTypeRef = { contentTypeRef }
            callbackSettingsRef = { callbackSettingsRef }
            functionPropertiesRef = { functionPropertiesRef }
            operatingFunctionRef = { operatingFunctionRef }
            functionsRef = { functionsRef }
          />

        </DrawerBody>
        <DrawerFooter justifyContent = 'start' borderTop = '1px'>
          <HStack>
          <Button size = {['sm','sm','md']}>
            Apply
          </Button>
          <Button size = {['sm','sm','md']}>
            Cancel
          </Button>
          <Button size = {['sm','sm','md']}>
            Reset
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
