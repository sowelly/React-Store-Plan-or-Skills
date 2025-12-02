import React from 'react'
import { Card, Space, Typography } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { atom, useAtom } from 'jotai'

const countAtom = atom(0)

export default function JotaiBasicPage() {
  useRenderTracker('Jotai: BasicPage')
  const [count, setCount] = useAtom(countAtom)

  const code = `import { atom, useAtom } from 'jotai'

const countAtom = atom(0)

function Page() {
  const [count, setCount] = useAtom(countAtom)
  return (
    <div>
      <span>count={count}</span>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(c => c - 1)}>-1</button>
    </div>
  )
}`

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Jotai 的基础使用</Typography.Title>
      <Typography.Paragraph>
        Jotai 以原子（Atom）为最小状态单元，通过 <Typography.Text code>useAtom</Typography.Text> 在组件中读取与更新。它天然支持按需订阅：组件仅在所订阅的 Atom 变化时渲染。
      </Typography.Paragraph>
      <RenderHighlight>
        <Card size="small" title="计数">
          <Space>
            <Typography.Text>count={count}</Typography.Text>
            <Typography.Link onClick={() => setCount(c => c + 1)}>+1</Typography.Link>
            <Typography.Link onClick={() => setCount(c => c - 1)}>-1</Typography.Link>
          </Space>
        </Card>
      </RenderHighlight>
      <Card size="small" title="说明">
        <Typography.Paragraph>原子即状态源；组件通过 useAtom 读写原子，无需全局 Provider。</Typography.Paragraph>
      </Card>
      <CodeBlock code={code} />
    </Space>
  )
}

