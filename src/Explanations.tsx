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
- zoom the browser window (Ctrl-minus or Ctrl-plus; Ctrl-zero for reset to 100%). Zooming down to 50% or 33% are interesting

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

The variations include \`promises\` of all three which are randomly delayed for loading. There is also
a _dynamic_ version of the variable content type, in which every cell randomly, and continuously, loads new and 
different data. Finally there is an _oversized_ variable version which explores the effect of having cells that can
extend beyond the boundaries of the viewport. The scroller still scrolls in all of these circumstances.

Each of the content type items shows the virtual list (zero based) \`index\` number, and the transient scroller cache
\`itemID\` number. You'll notice that with caching limited to the scope of the \`Cradle\` (the default 'cradle' 
caching including the visible cells plus the 'runway' cells), the \`itemID\` changes when the cells leave and return to 
the \`Cradle\` scope. If the caching is set to 'keepload' or 'preload' on the other hand, the itemID will not change 
(unless the cells move outside the scope defined by \`cacheMax\`).

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

**Starting list size** is applied only on initial mounting of a scroller, or in this demo whenever the content 
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

**Show axis** when checked shows a red line where the \`Cradle\` axis is. This is for debug and instruction purposes
only. There is a CSS grid on either side of the axis. As the user scrolls, the \`Cradle\` moves cells from one side of 
the axis to the other to maintain the relative position of the axis, and to maintain the illusion of a continuous stream 
of cells. As well as moving cells, the \`Cradle\` adds and removes cells from the ends of the \`Cradle\` to maintain 
a constant number of instantiated cells in the \`Cradle\`. The axis allows changes of grid content to 'push' the length of
the cradle away from the axis to maintain stable positioning for the user.

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
Snapshots provide support for advanced interactions with the RIGS cache. As the name suggests,
they provide snapshots of the contents of the cache (containing both the visible and invisible content) and the 
\`Cradle\` (containing the visible user content). 

Keep in mind that RIGS maintains a sparse memory cache in which there
is no guarantee of entries being contiguous. The \`Cradle\` on the other hand is guaranteed to hold contiguous
entries by index position in the virtual list.

The \`index\` is the position in the virtual list of the scroller (a virtual zero-based array).

The \`itemID\` is a unique session ID of the user component, assigned by RIGS for the time the component is in the cache,
regardless of its position in the virtual list (the position in the virtual list could change with use of the API functions).
The \`itemID\` is retired when the component is released from the cache. If the same component returns to the cache, then
a new \`itemID\` is assigned.

\`getCacheIndexMap()\` returns a javascript \`Map\` of the current contents of the cache, in which \`key\` = the item's 
\`index\` in the virtual list and \`value\` = the \`itemID\` of the user component.

\`getCacheItemMap()\` returns a javascript \`Map\` of the current contents of the cache, in which \`key\` = the \`itemID\`
of the current item, and \`value\` is an object containing the properties \`index\` (the index of the item), and
\`component\` (the user component itself).

The javascript \`Maps\` returned by \`getCacheIndexMap()\` and \`getCacheItemMap()\` can thus be correlated.

\`getCradleIndexMap()\` returns a javascript \`Map\` of the current contents of the \`Cradle\`, in which \`key\` = the item's 
\`index\` in the virtual list and \`value\` = the \`itemID\` of the user component. The \`Map\` returned by
\`getCradleIndexMap()\` is thus a subset of the Map retured by \`getCacheIndexMap()\`.

For the purposes of this demo, these snapshots are returned to the browser console.

The data returned by the snapshots can be used in conjunction with the RIGS API cache operations functions (see the 
_About the Service Function Operations options_ section).

Snapshot functions are acquired by including a \`functionsCallback\` function in the RIGS \`callbacks\` property. See
the _About the Callbacks options_ section for more details.
`

