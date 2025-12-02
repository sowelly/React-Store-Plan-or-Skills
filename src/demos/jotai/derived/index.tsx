import React from 'react'
import { Card, Space, Typography } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { atom, useAtom, useAtomValue } from 'jotai'

const countAtom = atom(1)
const doubleAtom = atom((get) => get(countAtom) * 2)
const labelAtom = atom((get) => `count=${get(countAtom)}, double=${get(doubleAtom)}`)

export default function JotaiDerivedPage() {
  useRenderTracker('Jotai: DerivedPage')
  const [count, setCount] = useAtom(countAtom)
  const double = useAtomValue(doubleAtom)
  const label = useAtomValue(labelAtom)

  const code = `import { atom, useAtom, useAtomValue } from 'jotai'

const countAtom = atom(1)
const doubleAtom = atom((get) => get(countAtom) * 2)
const labelAtom = atom((get) => 'count=' + get(countAtom) + ', double=' + get(doubleAtom))

function Page() {
  const [count, setCount] = useAtom(countAtom)
  const double = useAtomValue(doubleAtom)
  const label = useAtomValue(labelAtom)
  return (
    <div>
      <span>{label}</span>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(c => c - 1)}>-1</button>
      <span>double={double}</span>
    </div>
  )
}`

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>派生 Atom（计算状态）</Typography.Title>
      <Typography.Paragraph>
        派生 Atom 用于从基础 Atom 计算得到新状态，组件只在其依赖的基础 Atom 改变时更新，避免无关渲染。
      </Typography.Paragraph>
      <RenderHighlight>
        <Card size="small" title="计算值">
          <Space wrap>
            <Typography.Text>{label}</Typography.Text>
            <Typography.Text>double={double}</Typography.Text>
            <Typography.Link onClick={() => setCount(c => c + 1)}>+1</Typography.Link>
            <Typography.Link onClick={() => setCount(c => c - 1)}>-1</Typography.Link>
          </Space>
        </Card>
      </RenderHighlight>
      <Card size="small" title="说明">
        <Typography.Paragraph>在 Jotai 中，派生 Atom 通过 get 组合其它 Atom 的值，实现可组合的计算状态。</Typography.Paragraph>
      </Card>
      <CodeBlock code={code} />
    </Space>
  )
}
