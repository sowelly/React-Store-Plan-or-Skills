import React, { useMemo, useState } from 'react'
import useHydratedClient from '@/hooks/useHydratedClient'
import { Button, Card, Space, Tabs, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { useBucket } from '@/store/bucketStore'
import { useDirectStore } from '@/store/directStore'
// 合并后不再使用 usePairStore
import { usePersisted } from '@/store/persistedStore'
import { useShallow } from '@/store/boundStore'

 


function PersistFlickerDemo() {
  useRenderTracker('Pitfalls: PersistFlickerDemo')
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
      <Card size="small"><Button onClick={() => inc()}>+1</Button></Card>
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
  useRenderTracker('Pitfalls: Hub')
  const [key, setKey] = useState('pit-subscriptions')
  const items = useMemo(() => ([
    { key: 'pit-subscriptions', label: '联动与订阅策略对比', children: <CombinedSubscriptionsDemo/> },
    { key: 'pit-1.5', label: 'persist 初始闪烁', children: <PersistFlickerDemo/> },
  ]), [])
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
       <Typography.Title level={4}>Zustand 常见渲染与数据陷阱</Typography.Title>
        <Typography.Paragraph>
          Zustand 是轻量强大的，但也因此更容易被误用。
        </Typography.Paragraph>
      <Tabs items={items} activeKey={key} onChange={setKey}/>
    </Space>
  )
}

function CombinedSubscriptionsDemo() {
  useRenderTracker('Pitfalls: CombinedSubscriptionsDemo')
  const sample = `// 桶模式与订阅策略示例
const useBucket = create(set => ({
  bucket: { a: 0, b: 0 },
  incA: () => set(s => ({ bucket: { ...s.bucket, a: s.bucket.a + 1 } })),
  incB: () => set(s => ({ bucket: { ...s.bucket, b: s.bucket.b + 1 } })),
}))
// 订阅整个对象 vs 单字段
const bucket = useBucket(s => s.bucket)
const a = useBucket(s => s.bucket.a)
// 直接解构整库 vs 单字段
const whole = useStore()
const x = useStore(s => s.x)
const y = useStore(s => s.y)
// 组合选择配合浅比较
const pairSafe = useStore(useShallow(s => ({ x: s.x, y: s.y })))`

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <BucketCompareCard />
      <DirectVsFieldCard />
      <SelectorVsShallowCard />

      <Card size="small" title="异常信息与成因（详细）">
        <Typography.Paragraph>错误：getSnapshot 未缓存导致无限循环；同时出现 Maximum update depth exceeded。</Typography.Paragraph>
        <Typography.Paragraph>触发条件：在“对象选择器”场景中，选择器每次返回新对象引用，React 开发模式会在同一渲染周期内多次调用外部存储快照获取；当快照在同一次渲染中不一致，库层为保障一致性会再次触发更新，造成渲染-获取快照的循环。</Typography.Paragraph>
        <Typography.Paragraph>机制背景：订阅外部数据源依赖 `useSyncExternalStore`；渲染期间要求 `getSnapshot` 返回值在一次渲染内一致。对象选择器返回的新引用会破坏一致性，引发警告与潜在无限渲染。</Typography.Paragraph>
        <Typography.Paragraph>解决方案：避免返回新对象引用；使用单字段选择、或配合 `useShallow` 对组合对象进行浅比较，保证快照在一次渲染中的稳定；或使用等价性函数的版本为选择器提供稳定性。</Typography.Paragraph>
      </Card>

      <CodeBlock code={sample} />
    </Space>
  )
}

