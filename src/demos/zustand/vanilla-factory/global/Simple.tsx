import React from 'react'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { createCounterStore } from '../store'
import CodeBlock from '@/components/CodeBlock'

const store = createCounterStore()

function Counter({ label }: { label: string }) {
  useRenderTracker('VanillaFactory: Global Simple ' + label)
  const count = store((s) => s.count)
  const inc = store.getState().increment
  const dec = store.getState().decrement
  const reset = store.getState().reset
  return (
    <RenderHighlight>
      <Card size="small" title={label}>
        <Space>
          <Typography.Text>count={count}</Typography.Text>
          <Button size="small" onClick={inc}>+1</Button>
          <Button size="small" onClick={dec}>-1</Button>
          <Button size="small" onClick={reset}>重置</Button>
        </Space>
      </Card>
    </RenderHighlight>
  )
}

export default function GlobalSimple() {
  useRenderTracker('VanillaFactory: Global Simple Tab')
  const code = `import { create } from 'zustand'

type CounterState = { count: number }
type CounterActions = { increment: () => void; decrement: () => void; reset: () => void }
type CounterStore = CounterState & CounterActions

const store = create<CounterStore>()((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
  decrement: () => set({ count: get().count - 1 }),
  reset: () => set({ count: 0 }),
}))

function Counter() {
  const count = store((s) => s.count)
  const inc = store.getState().increment
  const dec = store.getState().decrement
  const reset = store.getState().reset
  return (
    <div>
      <span>count={count}</span>
      <button onClick={inc}>+1</button>
      <button onClick={dec}>-1</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Row gutter={[12, 12]}>
        <Col span={12}><Counter label="Counter A" /></Col>
        <Col span={12}><Counter label="Counter B" /></Col>
      </Row>
      <Card size="small" title="简易示例代码">
        <CodeBlock code={code} />
      </Card>
    </Space>
  )
}
