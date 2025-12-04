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
      <CodeBlock code={code} />
      <Card size="small" title="说明">
        <Typography.Paragraph>
          全局 store：多个组件共享同一 store 实例，任何一次更新会同步反馈到所有订阅者。下方 A/B 两个计数器通过同一个 store 读写 count，演示共享状态与 vanilla 读写方式；读取使用 store(selector)，调用动作使用 store.getState().action。
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
