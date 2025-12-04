import React from 'react'
import { Card, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { useDirectStore } from '@/store/directStore'
import { useShallow } from '@/store/boundStore'

export default function ZustandSelectorFactoryPage() {
  useRenderTracker('Zustand: SelectorFactoryPage')
  const selectField = (k: 'x' | 'y' | 'tick') => (s: any) => s[k]
  const x = useDirectStore(selectField('x'))
  const y = useDirectStore(selectField('y'))
  const tick = useDirectStore(selectField('tick'))
  const incX = useDirectStore.getState().incX
  const incY = useDirectStore.getState().incY
  const incTick = useDirectStore.getState().incTick
  const pairSafe = useDirectStore(useShallow((s) => ({ x: s.x, y: s.y })))

  const sample = `// 选择器工厂（静态选择）
type DirectState = { x: number; y: number; tick: number }
export const selectDirect = <K extends keyof DirectState>(key: K) => (s: DirectState) => s[key]

// 使用方式（在组件中）
const x = useDirectStore(selectDirect('x'))
const y = useDirectStore(selectDirect('y'))
const t = useDirectStore(selectDirect('tick'))

// 组合选择建议配合浅比较
const pairSafe = useDirectStore(useShallow(s => ({ x: s.x, y: s.y })))`

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
       
        <Typography.Title  level={4}>工厂函数选择器模式（静态选择）</Typography.Title>
        <Typography.Paragraph>  
          在大型项目中，使用工厂函数生成选择器能统一选择语义与类型约束，减少重复代码与误用；单字段静态选择避免对象选择器带来的不稳定引用与多余渲染。
        </Typography.Paragraph>

      <Card size="small" title="单字段静态选择（x/y/tick）">
        <RenderHighlight>
          <Space direction="vertical">
            <Typography.Text>x={x} y={y} tick={tick}</Typography.Text>
            <Space>
              <Card size="small"><Typography.Link onClick={() => incX()}>X +1</Typography.Link></Card>
              <Card size="small"><Typography.Link onClick={() => incY()}>Y +1</Typography.Link></Card>
              <Card size="small"><Typography.Link onClick={() => incTick()}>Tick +1</Typography.Link></Card>
            </Space>
          </Space>
        </RenderHighlight>
      </Card>

      <Card size="small" title="组合选择配合浅比较（安全）">
        <RenderHighlight>
          <Typography.Text>pairSafe: x={pairSafe.x} y={pairSafe.y}</Typography.Text>
        </RenderHighlight>
      </Card>

      <Card size="small" title="说明与对照">
        <Typography.Paragraph>等价性：工厂选择器与传统 selector 在运行结果上等价，核心都是将选择器传给订阅以按需获取片段。</Typography.Paragraph>
        <Typography.Paragraph>类型推导：工厂选择器通过泛型约束（如 K extends keyof State）确保返回类型为 State[K]，增强自动补全与重构安全；传统内联 selector 在链式组合或封装时更易丢失精确类型。</Typography.Paragraph>
        <Typography.Paragraph>可复用性：统一的工厂函数可在全局复用并集中规范选择语义，便于抽取常用选择器与测试覆盖，减少重复代码与误用。</Typography.Paragraph>
        <Typography.Paragraph>渲染与一致性：单字段静态选择避免对象选择器每次返回新引用导致不必要渲染与快照不一致；组合选择需配合 useShallow 保持稳定，确保一次渲染内快照一致。</Typography.Paragraph>
        <Typography.Paragraph>规范与规模化：在大型项目中通过工厂选择器限制可选键集合并固化订阅粒度，减少订阅过宽与动态选择带来的隐患，提升性能与可维护性。</Typography.Paragraph>
      </Card>

      <CodeBlock code={sample} />
    </Space>
  )
}
