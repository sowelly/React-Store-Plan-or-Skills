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
      <Card size="small" title="代码与说明">
        <Typography.Text >
          subscribeWithSelector 主要用来增强 store 的订阅能力：
          它允许你精确订阅 Store 的某一部分（selector），只有当那部分变化时才触发回调。
        </Typography.Text>
        <Typography.Text >不用订整个 store</Typography.Text>
        <Typography.Text >不用手写 diff</Typography.Text>
        <Typography.Text >不用 useSelector Hook</Typography.Text>
        <Typography.Text >直接对“某段状态”做订阅（含局部对比）</Typography.Text>
      </Card>

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
      <CodeBlock code={code} />
      <Card size="small" title="代码与说明">
        <Typography.Paragraph>订阅选择结果用于非 React 或跨组件联动，可选择开启 fireImmediately 获取初始值。        </Typography.Paragraph>
        <Typography.Paragraph>subscribe(selector, listener, options?)</Typography.Paragraph>
        <Typography.Paragraph>
          参数说明：
          <Typography.Text code>selector</Typography.Text> 为选择器函数，返回被订阅的片段；
          <Typography.Text code>listener</Typography.Text> 回调签名为 <Typography.Text code>(selected, prevSelected)</Typography.Text>；
          <Typography.Text code>options</Typography.Text> 可选项包括：
          <Typography.Text code>fireImmediately</Typography.Text>（默认 <Typography.Text code>false</Typography.Text>，立即触发一次回调以获得当前初始值）、
          <Typography.Text code>equalityFn</Typography.Text>（用于比较 <Typography.Text code>prevSelected</Typography.Text> 与 <Typography.Text code>selected</Typography.Text> 是否变化，默认 <Typography.Text code>Object.is</Typography.Text>，对象订阅可使用 <Typography.Text code>shallow</Typography.Text> 实现浅比较）。
        </Typography.Paragraph>
        <Typography.Paragraph>
          返回值：取消订阅函数 <Typography.Text code>() =&gt; void</Typography.Text>，组件卸载或不再需要时调用以清理资源。
        </Typography.Paragraph>
      </Card>
    </Space>
  )
}
