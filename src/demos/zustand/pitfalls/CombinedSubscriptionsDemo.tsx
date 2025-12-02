import React from 'react'
import { Card, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { useBucket } from '@/store/bucketStore'
import { useDirectStore } from '@/store/directStore'
import { useShallow } from '@/store/boundStore'

export default function CombinedSubscriptionsDemo() {
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
import { useDirectStore } from '@/store/directStore'
const whole = useDirectStore()
const x = useDirectStore(s => s.x)
const y = useDirectStore(s => s.y)

// 组合选择配合浅比较（安全）
import { useShallow } from '@/store/boundStore'
const pairSafe = useDirectStore(useShallow(s => ({ x: s.x, y: s.y })))

function View() {
  const incTick = useDirectStore.getState().incTick
  const incX = useDirectStore.getState().incX
  const incY = useDirectStore.getState().incY
  return (
    <div>
      <span>浅比较：x={pairSafe.x} y={pairSafe.y}</span>
      <button onClick={() => incTick()}>Tick +1</button>
      <button onClick={() => incX()}>X +1</button>
      <button onClick={() => incY()}>Y +1</button>
    </div>
  )
}`

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
