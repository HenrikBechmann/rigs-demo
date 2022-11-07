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
        <ReactMarkdown children = {markdown} remarkPlugins = {[remarkGfm]}/>
    </Box>

}

const overview_md = `
There are two reasons for this website:

- to provide a way to become familiar with the  features of *react-infinite-grid-scroller* (*RIGS*)
- to provide a test environment for various platforms. If you see any issues, please report them 
[here](https://github.com/HenrikBechmann/react-infinite-grid-scroller/issues)

There are several main ways to experiment with content sizing and configuration on a desktop device:

- try out the various content types offered in the _Options_ drawer
- change the size of the browser window
- zoom the browser window (Ctrl-minus or Ctrl-plus; Ctrl-zero for reset to 100%). Zooming down to 33% is interesting

There are many options that can be set in the _Options_ drawer.

RIGS (and this demo site) works on any device that supports modern browsers.

See the *Documentation & Source Code* section for links to more information.
`

const key_design_ideas_md = `
There are several key design ideas which allow RIGS to display "heavy", and variable, 
components. The scroller:

- immediately displays a _placeholder_ for cell content, which allows the system to wait for the loading of the
permanent content
- uses \`requestIdleCallback\` to fetch components, which allows for balancing initial displays and loading latency
- splits the visible \`Cradle\` into two, whereby each half automatically "pushes" the cradle size in the right
direction on loading cells, with minimal visible disruption
- first loads all content into a cache (React \`portals\`) so that state is not lost when components are moved from
one part of the \`Cradle\` to another during scrolling
- provides for a _repositioning_ feature, such that if the \`Cradle\` is forced out of scope during scrolling, the 
scroller automatically reverts to _repositioning_ mode, in which it informs the user of the current location of the 
scroll in relation to the entire virtual list
- provides a memory _cache_, such that components can optionally be retained in memory (limited by the \`maxCache\` 
parameter) even when the content scrolls out of scope, to allow retention of the state of complex components.
`

const content_md = `
For this demonstration, there are three types of content, plus a few variations. The source code for 
the configurations of these content types can be viewed [here](https://github.com/HenrikBechmann/rigs-demo/blob/master/src/demodata.tsx).

The three basic content types of this demo site are: 
- simple uniform
- variable
- nested scrollers

The variations include \`promises\` of all three which are randomly delayed for loading, plus a _dynamic_ version of the
variable content type, in which every cell randomly, and continuously, loads new and different data. The scroller 
still scrolls in these circumstances.

The term _uniform_ is for the layout in which for vertical orientation, the cell height is fixed by the \`cellHeight\` 
parameter, and the cell width is allocated evenly to the available viewport width, guided by the \`cellWidth\` parameter. 
Similarly for horizontal orientation, the cell width is fixed by the \`cellWidth\` parameter, and the cell height is
allocated evenly guided by the \`cellHeight\` parameter. The allocations are managed by the \`grid\` _fractional_ (\`fr\`)
unit.

The term _variable_ is for the layout in which for vertical orientation, the cell height can vary between the 
\`cellMinHeight\` and \`cellHeight\` parameter values, and for horizontal orientation the cell width can
vary between the \`cellMinWidth\` and \`cellWidth\` parameter values.

Of course these content types are just samples. The main point of RIGS is to allow almost any kind of React Component 
content.
`

