import React, { useCallback, useState } from 'react'
import { Card, Space, Button, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'

 

type LevelOneProps = {
  value: number
  onChange: (next: number) => void
}

type LevelTwoProps = LevelOneProps
type LevelThreeProps = LevelOneProps
type LevelFourProps = LevelOneProps
type LevelFiveProps = LevelOneProps

 

function LevelThree({ value, onChange }: LevelThreeProps) {
  useRenderTracker('Props: LevelThree')
  return (
      <Card size="small" title="Level Three">
        <RenderHighlight>
            <LevelFour value={value} onChange={onChange} />
        </RenderHighlight>
      </Card>
  )
}

function LevelTwo({ value, onChange }: LevelTwoProps) {
  useRenderTracker('Props: LevelTwo')
  return (
      <Card size="small" title="Level Two">
        <RenderHighlight>
            <LevelThree value={value} onChange={onChange} />
        </RenderHighlight>
      </Card>
  )
}

function LevelFour({ value, onChange }: LevelFourProps) {
  useRenderTracker('Props: LevelFour')
  return (
      <Card size="small" title="Level Four">
        <RenderHighlight>
          <Space direction="vertical">
            <LevelFive value={value} onChange={onChange} />
          </Space>
        </RenderHighlight>
      </Card>
  )
}

function LevelFive({ value, onChange }: LevelFiveProps) {
  useRenderTracker('Props: LevelFive')
  const doubled = value * 2
  return (
      <Card size="small" title="Level Five">
        <RenderHighlight>
            <Space direction="vertical">
              <Typography.Text>五级组件使用值（double）：{doubled}</Typography.Text>
              <Space>
                <Button size="small" onClick={() => onChange(value + 1)}>+1</Button>
                <Button size="small" onClick={() => onChange(value - 1)}>-1</Button>
                <Button size="small" onClick={() => onChange(0)}>重置</Button>
              </Space>
            </Space>
        </RenderHighlight>
      </Card>
  )
}

function LevelOne({ value, onChange }: LevelOneProps) {
  useRenderTracker('Props: LevelOne')
  return (
      <Card size="small" title="Level One">
        <RenderHighlight>
            <LevelTwo value={value} onChange={onChange} />
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
        顶层state值（通过 props 向下传递）：
        <Typography.Text code>{value}</Typography.Text>
      </Typography.Paragraph>
      <Typography.Paragraph>目标组件：level5</Typography.Paragraph>
      <LevelOne value={value} onChange={onChange} />
      <CodeBlock code={code} />
    </Space>
  )
}
