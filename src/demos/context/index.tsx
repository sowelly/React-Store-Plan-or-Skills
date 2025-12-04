import React, { createContext, useContext, useMemo, useState } from 'react'
import { Card, Col, Row, Space, Button, Typography } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'

type GlobalState = {
  value: number
  setValue: (next: number) => void
}

const GlobalStateContext = createContext<GlobalState | null>(null)

function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(0)
  const api = useMemo(() => ({ value, setValue }), [value])
  return <GlobalStateContext.Provider value={api}>{children}</GlobalStateContext.Provider>
}

function useGlobal() {
  const ctx = useContext(GlobalStateContext)
  if (!ctx) throw new Error('useGlobal must be used within GlobalStateProvider')
  return ctx
}

type ModuleState = {
  value: number
  setValue: (next: number) => void
}

const ModuleStateContext = createContext<ModuleState | null>(null)

function ModuleStateProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState(0)
  const api = useMemo(() => ({ value, setValue }), [value])
  return <ModuleStateContext.Provider value={api}>{children}</ModuleStateContext.Provider>
}

function useModule() {
  const ctx = useContext(ModuleStateContext)
  if (!ctx) throw new Error('useModule must be used within ModuleStateProvider')
  return ctx
}

function GlobalBanner() {
  useRenderTracker('Context: GlobalBanner')
  const { value, setValue } = useGlobal()
  return (
      <Card size="small" title="全局横幅（消费 Global）">
        <RenderHighlight>
          <Space>
            <Typography.Text>global={value}</Typography.Text>
            <Button size="small" onClick={() => setValue(value + 1)}>+1</Button>
            <Button size="small" onClick={() => setValue(0)}>重置</Button>
          </Space>
        </RenderHighlight>
      </Card>
  )
}

function ModuleALeaf() {
  useRenderTracker('Context: ModuleA Leaf')
  const { value, setValue } = useModule()
  return (
      <Card size="small" title="模块 A 叶子（消费 Module）">
    <RenderHighlight>
        <Space>
          <Typography.Text>moduleA={value}</Typography.Text>
          <Button size="small" onClick={() => setValue(value + 1)}>+1</Button>
          <Button size="small" onClick={() => setValue(0)}>重置</Button>
        </Space>
    </RenderHighlight>
      </Card>
  )
}

function ModuleASiblingGlobal() {
  useRenderTracker('Context: ModuleA Sibling(Global)')
  const { value } = useGlobal()
  return (
    <RenderHighlight>
      <Typography.Text type="secondary">同级消费 Global（global={value}）</Typography.Text>
    </RenderHighlight>
  )
}

function ModuleASection() {
  useRenderTracker('Context: ModuleA Section')
  const { value: globalValue } = useGlobal()
  return (
      <Card size="small" title="模块 A（局部 Provider）">
        <ModuleStateProvider>
          <Space direction="vertical" style={{ width: '100%' }}>
          <RenderHighlight >
                  <Typography.Text type="secondary">此列既有局部 Module，也读取 Global（global={globalValue}）。</Typography.Text>
          </RenderHighlight>
            <Row gutter={8}>
              <Col span={12}><ModuleALeaf /></Col>
              <Col span={12}><ModuleASiblingGlobal /></Col>
            </Row>
          </Space>
        </ModuleStateProvider>
      </Card>
  )
}

function ModuleBLeafGlobal() {
  useRenderTracker('Context: ModuleB Leaf(Global)')
  const { value, setValue } = useGlobal()
  return (
      <Card size="small" title="模块 B 叶子（消费 Global）">
    <RenderHighlight>
        <Space>
          <Typography.Text>global={value}</Typography.Text>
          <Button size="small" onClick={() => setValue(value + 1)}>+1</Button>
          <Button size="small" onClick={() => setValue(0)}>重置</Button>
        </Space>
    </RenderHighlight>
      </Card>
  )
}

function Unrelated() {
  useRenderTracker('Context: Unrelated')
  return (
    <RenderHighlight>
      <Typography.Text type="secondary">不消费任意 Context 的无关组件</Typography.Text>
    </RenderHighlight>
  )
}

function ModuleBSection() {
  useRenderTracker('Context: ModuleB Section')
  const { value } = useGlobal()
  return (
      <Card size="small" title="模块 B（只用 Global）">
        <Space direction="vertical" style={{ width: '100%' }}>
        <RenderHighlight>
              <Typography.Text type="secondary">该列所有消费者随 Global 变化一并重渲染（global={value}）。</Typography.Text>
        </RenderHighlight>
          <Row gutter={8}>
            <Col span={12}><ModuleBLeafGlobal /></Col>
            <Col span={12}><Unrelated /></Col>
          </Row>
        </Space>
      </Card>
  )
}

export default function ContextDemo() {
  useRenderTracker('Context: DemoRoot')
  return (
    <GlobalStateProvider>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Typography.Title level={4}>Context 分层 Provider 演示</Typography.Title>
        <Typography.Paragraph>
          Global 的任何变更会让所有消费它的组件重渲染；局部 Module 的变更只影响其 Provider 范围内的消费者。
        </Typography.Paragraph>
              <GlobalBanner />
        <Row gutter={[12, 12]}>
          <Col span={12}><ModuleASection /></Col>
          <Col span={12}><ModuleBSection /></Col>
        </Row>
        <CodeBlock code={`import { createContext, useContext, useMemo, useState } from 'react'

const GlobalState = createContext(null)
function GlobalStateProvider({ children }) {
  const [value, setValue] = useState(0)
  const api = useMemo(() => ({ value, setValue }), [value])
  return <GlobalState.Provider value={api}>{children}</GlobalState.Provider>
}

const ModuleState = createContext(null)
function ModuleStateProvider({ children }) {
  const [value, setValue] = useState(0)
  const api = useMemo(() => ({ value, setValue }), [value])
  return <ModuleState.Provider value={api}>{children}</ModuleState.Provider>
}

function useGlobal() { const ctx = useContext(GlobalState); if (!ctx) throw new Error(); return ctx }
function useModule() { const ctx = useContext(ModuleState); if (!ctx) throw new Error(); return ctx }

function GlobalBanner() {
  const { value, setValue } = useGlobal()
  return <div>global={value} <button onClick={() => setValue(value + 1)}>+1</button></div>
}

function ModuleALeaf() {
  const { value, setValue } = useModule()
  return <div>moduleA={value} <button onClick={() => setValue(value + 1)}>+1</button></div>
}

function ModuleASection() {
  const { value: globalValue } = useGlobal()
  return (
    <ModuleStateProvider>
      <div>global={globalValue} <ModuleALeaf/></div>
    </ModuleStateProvider>
  )
}

function ModuleBLeafGlobal() {
  const { value, setValue } = useGlobal()
  return <div>global={value} <button onClick={() => setValue(value + 1)}>+1</button></div>
}

function ModuleBSection() {
  const { value } = useGlobal()
  return <div>global={value} <ModuleBLeafGlobal/></div>
}`} />
        <Card size="small" title="说明与对照">
          <Typography.Paragraph>
            全局 Context 的值变化会让所有消费它的组件重渲染；局部 Provider 则仅影响其作用域内的消费者。将状态拆分并分层提供，可缩小更新范围、降低渲染成本。
          </Typography.Paragraph>
        </Card>
  
      </Space>
    </GlobalStateProvider>
  )
}