const operations_md = `
Operations functions are acquired by including a \`functionsCallback\` function in the RIGS \`callbacks\` property. See
the _About the Callbacks options_ section for more details.

\`scrollToIndex(...)\` allows the host to change the contents of the visible \`Cradle\`, by changing the ReferenceIndex 
of the \`Cradle\` to the specified index.

The \`setListsize(...)\` function allows the host to modify the size of the virtual list. If any cache or \`Cradle\` 
items become out of scope as a result of this change they are removed from the cache, and the \`Cradle\` is moved as
appropriate. The size of the virtual list is initially set with the \`startingListSize\` property. The size of the list
can also be truncated by returning \`null\` from a \`getItem\` call. This will cause the list to be truncated to the 
index value of the \`getItem\` call. Finally, the list size may be changed as a side effect of cache management calls 
listed below.

The following cache operation functions are provided for advanced interaction with the RIGS cache.

\`insertIndex(...)\`, \`removeIndex(...)\`, \`moveIndex(...)\`, and \`remapIndexes(...)\` allow for direct manipulation
of the cache to support sorting, filtering, and drag-n-drop. They each return data for feedback and control. They can 
each operate on one or more indexes. \`Cradle\` content is synchronzed with these cache changes as appropriate. 

Two test procedures are provided for the \`remapIndexes(...)\` option. The "Backward" test literally reverses the order of 
the items in the cradle. The "Replace items" test replaces the 2nd and 6th items, and swaps the 1st and 5th items.

These cache operation functions can each be tested in this demo, with the feedback returned to the browser console. 
See the formal documentation linked in the _Documentation &amp; Source Code_ section for details.

\`reload()\` clears and reloads the cache (and therefore the \`Cradle\`), and \`clearCache()\` simply clears the 
cache. Neither return any feedback.
`

const performance_md = `
There are several tools available to optimize the performance of RIGS:
- the design and "weight" of the components added to the scroller cells, as returned by \`getItem(...)\`
- preloading components in your application before returning them to RIGS
- the number of cells displayed in the viewport can make a big difference; the fewer, the faster
- the \`runwaySize\` property can influence both the appearance and performance of the scroller
- the \`cache\` strategy employed ("cradle", "keepload", or "preload") can effect the timing and latency of loads and
reloads; the \`cacheMax\` size canc be set to constrain the cache to protect device memory
- the \`IDLECALLBACK_TIMEOUT\` value can be set through the \`technical\` property, to modify the timeout of the
\`requestIdleCallback\` function employed by the \`CellFrame\` component. A higher value allows more time for initial
loading and painting, but can lead to longer latency periods.
- changing the \`CACHE_PARTITION_SIZE\` value (number of portals per partition) may have a marginal effect.
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

const Explainer = ({explanation, children:title}:{explanation:JSX.Element, children:(string | JSX.Element)[]|string}) => {

     return <AccordionItem>

        <Heading as ='h3'>
            <AccordionButton bg = 'lightgray'>
                <Box flex='1' textAlign='left'>
                    {title}
                </Box>
            <AccordionIcon />                        
            </AccordionButton>
        </Heading>

        <AccordionPanel pb={4}>
            {explanation}
        </AccordionPanel>

    </AccordionItem>

}

const Explanations = () => {

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

        <Explainer explanation = {overview}>
            Overview
        </Explainer>

        <Explainer explanation = {key_design_ideas}>
            Key Design Ideas
        </Explainer>

        <Explainer explanation = {content}>
            About the <i>Content Type</i> options
        </Explainer>

        <Explainer explanation = {properties}>
            About the <i>Properties</i> options
        </Explainer>

        <Explainer explanation = {callbacks}>
            About the <i>Callbacks</i> options
        </Explainer>

        <Explainer explanation = {snapshots}>
            About the <i>Service Function Snapshots</i> options
        </Explainer>

        <Explainer explanation = {operations}>
            About the <i>Service Function Operations</i> options
        </Explainer>

        <Explainer explanation = {performance}>
            Performance Optimization
        </Explainer>

        <Explainer explanation = {motivation}>
            Motivation
        </Explainer>

        <Explainer explanation = {documentation}>
            Documentation &amp; Source Code
        </Explainer>

    </Accordion>)

}

export default Explanations