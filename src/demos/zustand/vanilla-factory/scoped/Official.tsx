import React, { type ReactNode, useState, createContext, useContext } from 'react'
import { Card, Col, Row, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { createStore } from 'zustand/vanilla'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import CodeBlock from '@/components/CodeBlock'

type PositionStoreState = { position: { x: number; y: number } }
type PositionStoreActions = { setPosition: (nextPosition: PositionStoreState['position']) => void }
type PositionStore = PositionStoreState & PositionStoreActions

const createPositionStore = () => {
  return createStore<PositionStore>()((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }))
}

const PositionStoreContext = createContext<ReturnType<typeof createPositionStore> | null>(null)

function PositionStoreProvider({ children }: { children: ReactNode }) {
  useRenderTracker('VanillaFactory: Scoped Official PositionStoreProvider')
  const [positionStore] = useState(createPositionStore)
  return (
    <PositionStoreContext.Provider value={positionStore}>{children}</PositionStoreContext.Provider>
  )
}

function usePositionStore<U>(selector: (state: PositionStore) => U) {
  const store = useContext(PositionStoreContext)
  if (store === null) {
    throw new Error('usePositionStore must be used within PositionStoreProvider')
  }
  return useStoreWithEqualityFn(store, selector, shallow)
}

function MovingDot({ color }: { color: string }) {
  // useRenderTracker('VanillaFactory: Scoped Official MovingDot ' + color)
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)
  return (
    <div
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.min(Math.max(e.clientX - rect.left, 10), rect.width - 10)
        const y = Math.min(Math.max(e.clientY - rect.top, 10), rect.height - 10)
        setPosition({ x, y })
      }}
      style={{ position: 'relative', width: '100%', height: 240 }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: color,
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}

export default function ScopedOfficial() {
  useRenderTracker('VanillaFactory: Scoped Official Tab')
  const code = `import { type ReactNode, useState, createContext, useContext } from 'react'
import { createStore } from 'zustand'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'

type PositionStoreState = { position: { x: number; y: number } }

type PositionStoreActions = {
  setPosition: (nextPosition: PositionStoreState['position']) => void
}

type PositionStore = PositionStoreState & PositionStoreActions

const createPositionStore = () => {
  return createStore<PositionStore>()((set) => ({
    position: { x: 0, y: 0 },
    setPosition: (position) => set({ position }),
  }))
}

const PositionStoreContext = createContext<ReturnType<
  typeof createPositionStore
> | null>(null)

function PositionStoreProvider({ children }: { children: ReactNode }) {
  const [positionStore] = useState(createPositionStore)
  return (
    <PositionStoreContext.Provider value={positionStore}>
      {children}
    </PositionStoreContext.Provider>
  )
}

function usePositionStore<U>(selector: (state: PositionStore) => U) {
  const store = useContext(PositionStoreContext)
  if (store === null) {
    throw new Error(
      'usePositionStore must be used within PositionStoreProvider',
    )
  }
  return useStoreWithEqualityFn(store, selector, shallow)
}

function MovingDot({ color }: { color: string }) {
  const position = usePositionStore((state) => state.position)
  const setPosition = usePositionStore((state) => state.setPosition)
  return (
    <div
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = Math.min(Math.max(e.clientX - rect.left, 10), rect.width - 10)
        const y = Math.min(Math.max(e.clientY - rect.top, 10), rect.height - 10)
        setPosition({ x, y })
      }}
      style={{
        position: 'relative',
        width: '100%',
        height: 240,
      }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: color,
          borderRadius: '50%',
          transform: \`translate(\${position.x}px, \${position.y}px)\`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  )
}

export default function App() {
  return (
    <div style={{ display: 'flex' }}>
      <PositionStoreProvider>
        <MovingDot color="red" />
      </PositionStoreProvider>
      <PositionStoreProvider>
        <MovingDot color="blue" />
      </PositionStoreProvider>
    </div>
  )
}`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <PositionStoreProvider>
              <Card size="small" title="Red Dot（卡片内移动）">
                <RenderHighlight>
                  <MovingDot color="red" />
                </RenderHighlight>
              </Card>
          </PositionStoreProvider>
        </Col>
        <Col span={12}>
          <PositionStoreProvider>
              <Card size="small" title="Blue Dot（卡片内移动）">
                <RenderHighlight>
                  <MovingDot color="blue" />
                </RenderHighlight>
              </Card>
          </PositionStoreProvider>
        </Col>
      </Row>
      <CodeBlock code={code} />

      <Card size="small" title="说明">
        <Typography.Paragraph>
          本示例展示如何通过 React Context 为 zustand 的 vanilla store 提供作用域，实现两个相互独立的状态实例。每个
          <Typography.Text code>PositionStoreProvider</Typography.Text>
          都会创建并提供自己的 store，因此左右两边的彩色圆点互不影响。
        </Typography.Paragraph>
        <Typography.Paragraph>
          组件内部使用 <Typography.Text code>useStoreWithEqualityFn</Typography.Text> 搭配
          <Typography.Text code>shallow</Typography.Text> 进行选择器订阅和浅比较，减少不必要的重渲染；配合演示中的渲染标记可直观看到更新范围。
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
