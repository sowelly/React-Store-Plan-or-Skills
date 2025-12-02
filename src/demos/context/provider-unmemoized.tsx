import React, { createContext, useContext, useMemo, useState } from 'react'
import { Card, Space, Button, Typography, Row, Col } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'

type S = { value: number; setValue: (n: number) => void }
const UnmemoCtx = createContext<S | null>(null)
const MemoCtx = createContext<S | null>(null)

function UnmemoProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(0)
  const [tick, setTick] = useState(0)
  const api = { value, setValue }
  return (
    <UnmemoCtx.Provider value={api}>
      <RenderHighlight>
        <Space>
          <Button size="small" onClick={() => setTick(tick + 1)}>无关本地状态变更</Button>
          <Typography.Text type="secondary">tick={tick}</Typography.Text>
        </Space>
      </RenderHighlight>
      {children}
    </UnmemoCtx.Provider>
  )
}

function MemoProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(0)
  const [tick, setTick] = useState(0)
  const api = useMemo(() => ({ value, setValue }), [value])
  return (
    <MemoCtx.Provider value={api}>
      <RenderHighlight>
        <Space>
          <Button size="small" onClick={() => setTick(tick + 1)}>无关本地状态变更</Button>
          <Typography.Text type="secondary">tick={tick}</Typography.Text>
        </Space>
      </RenderHighlight>
      {children}
    </MemoCtx.Provider>
  )
}

function useUnmemo() {
  const ctx = useContext(UnmemoCtx)
  if (!ctx) throw new Error('useUnmemo must be used within UnmemoProvider')
  return ctx
}

function useMemoCtx() {
  const ctx = useContext(MemoCtx)
  if (!ctx) throw new Error('useMemoCtx must be used within MemoProvider')
  return ctx
}

function ConsumerUnmemo() {
  useRenderTracker('Context(Unmemoized): Consumer')
  const { value, setValue } = useUnmemo()
  return (
    <RenderHighlight>
      <Card size="small" title="未缓存 Provider 值">
        <Space>
          <Typography.Text>value={value}</Typography.Text>
          <Button size="small" onClick={() => setValue(value + 1)}>+1</Button>
        </Space>
      </Card>
    </RenderHighlight>
  )
}

function ConsumerMemo() {
  useRenderTracker('Context(Memoized): Consumer')
  const { value, setValue } = useMemoCtx()
  return (
    <RenderHighlight>
      <Card size="small" title="已缓存 Provider 值">
        <Space>
          <Typography.Text>value={value}</Typography.Text>
          <Button size="small" onClick={() => setValue(value + 1)}>+1</Button>
        </Space>
      </Card>
    </RenderHighlight>
  )
}

export default function ContextUnmemoizedProviderPage() {
  useRenderTracker('Context(Unmemoized): PageRoot')
  const code = `function UnmemoProvider(){\n  const [value, setValue] = useState(0)\n  const api = { value, setValue } // 每次 render 新引用\n  return <Ctx.Provider value={api}/>\n}\n\nfunction MemoProvider(){\n  const [value, setValue] = useState(0)\n  const api = useMemo(() => ({ value, setValue }), [value])\n  return <Ctx.Provider value={api}/>\n}`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Provider 值未缓存导致重渲染</Typography.Title>
      <Typography.Paragraph>
        未缓存的对象字面量每次渲染都会产生新引用，Context 的消费者因此全部重渲染。通过稳定引用减少不必要更新。
      </Typography.Paragraph>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <UnmemoProvider>
            <ConsumerUnmemo />
          </UnmemoProvider>
        </Col>
        <Col span={12}>
          <MemoProvider>
            <ConsumerMemo />
          </MemoProvider>
        </Col>
      </Row>
      <CodeBlock code={code} />
    </Space>
  )
}

