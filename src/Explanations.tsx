// copyright (c) 2022 Henrik Bechmann, Toronto

import React from 'react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import 'github-markdown-css'

import {
    Box,
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
    Heading,
} from '@chakra-ui/react'

const emitMarkdown = (markdown:string) => {

    return <Box className = 'markdown-body' fontSize = 'sm'>
        <ReactMarkdown children = {markdown} remarkPlugins = {[remarkGfm]} />
    </Box>

}

const overview_md = `
There are two reasons for this website:

- to provide a way to become familiar with the  features of *react-infinite-grid-scroller* (*RIGS*)
- to provide a test environment for various platforms. If you see any issues, please report them 
[here](https://github.com/HenrikBechmann/react-infinite-grid-scroller/issues)

There are several main ways to experiment with content sizing and configuration on a desktop device:

- try out the various content types offered in the options drawer
- change the size of the browser window
- zoom the browser window (Ctrl-minus or Ctrl-plus; Ctrl-zero for 100%). Zooming down to 33% is interesting

There are many options that can be set in the options drawer.

RIGS (and this demo site) works on any device that supports modern browsers.

See the *Documentation & Source Code* section for links to more information.
`

const content_md = `
`

const properties_md = `
`

const callbacks_md = `
`

const snapshots_md = `
`

const operations_md = `
`

const motivation_md = `
The motivation for RIGS was to have a scroller that supported all of:

- both "heavy" and "light" cell content
- both vertical and horizontal scrolling
- both uniform and variable cell sizes
- nested scrollers
- API support for sorting, filtering, and drag-n-drop

All this to support enhanced browser application experiences for users.
`

const documentation_md = `
For formal specs of the RIGS properties and API, see the [README file](https://github.com/HenrikBechmann/react-infinite-grid-scroller/blob/master/README.md).

For RIGS source code on Github, see [here](https://github.com/HenrikBechmann/react-infinite-grid-scroller/tree/master/src).
Start at InfiniteGridScroller.tsx.

For the source code for this demo site (rigs-demo) see [here](https://github.com/HenrikBechmann/rigs-demo/tree/master/src).
Start at App.tsx.

For the RIGS properties used to implement the content types of this demo, see the demodata.tsx file [here](https://github.com/HenrikBechmann/rigs-demo/blob/master/src/demodata.tsx)
`

const Explanations = (props:any) => {

    const overview = emitMarkdown(overview_md),
        content = emitMarkdown(content_md),
        properties = emitMarkdown(properties_md),
        callbacks = emitMarkdown(properties_md),
        snapshots = emitMarkdown(snapshots_md),
        operations = emitMarkdown(operations_md),
        motivation = emitMarkdown(motivation_md),
        documentation = emitMarkdown(documentation_md)

    return (

            <Accordion allowMultiple>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Overview
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {overview}
                </AccordionPanel>

            </AccordionItem>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            About the <i>Content Type</i> options
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {content}
                </AccordionPanel>

            </AccordionItem>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            About the <i>Properties</i> options
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {properties}
                </AccordionPanel>

            </AccordionItem>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            About the <i>Callbacks</i> options
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {callbacks}
                </AccordionPanel>

            </AccordionItem>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            About the <i>Service Function Snapshots</i> options
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {snapshots}
                </AccordionPanel>

            </AccordionItem>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            About the <i>Service Function Operations</i> options
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {operations}
                </AccordionPanel>

            </AccordionItem>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Motivation
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {motivation}
                </AccordionPanel>

            </AccordionItem>

            <AccordionItem>

                <Heading as ='h3'>
                    <AccordionButton bg = 'lightgray'>
                        <Box flex='1' textAlign='left'>
                            Documentation &amp; Source Code
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {documentation}
                </AccordionPanel>

            </AccordionItem>

        </Accordion>

    )

}

export default Explanations