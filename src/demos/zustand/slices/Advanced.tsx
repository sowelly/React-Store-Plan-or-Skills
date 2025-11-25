import React from 'react'
import { Card, Col, Row, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { useBoundStore, useShallow } from '@/store/boundStore'

function SlicesARead() {
  useRenderTracker('Slices: ARead')
  const valueA = useBoundStore((s) => s.valueA)
  return (
    <RenderHighlight>
      <Typography.Text>A 片段值：{valueA}</Typography.Text>
    </RenderHighlight>
  )
}

function SlicesAOps() {
  useRenderTracker('Slices: AOps')
  const incA = useBoundStore((s) => s.incA)
  const decA = useBoundStore((s) => s.decA)
  return (
    <RenderHighlight>
      <Space>
        <Typography.Link onClick={incA}>A +1</Typography.Link>
        <Typography.Link onClick={decA}>A -1</Typography.Link>
      </Space>
    </RenderHighlight>
  )
}

function SlicesBRead() {
  useRenderTracker('Slices: BRead')
  const valueB = useBoundStore((s) => s.valueB)
  return (
    <RenderHighlight>
      <Typography.Text>B 片段值：{valueB}</Typography.Text>
    </RenderHighlight>
  )
}

function SlicesBOps() {
  useRenderTracker('Slices: BOps')
  const incB = useBoundStore((s) => s.incB)
  const decB = useBoundStore((s) => s.decB)
  return (
    <RenderHighlight>
      <Space>
        <Typography.Link onClick={incB}>B +1</Typography.Link>
        <Typography.Link onClick={decB}>B -1</Typography.Link>
      </Space>
    </RenderHighlight>
  )
}

function SlicesCombinedShallow() {
  useRenderTracker('Slices: CombinedShallow')
  const { valueA, valueB } = useBoundStore(
    useShallow((s) => ({ valueA: s.valueA, valueB: s.valueB })),
  )
  return (
    <RenderHighlight>
      <Typography.Text>组合读取（shallow）：A={valueA}，B={valueB}</Typography.Text>
    </RenderHighlight>
  )
}

function SlicesDerivedSum() {
  useRenderTracker('Slices: DerivedSum')
  const { valueA, valueB } = useBoundStore(
    useShallow((s) => ({ valueA: s.valueA, valueB: s.valueB })),
  )
  const sum = valueA + valueB
  return (
    <RenderHighlight>
      <Typography.Text>派生读取 sum=A+B：{sum}</Typography.Text>
    </RenderHighlight>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <Card size="small" title="代码示例" style={{ marginTop: 16 }}>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', wordBreak: 'break-word' }}>
        <code>{code}</code>
      </pre>
    </Card>
  )
}

export default function ZustandSlicesAdvanced() {
  useRenderTracker('Slices: Root')
  const sliceSample = `import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

type SliceA = {
  valueA: number
  incA: () => void
  decA: () => void
}

const createSliceA = (set: any) => ({
  valueA: 0,
  incA: () => set((s: any) => ({ valueA: s.valueA + 1 })),
  decA: () => set((s: any) => ({ valueA: s.valueA - 1 })),
})

type SliceB = {
  valueB: number
  incB: () => void
  decB: () => void
}

const createSliceB = (set: any) => ({
  valueB: 0,
  incB: () => set((s: any) => ({ valueB: s.valueB + 1 })),
  decB: () => set((s: any) => ({ valueB: s.valueB - 1 })),
})

type BoundStore = SliceA & SliceB

export const useBoundStore = create<BoundStore>()((...a) => ({
  ...createSliceA(...a),
  ...createSliceB(...a),
}))

const valueA = useBoundStore(s => s.valueA)
const valueB = useBoundStore(s => s.valueB)
const pair = useBoundStore(useShallow(s => ({ valueA: s.valueA, valueB: s.valueB })))`
  const sample = `const valueA = useBoundStore(s => s.valueA)
const valueB = useBoundStore(s => s.valueB)
const pair = useBoundStore(useShallow(s => ({ valueA: s.valueA, valueB: s.valueB })))`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Zustand 切片方案（详细）</Typography.Title>
      <Typography.Paragraph style={{ color: '#666' }}>
        仅订阅所需片段，组合读取使用 shallow 进行浅比较，派生值在组件内计算，避免无关渲染。
      </Typography.Paragraph>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Card size="small" title="片段 A">
            <Space direction="vertical">
              <SlicesARead />
              <SlicesAOps />
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="片段 B">
            <Space direction="vertical">
              <SlicesBRead />
              <SlicesBOps />
            </Space>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="小" title="组合读取（shallow）">
            <SlicesCombinedShallow />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="小" title="派生读取（sum）">
            <SlicesDerivedSum />
          </Card>
        </Col>
      </Row>
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>
          通过片段化与选择器控制订阅范围；组合读取时使用 shallow 避免对象引用变化带来的联动渲染；派生值在组件层计算，保持 store 简洁。
        </Typography.Paragraph>
      </Card>
      <Card size="small" title="切片定义示例">
        <CodeBlock code={sliceSample} />
      </Card>
      <CodeBlock code={sample} />
    </Space>
  )
}
