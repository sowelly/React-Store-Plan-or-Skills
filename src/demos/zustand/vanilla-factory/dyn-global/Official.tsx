import React, { useState } from 'react'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { createStore } from 'zustand/vanilla'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import CodeBlock from '@/components/CodeBlock'

type CounterState = { count: number }
type CounterActions = { increment: () => void }
type CounterStore = CounterState & CounterActions

const createCounterStore = () => (
  createStore<CounterStore>()((set, get) => ({
    count: 0,
    increment: () => set({ count: get().count + 1 }),
  }))
)

const defaultCounterStores = new Map<string, ReturnType<typeof createCounterStore>>()

const createCounterStoreFactory = (counterStores: typeof defaultCounterStores) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}

const getOrCreateCounterStoreByKey = createCounterStoreFactory(defaultCounterStores)

function Counter({ label, store }: { label: string; store: ReturnType<typeof createCounterStore> }) {
  useRenderTracker('VanillaFactory: DynGlobal Official ' + label)
  const count = useStoreWithEqualityFn(store, (s) => s.count, shallow)
  const inc = useStoreWithEqualityFn(store, (s) => s.increment, shallow)
  return (
    <Card size="small" title={label}>
      <RenderHighlight>
        <Space>
          <Typography.Text>count={count}</Typography.Text>
          <Button size="small" onClick={inc}>+1</Button>
        </Space>
      </RenderHighlight>
    </Card>
  )
}

export default function DynGlobalOfficial() {
  useRenderTracker('VanillaFactory: DynGlobal Official Tab')
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const currentStore = getOrCreateCounterStoreByKey(`tab-${currentTabIndex}`)
  const code = `import { useState } from 'react'
import { createStore } from 'zustand/vanilla'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

type CounterState = { count: number }
type CounterActions = { increment: () => void }
type CounterStore = CounterState & CounterActions

const createCounterStore = () => createStore<CounterStore>()((set, get) => ({
  count: 0,
  increment: () => set({ count: get().count + 1 }),
}))

const counterStores = new Map<string, ReturnType<typeof createCounterStore>>()

const getOrCreateCounterStoreByKey = (key: string) => {
  if (!counterStores.has(key)) counterStores.set(key, createCounterStore())
  return counterStores.get(key)!
}

export default function App() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const state = useStoreWithEqualityFn(
    getOrCreateCounterStoreByKey(\`tab-${'${'}currentTabIndex${'}'}\`),
    (s) => s,
    shallow,
  )
  return (
    <div>
      <button onClick={() => setCurrentTabIndex(0)}>Tab 1</button>
      <button onClick={() => setCurrentTabIndex(1)}>Tab 2</button>
      <button onClick={() => setCurrentTabIndex(2)}>Tab 3</button>
      <button onClick={state.increment}>Count: {state.count}</button>
    </div>
  )
}`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Space>
        <Button size="small" type={currentTabIndex === 0 ? 'primary' : 'default'} onClick={() => setCurrentTabIndex(0)}>Tab 1</Button>
        <Button size="small" type={currentTabIndex === 1 ? 'primary' : 'default'} onClick={() => setCurrentTabIndex(1)}>Tab 2</Button>
        <Button size="small" type={currentTabIndex === 2 ? 'primary' : 'default'} onClick={() => setCurrentTabIndex(2)}>Tab 3</Button>
      </Space>
      <Card size="small" title={`Tab #${currentTabIndex + 1} 的全局 store`}>
        <Row gutter={[12, 12]}>
          <Col span={12}><Counter label={`Counter A (Tab ${currentTabIndex + 1})`} store={currentStore} /></Col>
          <Col span={12}><Counter label={`Counter B (Tab ${currentTabIndex + 1})`} store={currentStore} /></Col>
        </Row>
      </Card>
      <CodeBlock code={code} />
      <Card size="small" title="说明">
        <Space direction="vertical">
          <Typography.Text>通过 Map 工厂方法按 key 惰性创建/复用 vanilla Zustand store。</Typography.Text>
          <Typography.Text>每个 Tab 使用独立的全局 store（key 为 tab-索引），切换 Tab 时计数不会丢失。</Typography.Text>
          <Typography.Text>组件使用 useStoreWithEqualityFn + shallow 精准订阅，避免不必要重渲染。</Typography.Text>
        </Space>
      </Card>
    </Space>
  )
}
