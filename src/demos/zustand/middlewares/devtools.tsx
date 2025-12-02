import React from 'react'
import { Card, Space, Typography, Button } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

type DevtoolsState = { count: number; inc: () => void; dec: () => void; reset: () => void }
const useDevtoolsStore = create<DevtoolsState>()(
  devtools(
    (set, get) => ({
      count: 0,
      inc: () => set({ count: get().count + 1 }),
      dec: () => set({ count: get().count - 1 }),
      reset: () => set({ count: 0 }),
    }),
    { name: 'zustand-middlewares-devtools' },
  ),
)

export default function DevtoolsTab() {
  useRenderTracker('Zustand(Middlewares): DevtoolsTab')
  const count = useDevtoolsStore((s) => s.count)
  const inc = useDevtoolsStore.getState().inc
  const dec = useDevtoolsStore.getState().dec
  const reset = useDevtoolsStore.getState().reset
  const code = `import { devtools } from 'zustand/middleware'
const useStore = create(
  devtools(
    (set, get) => ({
      count: 0,
      inc: () => set({ count: get().count + 1 }),
    }),
    { name: 'devtools-demo' },
  ),
)`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <RenderHighlight>
        <Card size="small" title="DevTools 示例">
          <Space>
            <Typography.Text>count={count}</Typography.Text>
            <Button onClick={() => inc()}>+1</Button>
            <Button onClick={() => dec()}>-1</Button>
            <Button onClick={() => reset()}>重置</Button>
          </Space>
        </Card>
      </RenderHighlight>
      <CodeBlock code={code} />
      <Card size="small" title="说明">
        <Typography.Paragraph>为 Store 命名以便在 Redux DevTools 面板中区分与时间旅行。</Typography.Paragraph>
      </Card>
    </Space>
  )
}

