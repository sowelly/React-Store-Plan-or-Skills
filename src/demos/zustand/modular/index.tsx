import { Card, Col, Row, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { useBucket } from '@/store/bucketStore'
import { usePairStore } from '@/store/pairStore'
import { useShallow } from '@/store/boundStore'

export default function ZustandModularPage() {
  useRenderTracker('Zustand: ModularPage')
  const bucket = useBucket(useShallow((s) => s.bucket))
  const incA = useBucket.getState().incA
  const incB = useBucket.getState().incB
  const pair = usePairStore(useShallow((s) => ({ a: s.a, b: s.b })))
  const incPairA = usePairStore.getState().incA
  const incPairB = usePairStore.getState().incB
  const code = `// 模块化：不同业务域独立 store
// bucketStore.ts / pairStore.ts 分治维护
const a = useBucket(s => s.bucket.a)
const pair = usePairStore(s => ({ a: s.a, b: s.b }))`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>状态管理的模块化思路</Typography.Title>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Card size="small" title="对象桶（模块 A）">
            <RenderHighlight>
              <Space direction="vertical">
                <Typography.Text>a={bucket.a} b={bucket.b}</Typography.Text>
                <Space>
                  <Typography.Link onClick={() => incA()}>A +1</Typography.Link>
                  <Typography.Link onClick={() => incB()}>B +1</Typography.Link>
                </Space>
              </Space>
            </RenderHighlight>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="独立 store（模块 B）">
            <RenderHighlight>
              <Space direction="vertical">
                <Typography.Text>a={pair.a} b={pair.b}</Typography.Text>
                <Space>
                  <Typography.Link onClick={() => incPairA()}>A +1</Typography.Link>
                  <Typography.Link onClick={() => incPairB()}>B +1</Typography.Link>
                </Space>
              </Space>
            </RenderHighlight>
          </Card>
        </Col>
      </Row>
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>按业务域拆分 store，组件仅订阅所属域片段；跨域数据通过组合选择或上层聚合。</Typography.Paragraph>
      </Card>
      <Card size="small" title="代码示例">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', wordBreak: 'break-word' }}><code>{code}</code></pre>
      </Card>
    </Space>
  )
}