function BucketCompareCard() {
  useRenderTracker('Pitfalls: BucketCompareCard')
  const a = useBucket((s) => s.bucket.a)
  const bucket = useBucket((s) => s.bucket)
  const incASetter = useBucket.getState().incA
  const incBSetter = useBucket.getState().incB
  return (
    <Card size="small" title="对象桶：订阅整个对象 vs 单字段">
      <Space direction="vertical" style={{ width: '100%' }}>
        <RenderHighlight>
          <Space>
            <Typography.Text>bucket.a={bucket.a}</Typography.Text>
            <Typography.Text>bucket.b={bucket.b}</Typography.Text>
          </Space>
        </RenderHighlight>
        <RenderHighlight>
          <Typography.Text>a={a}</Typography.Text>
        </RenderHighlight>
        <Space>
          <Card size="small"><Typography.Link onClick={() => incASetter()}>A +1</Typography.Link></Card>
          <Card size="small"><Typography.Link onClick={() => incBSetter()}>B +1</Typography.Link></Card>
        </Space>
        <Typography.Paragraph>对照说明：订阅整个对象在任意字段变化时渲染；仅订阅单字段仅在该字段变化时渲染。</Typography.Paragraph>
      </Space>
    </Card>
  )
}

function DirectVsFieldCard() {
  useRenderTracker('Pitfalls: DirectVsFieldCard')
  const whole = useDirectStore()
  const selectX = useDirectStore((s) => s.x)
  const selectY = useDirectStore((s) => s.y)
  const incX = useDirectStore.getState().incX
  const incY = useDirectStore.getState().incY
  return (
    <Card size="small" title="直接解构整库 vs 单字段订阅">
      <Space direction="vertical" style={{ width: '100%' }}>
        <RenderHighlight>
          <Space direction="vertical">
            <Typography.Text>整库：x={whole.x} y={whole.y}</Typography.Text>
            <Space>
              <Card size="small"><Typography.Link onClick={() => incX()}>X +1</Typography.Link></Card>
              <Card size="small"><Typography.Link onClick={() => incY()}>Y +1</Typography.Link></Card>
            </Space>
          </Space>
        </RenderHighlight>
        <RenderHighlight>
          <Space direction="vertical">
            <Typography.Text>单字段：x={selectX}</Typography.Text>
            <Typography.Text>单字段：y={selectY}</Typography.Text>
            <Space>
              <Card size="small"><Typography.Link onClick={() => incX()}>X +1</Typography.Link></Card>
              <Card size="small"><Typography.Link onClick={() => incY()}>Y +1</Typography.Link></Card>
            </Space>
          </Space>
        </RenderHighlight>
        <Typography.Paragraph>对照说明：整库订阅在任意字段变化时渲染；单字段订阅仅在所选字段变化时渲染。</Typography.Paragraph>
      </Space>
    </Card>
  )
}

function SelectorVsShallowCard() {
  useRenderTracker('Pitfalls: SelectorVsShallowCard')
  const pairSafe = useDirectStore(useShallow((s) => ({ x: s.x, y: s.y })))
  const incTick = useDirectStore.getState().incTick
  const incX = useDirectStore.getState().incX
  const incY = useDirectStore.getState().incY
  return (
    <Card size="small" title="对象选择器联动 vs 浅比较（安全）">
      <Space direction="vertical">
        <RenderHighlight>
          <Space>
            <Typography.Text type="secondary">未使用浅比较的对象选择器在开发模式下可能导致快照不一致并引发无限渲染；此处展示浅比较的安全方案。</Typography.Text>
          </Space>
        </RenderHighlight>
        <RenderHighlight>
          <Space>
            <Typography.Text>浅比较：x={pairSafe.x} y={pairSafe.y}</Typography.Text>
          </Space>
        </RenderHighlight>
        <Space>
          <Card size="small"><Typography.Link onClick={() => incTick()}>Tick +1（与 x/y 无关）</Typography.Link></Card>
          <Card size="small"><Typography.Link onClick={() => incX()}>X +1</Typography.Link></Card>
          <Card size="small"><Typography.Link onClick={() => incY()}>Y +1</Typography.Link></Card>
        </Space>
        <Typography.Paragraph>对照说明：对象选择器每次返回新对象引用，容易在无关更新时触发渲染；浅比较能在值不变时保持稳定，避免无谓渲染与快照不一致。</Typography.Paragraph>
      </Space>
    </Card>
  )
}
