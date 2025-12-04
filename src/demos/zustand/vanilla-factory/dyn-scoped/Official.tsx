import React, { type ReactNode, useState, useCallback, useContext, createContext } from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { useStore } from 'zustand'
import { createStore } from 'zustand/vanilla'

type CounterState = {
  count: number
}

type CounterActions = { increment: () => void }

type CounterStore = CounterState & CounterActions

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }))
    },
  }))
}

const createCounterStoreFactory = (
  counterStores: Map<string, ReturnType<typeof createCounterStore>>,
) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}

const CounterStoresContext = createContext<Map<
  string,
  ReturnType<typeof createCounterStore>
> | null>(null)

const CounterStoresProvider = ({ children }: { children: ReactNode }) => {
  const [stores] = useState(
    () => new Map<string, ReturnType<typeof createCounterStore>>(),
  )

  return (
    <CounterStoresContext.Provider value={stores}>
      {children}
    </CounterStoresContext.Provider>
  )
}

const useCounterStore = <U,>(
  key: string,
  selector: (state: CounterStore) => U,
) => {
  const stores = useContext(CounterStoresContext)

  if (stores === null) {
    throw new Error('useCounterStore must be used within CounterStoresProvider')
  }

  const getOrCreateCounterStoreByKey = useCallback(
    (key: string) => createCounterStoreFactory(stores!)(key),
    [stores],
  )

  return useStore(getOrCreateCounterStoreByKey(key), selector)
}

function Tabs() {
  useRenderTracker('VanillaFactory: DynScoped Official Tabs')
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const counterState = useCounterStore(
    `tab-${currentTabIndex}`,
    (state) => state,
  )
  const code = `import { 
  type ReactNode, 
  useState, 
  useCallback, 
  useContext, 
  createContext, 
} from 'react'
import { createStore, useStore } from 'zustand'

type CounterState = {
  count: number
}

type CounterActions = { increment: () => void }

type CounterStore = CounterState & CounterActions

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }))
    },
  }))
}

const createCounterStoreFactory = (
  counterStores: Map<string, ReturnType<typeof createCounterStore>>,
) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}

const CounterStoresContext = createContext<Map<
  string,
  ReturnType<typeof createCounterStore>
> | null>(null)

const CounterStoresProvider = ({ children }: { children: ReactNode }) => {
  const [stores] = useState(
    () => new Map<string, ReturnType<typeof createCounterStore>>(),
  )

  return (
    <CounterStoresContext.Provider value={stores}>
      {children}
    </CounterStoresContext.Provider>
  )
}

const useCounterStore = <U,>(
  key: string,
  selector: (state: CounterStore) => U,
) => {
  const stores = useContext(CounterStoresContext)

  if (stores === null) {
    throw new Error('useCounterStore must be used within CounterStoresProvider')
  }

  const getOrCreateCounterStoreByKey = useCallback(
    (key: string) => createCounterStoreFactory(stores!)(key),
    [stores],
  )

  return useStore(getOrCreateCounterStoreByKey(key), selector)
}

function Tabs() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const counterState = useCounterStore(
    \`tab-\${currentTabIndex}\`,
    (state) => state,
  )

  return (
    <div>
      <div>
        <button onClick={() => setCurrentTabIndex(0)}>Tab 1</button>
        <button onClick={() => setCurrentTabIndex(1)}>Tab 2</button>
        <button onClick={() => setCurrentTabIndex(2)}>Tab 3</button>
      </div>
      <div>
        Content of Tab {currentTabIndex + 1}
        <button onClick={() => counterState.increment()}>
          Count: {counterState.count}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <CounterStoresProvider>
      <Tabs />
    </CounterStoresProvider>
  )
}`

  return (
      <Card size="small" title={`Tabs (${currentTabIndex + 1})`}>
        <RenderHighlight>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Button size="small" onClick={() => setCurrentTabIndex(0)}>Tab 1</Button>
              <Button size="small" onClick={() => setCurrentTabIndex(1)}>Tab 2</Button>
              <Button size="small" onClick={() => setCurrentTabIndex(2)}>Tab 3</Button>
            </Space>
            <Space>
              <Typography.Text>Content of Tab {currentTabIndex + 1}</Typography.Text>
              <Button size="small" type="primary" onClick={() => counterState.increment()}>
                Count: {counterState.count}
              </Button>
            </Space>
          </Space>
        </RenderHighlight>
      </Card>
  )
}

