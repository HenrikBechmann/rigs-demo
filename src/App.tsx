import React from 'react';

import { ChakraProvider, Box, VStack, Text, Heading } from '@chakra-ui/react'

// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <ChakraProvider>
      <Box padding = {[1,3]}>
        <Heading fontSize = {[20,20,30]} mb = {2}>react-infinite-grid-scroller (RIGS) demo site</Heading>
        <VStack align = 'start'>
          <Text>
            Open the right drawer for options. Open the left drawer for explanations. 
          </Text>
          <Text>
            On the desktop, change the browser size to change the viewport size.
          </Text>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App;
