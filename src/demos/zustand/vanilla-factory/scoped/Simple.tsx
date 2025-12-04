import React, { useMemo } from 'react'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { createCounterStore } from '../store'
import CodeBlock from '@/components/CodeBlock'

function Counter({ label }: { label: string }) {
  useRenderTracker('VanillaFactory: Scoped Simple ' + label)
  const store = useMemo(() => createCounterStore(), [])
  const count = store((s) => s.count)
  const inc = store.getState().increment
  const dec = store.getState().decrement
  const reset = store.getState().reset
  return (
    <Card size="small" title={label}>
      <RenderHighlight>
        <Space>
          <Typography.Text>count={count}</Typography.Text>
          <Button size="small" onClick={inc}>+1</Button>
          <Button size="small" onClick={dec}>-1</Button>
          <Button size="small" onClick={reset}>重置</Button>
        </Space>
      </RenderHighlight>
    </Card>
  )
}

export default function ScopedSimple() {
  useRenderTracker('VanillaFactory: Scoped Simple Tab')
  const code = `import { create } from 'zustand'
import { useMemo } from 'react'

type CounterState = { count: number }
type CounterActions = { increment: () => void; decrement: () => void; reset: () => void }
type CounterStore = CounterState & CounterActions

const createCounterStore = () => (
  create<CounterStore>()((set, get) => ({
    count: 0,
    increment: () => set({ count: get().count + 1 }),
    decrement: () => set({ count: get().count - 1 }),
    reset: () => set({ count: 0 }),
  }))
)

function Counter() {
  const store = useMemo(() => createCounterStore(), [])
  const count = store(s => s.count)
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
      <CodeBlock code={code} />
      <Card size="small" title="说明">
        <Typography.Paragraph>
          作用域 store（非全局）：每个组件内部独立创建并持有一个 store 实例，彼此互不影响。下方 A/B 两个计数器各自维护独立的 count；组件卸载时对应状态随之释放。
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
