import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Card, Space, Tabs, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { useBasicStore } from '@/store/basicStore'

function useLocalCounter() {
  const [count, setCount] = useState(0)
  const inc = () => setCount((v) => v + 1)
  const dec = () => setCount((v) => v - 1)
  return { count, inc, dec }
}

function IsolationDemo() {
  useRenderTracker('HooksMultiCall: IsolationDemo')
  return (
    <Card size="small" title="状态隔离问题：同页不同组件调用同一 Hook 值不一致">
      <Space direction="vertical" style={{ width: '100%' }}>
        <LocalCounterUnit label="A" />
        <LocalCounterUnit label="B" />
        <Typography.Paragraph>两个不同组件各自调用同一自定义 Hook，因内部使用独立的状态与闭包，显示的值彼此不一致；若期望共享，请改用外部单例 Store 或顶层状态下发。</Typography.Paragraph>
      </Space>
    </Card>
  )
}


export default function HookMultiCallScopePage() {
  useRenderTracker('HooksMultiCall: Page')
  const [active, setActive] = useState('isolation')
  const items = useMemo(
    () => [
      { key: 'isolation', label: '状态隔离问题', children: <IsolationDemo /> },
      { key: 'effect-loop', label: 'Effect 无限循环问题', children: <EffectInfiniteLoopDemo /> },
    ],
    [],
  )

  const sample = `// 状态隔离问题：不同组件各自调用同一 Hook，值不一致
function useLocalCounter() {
  const [count, setCount] = useState(0)
  const inc = () => setCount(v => v + 1)
  const dec = () => setCount(v => v - 1)
  return { count, inc, dec }
}

function Page() {
  // 不同组件各自调用：值互不影响
  return (<>
    <LocalCounterUnit label="A" />
    <LocalCounterUnit label="B" />
  </>)
}

// Effect 无限循环问题：依赖不稳定引用触发重复执行
function useUnstableObject(v) { return { v } }
function Demo() {
  const [tick, setTick] = useState(0)
  const obj = useUnstableObject(tick)
  useEffect(() => {
    setTick(t => t + 1) // 每次渲染都执行，造成循环
  }, [obj])
}`

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Hook 在复杂页面中的高频 Bug 场景</Typography.Title>
      <Typography.Paragraph style={{ color: '#666' }}>
          React Hook 本质上是函数，每次调用都会生成独立 state 环境；依赖不稳定引用的 Effect 会引发重复执行。此页聚焦“状态隔离问题”与“Effect 无限循环问题”。
      </Typography.Paragraph>
      <Tabs items={items} activeKey={active} onChange={setActive} />
      <CodeBlock code={sample} />
    </Space>
  )
}

function EffectInfiniteLoopDemo() {
  useRenderTracker('HooksMultiCall: EffectInfiniteLoopDemo')
  const [tick, setTick] = useState(0)
  const [running, setRunning] = useState(false)
  const loopCountRef = useRef(0)
  const maxLoops = 20

  function useUnstableObject(v: number) {
    return { v }
  }

  const obj = useUnstableObject(tick)

  useEffect(() => {
    if (!running) return
    if (loopCountRef.current >= maxLoops) return
    loopCountRef.current += 1
    setTick((t) => t + 1)
  }, [obj, running])

  return (
    <Card size="small" title="Effect 无限循环问题：不稳定依赖触发重复更新">
      <Space direction="vertical" style={{ width: '100%' }}>
        <RenderHighlight>
          <Space>
            <Typography.Text>tick={tick}</Typography.Text>
            <Typography.Text type="secondary">循环次数：{loopCountRef.current}/{maxLoops}</Typography.Text>
          </Space>
        </RenderHighlight>
        <Space>
          <Card size="small"><Typography.Link onClick={() => { loopCountRef.current = 0; setRunning(true) }}>开始</Typography.Link></Card>
          <Card size="small"><Typography.Link onClick={() => setRunning(false)}>停止</Typography.Link></Card>
          <Card size="small"><Typography.Link onClick={() => { setRunning(false); setTick(0); loopCountRef.current = 0 }}>重置</Typography.Link></Card>
        </Space>
        <Typography.Paragraph>解释：依赖数组包含不稳定对象引用（每次渲染都会新建），Effect 每次渲染都会重新执行；若执行中更新状态（如 setTick），将触发再次渲染与再次执行，形成无限循环。应将依赖改为稳定引用或在 Hook 内使用 useMemo/useCallback 保持引用稳定。</Typography.Paragraph>
      </Space>
    </Card>
  )
}

function LocalCounterUnit({ label }: { label: string }) {
  useRenderTracker('HooksMultiCall: LocalCounterUnit ' + label)
  const { count, inc, dec } = useLocalCounter()
  return (
    <RenderHighlight>
      <Space>
        <Typography.Text>{label}.count={count}</Typography.Text>
        <Typography.Link onClick={() => inc()}>{label} +1</Typography.Link>
        <Typography.Link onClick={() => dec()}>{label} -1</Typography.Link>
      </Space>
    </RenderHighlight>
  )
}
