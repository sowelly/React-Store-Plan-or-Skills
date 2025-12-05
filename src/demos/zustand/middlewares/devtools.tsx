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
      inc: () => set({ count: get().count + 1 }, false, "setInc"),
      dec: () => set({ count: get().count - 1 }, false, "setDec"),
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
      inc: () => set({ count: get().count + 1 }, false, "setInc"),
    }),
    { name: 'devtools-demo' },
  ),
)`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title="DevTools 示例">
        <RenderHighlight>
          <Space>
            <Typography.Text>count={count}</Typography.Text>
            <Button onClick={() => inc()}>+1</Button>
            <Button onClick={() => dec()}>-1</Button>
            <Button onClick={() => reset()}>重置</Button>
          </Space>
        </RenderHighlight>
      </Card>
      <CodeBlock code={code} />
      <Card size="small" title="说明">
        <Typography.Paragraph>
          为 Store 指定 <Typography.Text code>name</Typography.Text>（如 <Typography.Text code>zustand-middlewares-devtools</Typography.Text>），用于在 Redux DevTools 的实例列表中清晰标识与区分多个 Store。
        </Typography.Paragraph>
        <Typography.Paragraph>
          在 <Typography.Text code>set(partial, replace?, actionName)</Typography.Text> 的第三个参数传入动作名（示例：<Typography.Text code>"setInc"</Typography.Text> / <Typography.Text code>"setDec"</Typography.Text>），该名称会出现在 DevTools 时间轴中，便于检索、审计与回放。
        </Typography.Paragraph>
        <Typography.Paragraph>
          通过 DevTools 可查看每次更新的快照与差异、执行时间旅行（跳转任意历史状态），并对动作流进行过滤与定位，提升调试效率。
        </Typography.Paragraph>
        <Typography.Paragraph>
          使用前请确保安装 Redux DevTools 浏览器扩展；若存在多个 Store，请为每个 Store 配置独立 <Typography.Text code>name</Typography.Text>，避免混淆。
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