export default function DynScopedOfficial() {
  useRenderTracker('VanillaFactory: DynScoped Official Tab')
  const code = `import { 
  type ReactNode, 
  useState, 
  useCallback, 
  useContext, 
  createContext, 
} from 'react'
import { createStore, useStore } from 'zustand'

type CounterState = {
  count: number
}

type CounterActions = { increment: () => void }

type CounterStore = CounterState & CounterActions

const createCounterStore = () => {
  return createStore<CounterStore>()((set) => ({
    count: 0,
    increment: () => {
      set((state) => ({ count: state.count + 1 }))
    },
  }))
}

const createCounterStoreFactory = (
  counterStores: Map<string, ReturnType<typeof createCounterStore>>,
) => {
  return (counterStoreKey: string) => {
    if (!counterStores.has(counterStoreKey)) {
      counterStores.set(counterStoreKey, createCounterStore())
    }
    return counterStores.get(counterStoreKey)!
  }
}

const CounterStoresContext = createContext<Map<
  string,
  ReturnType<typeof createCounterStore>
> | null>(null)

const CounterStoresProvider = ({ children }: { children: ReactNode }) => {
  const [stores] = useState(
    () => new Map<string, ReturnType<typeof createCounterStore>>(),
  )

  return (
    <CounterStoresContext.Provider value={stores}>
      {children}
    </CounterStoresContext.Provider>
  )
}

const useCounterStore = <U,>(
  key: string,
  selector: (state: CounterStore) => U,
) => {
  const stores = useContext(CounterStoresContext)

  if (stores === null) {
    throw new Error('useCounterStore must be used within CounterStoresProvider')
  }

  const getOrCreateCounterStoreByKey = useCallback(
    (key: string) => createCounterStoreFactory(stores!)(key),
    [stores],
  )

  return useStore(getOrCreateCounterStoreByKey(key), selector)
}

function Tabs() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0)
  const counterState = useCounterStore(
    \`tab-\${currentTabIndex}\`,
    (state) => state,
  )

  return (
    <div>
      <div>
        <button onClick={() => setCurrentTabIndex(0)}>Tab 1</button>
        <button onClick={() => setCurrentTabIndex(1)}>Tab 2</button>
        <button onClick={() => setCurrentTabIndex(2)}>Tab 3</button>
      </div>
      <div>
        Content of Tab {currentTabIndex + 1}
        <button onClick={() => counterState.increment()}>
          Count: {counterState.count}
        </button>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <CounterStoresProvider>
      <Tabs />
    </CounterStoresProvider>
  )
}`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <CounterStoresProvider>
        <Tabs />
      </CounterStoresProvider>
      <CodeBlock code={code} />

      <Card size="small" title="说明">
        <Typography.Paragraph>
          通过 <Typography.Text code>Map&lt;key, store&gt;</Typography.Text> 动态创建并复用 zustand vanilla store，实现“按作用域 key 隔离”的状态管理。每个 Tab 使用不同的 key（如 <Typography.Text code>tab-0</Typography.Text>、<Typography.Text code>tab-1</Typography.Text>），互不影响。
        </Typography.Paragraph>
        <Typography.Paragraph>
          自定义 <Typography.Text code>useCounterStore(key, selector)</Typography.Text> 封装：在 Context 中持有所有 store 的表，通过工厂函数在首次访问时创建并缓存，之后按 key 直接复用；组件侧用 <Typography.Text code>useStore(store, selector)</Typography.Text> 进行订阅。
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
