import React from 'react'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { createStore } from 'zustand/vanilla'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import CodeBlock from '@/components/CodeBlock'

type CounterState = { count: number }
type CounterActions = { increment: () => void; decrement: () => void; reset: () => void }
type CounterStore = CounterState & CounterActions

const store = createStore<CounterStore>()((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
  decrement: () => set({ count: get().count - 1 }),
  reset: () => set({ count: 0 }),
}))

function Counter({ label }: { label: string }) {
  useRenderTracker('VanillaFactory: Global Official ' + label)
  const count = useStoreWithEqualityFn(store, (s) => s.count, shallow)
  const inc = useStoreWithEqualityFn(store, (s) => s.increment, shallow)
  const dec = useStoreWithEqualityFn(store, (s) => s.decrement, shallow)
  const reset = useStoreWithEqualityFn(store, (s) => s.reset, shallow)
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

export default function GlobalOfficial() {
  useRenderTracker('VanillaFactory: Global Official Tab')
  const code = `import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

type CounterState = { count: number }
type CounterActions = { increment: () => void; decrement: () => void; reset: () => void }
type CounterStore = CounterState & CounterActions

const store = createStore<CounterStore>()((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
  decrement: () => set({ count: get().count - 1 }),
  reset: () => set({ count: 0 }),
}))

function Counter() {
  const count = useStoreWithEqualityFn(store, s => s.count, shallow)
  const inc = useStoreWithEqualityFn(store, s => s.increment, shallow)
  const dec = useStoreWithEqualityFn(store, s => s.decrement, shallow)
  const reset = useStoreWithEqualityFn(store, s => s.reset, shallow)
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
      <Card size="small" title="官方示例代码">
        <CodeBlock code={code} />
      </Card>
    </Space>
  )
}
