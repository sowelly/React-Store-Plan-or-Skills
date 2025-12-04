import React, { useMemo, useState } from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { createCounterStore } from '../store'
import CodeBlock from '@/components/CodeBlock'

function Counter({ label }: { label: string }) {
  useRenderTracker('VanillaFactory: DynScoped Simple ' + label)
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

export default function DynScopedSimple() {
  useRenderTracker('VanillaFactory: DynScoped Simple Tab')
  const [ids, setIds] = useState<number[]>([1, 2])
  const nextId = useMemo(() => ids.reduce((m, x) => Math.max(m, x), 0) + 1, [ids])
  const addInstance = () => setIds((arr) => [...arr, nextId])
  const removeInstance = (id: number) => setIds((arr) => arr.filter((x) => x !== id))
  const code = `import { create } from 'zustand'
import { useMemo, useState } from 'react'

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
}

export default function View() {
  const [ids, setIds] = useState([1,2])
  return (
    <div>
      {ids.map(id => (
        <Counter key={id} />
      ))}
    </div>
  )
}`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Button size="small" type="primary" onClick={addInstance}>新增组件实例</Button>
      </Space>
      <Space direction="vertical" style={{ width: '100%' }}>
        {ids.map((id) => (
          <Card key={id} size="small" title={`Instance #${id}`} extra={<Button size="small" danger onClick={() => removeInstance(id)}>删除</Button>}>
            <Counter label={`Counter (${id})`} />
          </Card>
        ))}
      </Space>
      <CodeBlock code={code} />
      <Card size="small" title="说明">
        <Typography.Paragraph>
          动态作用域 store：按需渲染多个组件实例，每个实例内部拥有独立的 store，彼此互不干扰。可在运行时新增/删除实例，观察各自状态的独立性与生命周期行为。
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
