import React from 'react';

import { ChakraProvider, Box, HStack, Grid, Heading, Button } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
    <Box height = '100vh'>
    <Grid height = '100%' autoFlow = 'row' autoRows = 'max-content 1fr'>
      <Box padding = {[1,1,2]}>
        <Heading fontSize = {[20,20,30]} mb = {[1,1,2]}>react-infinite-grid-scroller (RIGS) demo</Heading>
        <HStack align = 'start'>
          <Button size = {['sm','sm','md']}>Explanations</Button><Button size = {['sm','sm','md']}>Options</Button>
        </HStack>
      </Box>
      <Box margin = {[1,2,3]} border = '1px' >
      </Box>
      </Grid>
    </Box>
    </ChakraProvider>
  );
}

export default App;
