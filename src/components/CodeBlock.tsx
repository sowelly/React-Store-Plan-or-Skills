import React from 'react'
import { Card } from 'antd'
import { useRenderTracker } from '@/utils/renderLog'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import oneLight from 'react-syntax-highlighter/dist/esm/styles/prism/one-light'

type Props = {
  code: string
  title?: string
  language?: string
  height?: string
}

export default function CodeBlock({ code, title = '代码示例', language = 'tsx', height = '50vh' }: Props) {
  useRenderTracker('Shared: CodeBlock')
  return (
    <Card size="small" title={title} styles={{ body: { maxHeight: height, overflow: 'auto', padding: 12 } }}>
      <div className="thin-scrollbar">
        <SyntaxHighlighter language={language} style={oneLight} wrapLongLines showLineNumbers>
          {code}
        </SyntaxHighlighter>
      </div>
    </Card>
  )
}
