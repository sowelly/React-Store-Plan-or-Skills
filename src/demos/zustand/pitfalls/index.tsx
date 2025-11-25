import React, { useMemo, useState } from 'react'
import useHydratedClient from '@/hooks/useHydratedClient'
import { Card, Space, Tabs, Typography } from 'antd'
import { RenderHighlight } from '@/utils/renderLog'
import { useBucket } from '@/store/bucketStore'
import { useDirectStore } from '@/store/directStore'
import { usePairStore } from '@/store/pairStore'
import { usePersisted } from '@/store/persistedStore'
import { useShallow } from '@/store/boundStore'

function CodeBlock({ code }: { code: string }) {
  return (
    <Card size="small" title="代码示例" style={{ marginTop: 16 }}>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', wordBreak: 'break-word' }}>
        <code>{code}</code>
      </pre>
    </Card>
  )
}

function ObjectBucketDemo() {
  const a = useBucket((s) => s.bucket.a)
  const bucket = useBucket((s) => s.bucket)
  const incASetter = useBucket.getState().incA
  const incBSetter = useBucket.getState().incB
  const sample = `const useBucket = create(set => ({
  bucket: { a: 0, b: 0 },
  incA: () => set(s => ({ bucket: { ...s.bucket, a: s.bucket.a + 1 } })),
  incB: () => set(s => ({ bucket: { ...s.bucket, b: s.bucket.b + 1 } })),
}))
const bucket = useBucket(s => s.bucket)
const a = useBucket(s => s.bucket.a)`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title="订阅整个对象导致任意字段变化联动重渲染">
        <RenderHighlight>
          <Space>
            <Typography.Text>bucket.a={bucket.a}</Typography.Text>
            <Typography.Text>bucket.b={bucket.b}</Typography.Text>
          </Space>
        </RenderHighlight>
      </Card>
      <Card size="small" title="仅订阅单字段">
        <RenderHighlight>
          <Typography.Text>a={a}</Typography.Text>
        </RenderHighlight>
      </Card>
      <Space>
        <Card size="small"><Typography.Link onClick={() => incASetter()}>A +1</Typography.Link></Card>
        <Card size="small"><Typography.Link onClick={() => incBSetter()}>B +1</Typography.Link></Card>
      </Space>
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>
          订阅整个对象会在任意字段变化时重渲染；将字段拆分并分别订阅，可显著减少不必要渲染。
        </Typography.Paragraph>
      </Card>
      <CodeBlock code={sample} />
    </Space>
  )
}

function DirectDestructureDemo() {
  const whole = useDirectStore()
  const incX = useDirectStore.getState().incX
  const incY = useDirectStore.getState().incY
  const sample = `const whole = useStore()
const x = useStore(s => s.x)
const y = useStore(s => s.y)`
  return (
    <Space direction="vertical">
      <RenderHighlight>
        <Typography.Text>直接解构订阅整个 store：x={whole.x} y={whole.y}</Typography.Text>
      </RenderHighlight>
      <Space>
        <Card size="small"><Typography.Link onClick={() => incX()}>X +1</Typography.Link></Card>
        <Card size="small"><Typography.Link onClick={() => incY()}>Y +1</Typography.Link></Card>
      </Space>
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>
          直接解构会让组件订阅整库，任何字段变化都重渲染；应按需选择片段，降低订阅范围。
        </Typography.Paragraph>
      </Card>
      <CodeBlock code={sample} />
    </Space>
  )
}

function ObjectSelectorDemo() {
  const pair = usePairStore(useShallow((s) => ({ a: s.a, b: s.b })))
  const incA = usePairStore.getState().incA
  const incB = usePairStore.getState().incB
  const sample = `const pair = useStore(s => ({ a: s.a, b: s.b }))
const pairSafe = useStore(useShallow(s => ({ a: s.a, b: s.b })))`
  return (
    <Space direction="vertical">
      <RenderHighlight>
        <Typography.Text>a={pair.a} b={pair.b}</Typography.Text>
      </RenderHighlight>
      <Space>
        <Card size="small"><Typography.Link onClick={() => incA()}>A +1</Typography.Link></Card>
        <Card size="small"><Typography.Link onClick={() => incB()}>B +1</Typography.Link></Card>
      </Space>
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>
          返回对象的 selector 每次生成新引用，会导致联动渲染；通过 useShallow 或分别选择字段，可以避免该问题。
        </Typography.Paragraph>
      </Card>
      <CodeBlock code={sample} />
    </Space>
  )
}

function PersistFlickerDemo() {
  const pcount = usePersisted((s: any) => s.pcount)
  const inc = usePersisted.getState().inc
  const hydratedFlag = usePersisted((s: any) => s.hydrated)
  const isHydrated = useHydratedClient()
  const sample = `import { persist, createJSONStorage } from 'zustand/middleware'
const usePersisted = create(persist((set, get) => ({
  pcount: 0,
  inc: () => set({ pcount: get().pcount + 1 }),
  hydrated: false,
  setHydrated: (v) => set({ hydrated: v }),
}), {
  name: 'persist-demo',
  storage: createJSONStorage(() => localStorage),
  onRehydrateStorage: () => (state) => { state?.setHydrated(true) }
}))

// 外部 Hook
export function useHydrated() { return usePersisted(s => s.hydrated) }

// 纯客户端 Hook（与 store 无关）
import { useEffect, useRef } from 'react'
export function useHydratedClient() {
  const hydrated = useRef(false)
  useEffect(() => { hydrated.current = true }, [])
  return hydrated.current
}

// 使用方式
const isHydrated = useHydratedClient()
if (!isHydrated) { return null /* 或 Skeleton */ }
return <ChatView />`
  return (
    <Space direction="vertical">
      <RenderHighlight>
        <Typography.Text>方案一（store 标记）：{hydratedFlag ? `count=${pcount}` : '恢复中...'}</Typography.Text>
      </RenderHighlight>
      <RenderHighlight>
        <Typography.Text>方案二（纯客户端 Hook）：{isHydrated ? '已就绪（渲染客户端视图）' : '恢复中...（可返回 Skeleton）'}</Typography.Text>
      </RenderHighlight>
      <Card size="small"><Typography.Link onClick={() => inc()}>加一</Typography.Link></Card>
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>
          持久化初次渲染为默认值，rehydrate 后更新可能产生闪烁；可通过 store 内 hydrated 标记或外部 useHydrated Hook 控制渲染时机，避免闪烁与未及时更新。
        </Typography.Paragraph>
      </Card>
      <CodeBlock code={sample} />
    </Space>
  )
}

export default function ZustandPitfallsHub() {
  const [key, setKey] = useState('pit-1.1')
  const items = useMemo(() => ([
    { key: 'pit-1.1', label: '1.1 对象桶联动', children: <ObjectBucketDemo/> },
    { key: 'pit-1.2', label: '1.2 直接解构订阅整库', children: <DirectDestructureDemo/> },
    { key: 'pit-1.3', label: '1.3 对象选择器联动', children: <ObjectSelectorDemo/> },
    { key: 'pit-1.5', label: '1.5 persist 初始闪烁', children: <PersistFlickerDemo/> },
  ]), [])
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title="Zustand 常见渲染与数据陷阱">拆分子页面进行对照演示</Card>
      <Tabs items={items} activeKey={key} onChange={setKey}/>
    </Space>
  )
}
