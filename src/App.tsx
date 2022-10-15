import React from 'react';

import { ChakraProvider, Box, Flex, Text, Heading } from '@chakra-ui/react'

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className = 'app'>
    <ChakraProvider>
    <Box padding = '3px'>
    <Heading>react-infinite-grid-scroller (RIGS) demo site</Heading>
    <Flex>
      <Box>
      <Text>
        Open the right drawer for options. Open the left drawer for explanations. 
      </Text>
      <Text>
        On the desktop, change the browser size to change the viewport size.
      </Text>
      </Box>
    </Flex>
    </Box>
    </ChakraProvider>
    </div>
  );
}

export default App;
