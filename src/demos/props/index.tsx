import React, { useCallback, useState } from 'react'
import { Card, Col, Row, Space, Button, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'

 

type LevelOneProps = {
  value: number
  onChange: (next: number) => void
}

type LevelTwoProps = LevelOneProps & { label?: string }
type LevelThreeProps = LevelOneProps
type LevelFourProps = LevelOneProps
type LevelFiveProps = LevelOneProps

function PassiveSibling({ label }: { label: string }) {
  useRenderTracker(`Props: PassiveSibling(${label})`)
  return (
    <RenderHighlight>
      <Typography.Text type="secondary">无关子组件：{label}</Typography.Text>
    </RenderHighlight>
  )
}

function LevelThree({ value, onChange }: LevelThreeProps) {
  useRenderTracker('Props: LevelThree')
  return (
      <Card size="small" title="Level Three">
        <RenderHighlight>
            <Space direction="vertical">
              <Typography.Text>叶子组件接收到的值：{value}</Typography.Text>
              <Space>
                <Button size="small" onClick={() => onChange(value + 1)}>+1</Button>
                <Button size="small" onClick={() => onChange(0)}>重置</Button>
              </Space>
            </Space>
        </RenderHighlight>
      </Card>
  )
}

function LevelTwo({ value, onChange, label = '二级-无关' }: LevelTwoProps) {
  useRenderTracker('Props: LevelTwo')
  return (
      <Card size="small" title="Level Two">
        <RenderHighlight>
            <Row gutter={8}>
              <Col span={12}>
                <LevelThree value={value} onChange={onChange} />
              </Col>
              <Col span={12}>
                <PassiveSibling label={label} />
              </Col>
            </Row>
        </RenderHighlight>
      </Card>
  )
}

function LevelFour({ value, onChange }: LevelFourProps) {
  useRenderTracker('Props: LevelFour')
  return (
    <RenderHighlight>
      <Card size="small" title="Level Four">
        <Row gutter={8}>
          <Col span={16}>
            <LevelTwo value={value} onChange={onChange} label={`四级-无关-${value}`} />
          </Col>
          <Col span={8}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <PassiveSibling label={`四级-旁支A-${value}`} />
              <PassiveSibling label={`四级-旁支B-${value}`} />
            </Space>
          </Col>
        </Row>
      </Card>
    </RenderHighlight>
  )
}

function LevelFive({ value, onChange }: LevelFiveProps) {
  useRenderTracker('Props: LevelFive')
  return (
      <Card size="small" title="Level Five">
        <RenderHighlight>
            <Row gutter={8}>
              <Col span={18}>
                <LevelFour value={value} onChange={onChange} />
              </Col>
              <Col span={6}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <PassiveSibling label={`五级-旁支A-${value}`} />
                  <PassiveSibling label={`五级-旁支B-${value}`} />
                  <PassiveSibling label={`五级-旁支C-${value}`} />
                </Space>
              </Col>
            </Row>
        </RenderHighlight>
      </Card>
  )
}

function LevelOne({ value, onChange }: LevelOneProps) {
  useRenderTracker('Props: LevelOne')
  const changeToRandom = useCallback(() => onChange(Math.floor(Math.random() * 100)), [onChange])
  return (
      <Card size="small" title="Level One">
        <RenderHighlight>
            <Space direction="vertical">
              <Typography.Text>一级组件接收到的值：{value}</Typography.Text>
              <Space>
                <Button onClick={() => onChange(value + 1)}>+1</Button>
                <Button onClick={() => onChange(value - 1)}>-1</Button>
                <Button onClick={changeToRandom}>随机</Button>
              </Space>
              <LevelTwo value={value} onChange={onChange} label={`标签-${value}`} />
            </Space>
        </RenderHighlight>
      </Card>
  )
}

export default function PropsDrillingDemo() {
  useRenderTracker('Props: DemoRoot')
  const [value, setValue] = useState(0)
  const onChange = useCallback((next: number) => setValue(next), [])
  const code = `// Props Drilling 示例
type LeafProps = { value: number; onChange: (n: number) => void }

function Leaf({ value, onChange }: LeafProps) {
  return (
    <div>
      <span>叶子值：{value}</span>
      <button onClick={() => onChange(value + 1)}>+1</button>
    </div>
  )
}

function Middle({ value, onChange }: LeafProps) {
  return <Leaf value={value} onChange={onChange} />
}

export default function Root() {
  const [value, setValue] = useState(0)
  return <Middle value={value} onChange={setValue} />
}`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Props 传递 / 属性钻探演示</Typography.Title>
      <Typography.Paragraph style={{ color: '#666' }}>
        修改上游值会导致整条组件树重渲染，越深层越明显，易导致性能问题与复杂的属性传递。
      </Typography.Paragraph>
      <Typography.Paragraph>
        当前全局值（通过 props 向下传递）：
        <Typography.Text code>{value}</Typography.Text>
      </Typography.Paragraph>
      <LevelOne value={value} onChange={onChange} />
      <LevelFive value={value} onChange={onChange} />
      <CodeBlock code={code} />
    </Space>
  )
}
