import React, { createContext, useContext, useMemo, useState } from 'react'
import { Card, Space, Button, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'

type GlobalState = { value: number; setValue: (n: number) => void }
const GlobalCtx = createContext<GlobalState | null>(null)

function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(0)
  const api = useMemo(() => ({ value, setValue }), [value])
  return <GlobalCtx.Provider value={api}>{children}</GlobalCtx.Provider>
}

function useGlobal() {
  const ctx = useContext(GlobalCtx)
  if (!ctx) throw new Error('useGlobal must be used within GlobalProvider')
  return ctx
}

function ConsumerA() {
  useRenderTracker('Context(Global useState): ConsumerA')
  const { value, setValue } = useGlobal()
  return (
      <Card size="small" title="消费者 A">
        <RenderHighlight>
          <Space>
            <Typography.Text>value={value}</Typography.Text>
            <Button size="small" onClick={() => setValue(value + 1)}>+1</Button>
          </Space>
        </RenderHighlight>
      </Card>
  )
}

function ConsumerB() {
  useRenderTracker('Context(Global useState): ConsumerB')
  const { value } = useGlobal()
  return (
      <Card size="small" title="消费者 B">
        <RenderHighlight>
          <Typography.Text type="secondary">读取相同全局值（value={value}）</Typography.Text>
        </RenderHighlight>
      </Card>
  )
}

export default function ContextGlobalUseStatePage() {
  useRenderTracker('Context(Global useState): PageRoot')
  const code = `const GlobalCtx = createContext(null)\nfunction Provider(){\n  const [value, setValue] = useState(0)\n  const api = useMemo(() => ({ value, setValue }), [value])\n  return <GlobalCtx.Provider value={api}/>\n}`
  return (
    <GlobalProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Typography.Title level={4}>将 Context 当作全局 useState</Typography.Title>
        <Typography.Paragraph>
          多个消费者共享同一全局值，任一变更会导致所有消费者重渲染，需谨慎拆分作用域与语义。
        </Typography.Paragraph>
        <ConsumerA />
        <ConsumerB />
        <CodeBlock code={code} />
      </Space>
    </GlobalProvider>
  )
}
