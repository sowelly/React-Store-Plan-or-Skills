import React, { useMemo, useState } from 'react'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { createCounterStore } from '../store'
import CodeBlock from '@/components/CodeBlock'

function Counter({ label, store }: { label: string; store: ReturnType<typeof createCounterStore> }) {
  useRenderTracker('VanillaFactory: DynGlobal Simple ' + label)
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

export default function DynGlobalSimple() {
  useRenderTracker('VanillaFactory: DynGlobal Simple Tab')
  const [stores, setStores] = useState<Array<{ id: number; store: ReturnType<typeof createCounterStore> }>>(() => [
    { id: 1, store: createCounterStore() },
    { id: 2, store: createCounterStore() },
  ])
  const nextId = useMemo(() => stores.reduce((m, s) => Math.max(m, s.id), 0) + 1, [stores])
  const addStore = () => setStores((arr) => [...arr, { id: nextId, store: createCounterStore() }])
  const removeStore = (id: number) => setStores((arr) => arr.filter((s) => s.id !== id))
  const code = `import { create } from 'zustand'

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

function Counter({ store }) {
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
}

export default function View() {
  const stores = [createCounterStore(), createCounterStore()]
  return (
    <div>
      {stores.map((s, i) => <Counter key={i} store={s} />)}
    </div>
  )
}`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Button size="small" type="primary" onClick={addStore}>新增全局 store</Button>
      </Space>
      {stores.map(({ id, store }) => (
        <Card key={id} size="small" title={`Store #${id}`} extra={<Button size="small" danger onClick={() => removeStore(id)}>删除</Button>}>
          <Row gutter={[12, 12]}>
            <Col span={12}><Counter label={`Counter A (${id})`} store={store} /></Col>
            <Col span={12}><Counter label={`Counter B (${id})`} store={store} /></Col>
          </Row>
        </Card>
      ))}
      <Card size="small" title="简易示例代码">
        <CodeBlock code={code} />
      </Card>
    </Space>
  )
}