const properties_md = `
The RIGS demo properties available for edit in the _Options_ drawer include most of the 
basic properties of the scroller. For more advanced options, see the _Documentation &amp; Source Code_ section.

**Orientation** is the main property available. Note that RIGS maintains position in the virtual list when
orientation is pivoted from vertical to horizontal or back.

**cellHeight**, **cellWidth**, **minCellHeight**, and **minCellWidth** constrain the size and shape of the scroller
cells. See the descriptions of _uniform_ and _variable_ layouts in the _About the Content Type options_ section
for details on how these are applied.

**padding** defines the border width around the (visible) cradle. The **gap** property defines the gap between cells, 
both vertically and horizontally. Gaps do not apply at the beginning or end of rows or columns (controlled by 
padding instead). Adjusting the background colour using the \`styles\` object (see the bottom of this panel) colors 
the padding and gap spaces.

**Starting index** is applied only on initial mounting of a scroller, or in this demo whenever the content type is
changed. But see also the _Scroll To_ option in the _Service Function Operations options_ section.

**Estimated list size** is applied only on initial mounting of a scroller, or in this demo whenever the content 
type is changed. Subsequently the list size can be changed directly through the API (see the _Change virtual list 
size_ option in the _Service Function Operations options_ section), or when a \`getItem\` call returns a \`null\` 
(this becomes the new end-of-list), or when the list size is modified through the cache management API (again, see 
the _Service Function Operations options_ section).

The **Runway size** option sets the number of rows of cells that are instantiated _out of view_ at the start and 
the end of the cradle. This gives the cradle some leeway to load cells before they come into view.

**Cache settings** provide options for scroller caching. RIGS always keeps contents of the \`Cradle\` in the cache.
In addition, the _keepload_ option keeps components in the cache as they are loaded, and _preload_ attempts to 
load the entire virtual list into the cache. Both _keepload_ and _preload_ are constrained by \`cacheMax\`. Using
\`cacheMax\`, the caching algorithm tries to maintain an equal weight of caching before and after the \`Cradle\`.
Also note that _preload_ of nested scrollers partially loads the scroller components, but cannot load the contents 
until displayed by the \`Cradle\`. The reason is that components in cache but not displayed lose their \`width\`, 
\`height\`, \`scrollTop\`, and \`scrollLeft\` values. These values are needed by the Scroller for calculating 
configurations.

Note that the \`styles\` object provides options for adjusting non-structural styles of various components of the
scroller. These have not been surfaced to users in this demo (although some have been used for demonstration purposes). 
See the formal specification (linked in the _Documentation &amp; Source Code_ panel) for details.
`

const callbacks_md = `
Callbacks are functions provided by the host, and executed by RIGS to provide streaming feedback to the host. 

In this demo, activating callbacks in the _Options_ drawer streams feedback to the browser console. Applications
would typically use feedback to monitor and control advanced interactions with the user.

Callbacks are sent to RIGS through the \`callbacks\` parameter like this:
~~~
const callbacks = {
    functionsCallback, // obtain API functions
    referenceIndexCallback, // current index at the Cradle axis
    itemExceptionCallback, // information on failed getItem call
    changeListsizeCallback, // list size has changed
    deleteListCallback, // items have been deleted from the cache
    repositioningFlagCallback, // repositioning has started/ended
    repositioningIndexCallback, // current virtual repositioning index
    preloadIndexCallback, // current index being preloaded
}
~~~
See the formal documentation (linked in the _Documentation &amp; Source Code_ section) for details.

Callbacks should be written as closures something like this (example from this site's demodata module):
~~~
const changeListsizeCallback = (newlistsize:number) => {
    
    demoCallbackSettingsRef.current.changeListsizeCallback && 
        console.log('changeListsizeCallback: newlistsize', 
            newlistsize)

}
~~~
This example outputs feedback to the browser console if a flag has been set for the callback.

The special callback \`functionsCallback\`, which acquires API functions from RIGS, should be written something 
like this:
~~~
const functionsObjectRef = useRef(null)

const functionsCallback = (functions) => {

    functionsObjectRef.current = functions

}
~~~
An activation flag for the \`functionsCallback\` is not included in the _Options_ drawer (as it is used 
directly by the demo).
`

const snapshots_md = `
`

const operations_md = `
`

const performance_md = `
`

const motivation_md = `
The motivation for RIGS was to have a scroller that supports all of:

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
        key_design_ideas = emitMarkdown(key_design_ideas_md),
        content = emitMarkdown(content_md),
        properties = emitMarkdown(properties_md),
        callbacks = emitMarkdown(callbacks_md),
        snapshots = emitMarkdown(snapshots_md),
        operations = emitMarkdown(operations_md),
        performance = emitMarkdown(performance_md),
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
                            Key Design Ideas
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {key_design_ideas}
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
                            Performance Optimization
                        </Box>
                    <AccordionIcon />                        
                    </AccordionButton>
                </Heading>

                <AccordionPanel pb={4}>
                    {performance}
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