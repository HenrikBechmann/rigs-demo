import React from 'react';

import { ChakraProvider, Flex, Text } from '@chakra-ui/react'

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <ChakraProvider>
    <Flex padding = '3px'>
      <Text>Open the right drawer for options. Open the left drawer for explanations. 
      On desktop, change the browser size to change the viewport size.</Text>
    </Flex>
    </ChakraProvider>
  );
}

export default App;
