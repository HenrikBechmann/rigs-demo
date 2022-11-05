// copyright (c) 2022 Henrik Bechmann, Toronto

import React from 'react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import 'github-markdown-css'

import {Box} from '@chakra-ui/react'

const emitMarkdown = (markdown:string, key:string) => {

    return <Box key = {key} className = 'markdown-body' fontSize = 'sm'>
        <ReactMarkdown children = {markdown} remarkPlugins = {[remarkGfm]} />
    </Box>

}

const introduction = `
There are two reasons for this website:

- to provide a way to become familiar with the  features of *react-infinite-grid-scroller* (*RIGS*)
- to provide a test environment for various platforms. If you see any issues, please report them 
[here](https://github.com/HenrikBechmann/react-infinite-grid-scroller/issues)

There are two ways to experiment with content sizing and configuration on a desktop device:

- change the size of the browser window
- zoom the browser window (Ctrl-minus or Ctrl-plus). Zooming down to 33% is interesting
`

const endnote = `
For formal specs of the RIGS properties and API, see the [README file](https://github.com/HenrikBechmann/react-infinite-grid-scroller/blob/master/README.md).

For RIGS source code on Github, see [here](https://github.com/HenrikBechmann/react-infinite-grid-scroller/tree/master/src).
Start with InfiniteGridScroller.tsx.

For the source code for this demo site (rigs-demo) see [here](https://github.com/HenrikBechmann/rigs-demo/tree/master/src).
Start with App.tsx.
`

const Explanations = (props:any) => {

    const introduction_md = emitMarkdown(introduction,'introduction')

    const endnote_md = emitMarkdown(endnote, 'endnote')

    return <> {[introduction_md,endnote_md]} </>

}

export default Explanations