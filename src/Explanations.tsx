// copyright (c) 2022 Henrik Bechmann, Toronto

import React from 'react'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import 'github-markdown-css'

import {Box} from '@chakra-ui/react'

const emitMarkdown = (markdown:string) => {

    return <Box className = 'markdown-body' fontSize = 'sm'>
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

const Explanations = (props:any) => {

    const introduction_md = emitMarkdown(introduction)

    return introduction_md

}

export default Explanations