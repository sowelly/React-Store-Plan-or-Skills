import React, { useEffect, useState } from 'react'
import { Card, Space, Typography, Button } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

type SubSelState = { a: number; b: number; incA: () => void; incB: () => void; reset: () => void }
const useSubSelStore = create<SubSelState>()(
  subscribeWithSelector((set, get) => ({
    a: 0,
    b: 0,
    incA: () => set({ a: get().a + 1 }),
    incB: () => set({ b: get().b + 1 }),
    reset: () => set({ a: 0, b: 0 }),
  })),
)

export default function SubscribeWithSelectorTab() {
  useRenderTracker('Zustand(Middlewares): SubscribeWithSelectorTab')
  const a = useSubSelStore((s) => s.a)
  const b = useSubSelStore((s) => s.b)
  const incA = useSubSelStore.getState().incA
  const incB = useSubSelStore.getState().incB
  const reset = useSubSelStore.getState().reset
  const [sumHits, setSumHits] = useState(0)
  const [objHits, setObjHits] = useState(0)
  const code = `import { subscribeWithSelector } from 'zustand/middleware'
const useStore = create(
  subscribeWithSelector(
    (set, get) => ({
      a: 0,
      b: 0,
      incA: () => set({ a: get().a + 1 }),
      incB: () => set({ b: get().b + 1 }),
      reset: () => set({ a: 0, b: 0 }),
    }),
  ),
)
const unsub = useStore.subscribe((s) => s.a + s.b, listener, { fireImmediately: true })`

  useEffect(() => {
    const unsub1 = useSubSelStore.subscribe((s) => s.a + s.b, () => setSumHits((n) => n + 1), { fireImmediately: true })
    const unsub2 = useSubSelStore.subscribe((s) => ({ a: s.a, b: s.b }), () => setObjHits((n) => n + 1))
    return () => { unsub1(); unsub2() }
  }, [])

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title="选择结果订阅示例">
        <RenderHighlight>
          <Space direction="vertical">
            <Typography.Text>a={a} b={b}</Typography.Text>
            <Space>
              <Button onClick={() => incA()}>A +1</Button>
              <Button onClick={() => incB()}>B +1</Button>
              <Button onClick={() => reset()}>重置</Button>
            </Space>
            <Typography.Text type="secondary">sum(a+b)触发次数={sumHits}</Typography.Text>
            <Typography.Text type="secondary">对象订阅触发次数={objHits}</Typography.Text>
          </Space>
        </RenderHighlight>
      </Card>
      <Card size="small" title="代码与说明">
        <CodeBlock code={code} />
        <Typography.Paragraph>订阅选择结果用于非 React 或跨组件联动，可选择开启 fireImmediately 获取初始值。</Typography.Paragraph>
      </Card>
    </Space>
  )
}
