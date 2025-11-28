import { Card, Col, Row, Space, Typography, Button } from 'antd'
import { memo } from 'react'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { useBucket } from '@/store/bucketStore'
import { usePairStore } from '@/store/pairStore'
import { useShallow } from '@/store/boundStore'

export default function ZustandModularPage() {
  useRenderTracker('Zustand: ModularPage')
  const code = `// 模块化：不同业务域独立 store
// bucketStore.ts / pairStore.ts 分治维护
const useBucket = create(set => ({
  bucket: { a: 0, b: 0 },
  incA: () => set(s => ({ bucket: { ...s.bucket, a: s.bucket.a + 1 } })),
  incB: () => set(s => ({ bucket: { ...s.bucket, b: s.bucket.b + 1 } })),
}))

const bucket = useBucket(s => s.bucket)
const a = useBucket(s => s.bucket.a)
const pair = usePairStore(s => ({ a: s.a, b: s.b }))`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>状态管理的模块化思路</Typography.Title>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <BucketModule />
        </Col>
        <Col span={12}>
          <PairModule />
        </Col>
      </Row>
      <Card size="small" title="代码示例">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', wordBreak: 'break-word' }}><code>{code}</code></pre>
      </Card>
        <Card size="small" title="说明与对照">
        <Typography.Paragraph>按业务域拆分 store，组件仅订阅所属域片段；跨域数据通过组合选择或上层聚合。</Typography.Paragraph>
        <Typography.Paragraph>对象桶（将多个字段聚合为一个对象）</Typography.Paragraph>
        <Typography.Paragraph>优点：结构清晰，便于一次性持久化/重置，批量更新更简洁。</Typography.Paragraph>
        <Typography.Paragraph>缺点：若组件订阅整个对象，任意字段变化都会触发渲染；返回对象的选择器还会产生新引用，引发联动渲染。</Typography.Paragraph>
        <Typography.Paragraph>最佳实践：只订阅必要的单字段；组合选择器时使用浅比较（useShallow）或按字段拆分 slice，避免直接返回对象作为订阅结果。</Typography.Paragraph>
      </Card>
    
    </Space>
  )
}

const BucketModule = memo(function BucketModule() {
  useRenderTracker('Zustand: BucketModule')
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title="订阅整个对象（对象桶）">
        <WholeObjectView />
      </Card>
      <Card size="small" title="仅订阅单字段">
        <SingleFieldView />
      </Card>
    </Space>
  )
})

const PairModule = memo(function PairModule() {
  useRenderTracker('Zustand: PairModule')
  const pair = usePairStore(useShallow((s) => ({ a: s.a, b: s.b })))
  const incPairA = usePairStore.getState().incA
  const incPairB = usePairStore.getState().incB
  return (
    <Card size="small" title="独立 store（模块 B）">
      <RenderHighlight>
        <Space direction="vertical">
          <Typography.Text>a={pair.a} b={pair.b}</Typography.Text>
          <Space>
            <Button onClick={() => incPairA()}>A +1</Button>
            <Button onClick={() => incPairB()}>B +1</Button>
          </Space>
        </Space>
      </RenderHighlight>
    </Card>
  )
})

const WholeObjectView = memo(function WholeObjectView() {
  useRenderTracker('Zustand: BucketModule/WholeObject')
  const bucket = useBucket(useShallow((s) => s.bucket))
  const incA = useBucket.getState().incA
  const incB = useBucket.getState().incB
  return (
    <RenderHighlight>
      <Space direction="vertical">
        <Typography.Text>a={bucket.a} b={bucket.b}</Typography.Text>
        <Space>
          <Button onClick={() => incA()}>A +1</Button>
          <Button onClick={() => incB()}>B +1</Button>
        </Space>
      </Space>
    </RenderHighlight>
  )
})

const SingleFieldView = memo(function SingleFieldView() {
  useRenderTracker('Zustand: BucketModule/SingleField')
  const a = useBucket((s) => s.bucket.a)
  const incA = useBucket.getState().incA
  const incB = useBucket.getState().incB
  return (
    <RenderHighlight>
      <Space direction="vertical">
        <Typography.Text>a={a}</Typography.Text>
        <Space>
          <Button onClick={() => incA()}>A +1</Button>
          <Button onClick={() => incB()}>B +1</Button>
        </Space>
      </Space>
    </RenderHighlight>
  )
})
