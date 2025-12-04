import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Card, Space, Button, Typography, Row, Col } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'

type CtxState = { count: number; setCount: (n: number | ((n: number) => number)) => void }
const Ctx = createContext<CtxState | null>(null)

function Provider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)
  const api = useMemo(() => ({ count, setCount }), [count])
  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

function useCtx() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCtx must be used within Provider')
  return ctx
}

function AutoIncrementEffect() {
  useRenderTracker('Context(LoopTrap): AutoIncrementEffect')
  const { count, setCount } = useCtx()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!enabled) return
    if (count < 5) setCount(count + 1)
  }, [enabled, count, setCount])

  return (
      <Card size="small" title="受控的连锁更新">
        <RenderHighlight>
          <Space>
            <Typography.Text>count={count}</Typography.Text>
            <Button size="small" onClick={() => setEnabled(true)}>开始</Button>
            <Button size="small" onClick={() => { setEnabled(false); setCount(0) }}>重置</Button>
          </Space>
        </RenderHighlight>
      </Card>
  )
}

function NaiveLoopTrap() {
  useRenderTracker('Context(LoopTrap): NaiveLoopTrap')
  const { count, setCount } = useCtx()
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    if (count < 3) setCount(c => c + 1)
  }, [started, count, setCount])

  return (
      <Card size="small" title="依赖环引发的循环">
        <RenderHighlight>
          <Space>
            <Typography.Text>count={count}</Typography.Text>
            <Button size="small" onClick={() => setStarted(true)}>触发</Button>
            <Button size="small" onClick={() => { setStarted(false); setCount(0) }}>重置</Button>
          </Space>
        </RenderHighlight>
      </Card>
  )
}

export default function ContextLoopTrapPage() {
  useRenderTracker('Context(LoopTrap): PageRoot')
  const code = `const Ctx = createContext(null)\nfunction Provider(){\n  const [count, setCount] = useState(0)\n  const api = useMemo(() => ({ count, setCount }), [count])\n  return <Ctx.Provider value={api}/>\n}\n\nfunction Consumer(){\n  const { count, setCount } = useCtx()\n  useEffect(() => { /* 小心循环 */ if (count < 5) setCount(count + 1) }, [count])\n}`
  return (
    <Provider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Typography.Title level={4}>状态循环陷阱</Typography.Title>
        <Typography.Paragraph>
          由依赖环引发的连锁更新会快速放大渲染成本。通过受控条件与依赖隔离，避免不必要的循环。
        </Typography.Paragraph>
        <Row gutter={[12, 12]}>
          <Col span={12}><AutoIncrementEffect /></Col>
          <Col span={12}><NaiveLoopTrap /></Col>
        </Row>
        <CodeBlock code={code} />
      </Space>
    </Provider>
  )
}
