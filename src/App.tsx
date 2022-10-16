import React from 'react';

import { ChakraProvider, Box, VStack, Grid, Text, Heading } from '@chakra-ui/react'

// import logo from './logo.svg';
// import './App.css';

function App() {
  return (
    <ChakraProvider>
    <Box height = '100vh'>
    <Grid height = '100%' autoFlow = 'row' autoRows = 'max-content 1fr'>
      <Box padding = {[1,2,3]}>
        <Heading fontSize = {[20,20,30]} mb = {[1,1,2]}>react-infinite-grid-scroller (RIGS) demo</Heading>
        <VStack align = 'start'>
          <Text>
            Open the right drawer for options. Open the left drawer for explanations. 
          </Text>
          <Text>
            On the desktop, change the browser size to change the viewport size.
          </Text>
        </VStack>
      </Box>
      <Box margin = {[1,2,3]}>
        Test
      </Box>
      </Grid>
    </Box>
    </ChakraProvider>
  );
}

export default App;
