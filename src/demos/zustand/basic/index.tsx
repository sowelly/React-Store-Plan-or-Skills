import React from 'react'
import { Card, Space, Typography } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { useBasicStore } from '@/store/basicStore'

export default function ZustandBasicPage() {
  useRenderTracker('Zustand: BasicPage')
  const count = useBasicStore((s) => s.count)
  const inc = useBasicStore.getState().inc
  const dec = useBasicStore.getState().dec
  const code = `import { create } from 'zustand'

type BasicState = { count: number; inc: () => void; dec: () => void }
export const useBasicStore = create<BasicState>(set => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 })),
  dec: () => set(s => ({ count: s.count - 1 })),
}))

// 业务函数：统一在此处理业务逻辑后再调用 store 动作
export function applyBusinessCountChange(flag: 'inc' | 'dec') {
  const { inc, dec } = useBasicStore.getState()
  // 例如：权限校验/埋点/数据清洗...
  if (flag === 'inc') inc()
  else dec()
}

// 页面使用示例：
function Page() {
  const count = useBasicStore(s => s.count)
  return (
    <div>
      <span>count={count}</span>
      <button onClick={() => applyBusinessCountChange('inc')}>+1</button>
      <button onClick={() => applyBusinessCountChange('dec')}>-1</button>
    </div>
  )
}`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Zustand 的基础使用</Typography.Title>
      <Typography.Paragraph>
        为什么引入 Zustand：跨组件共享状态在复杂应用中不可避免，直接使用 props 传递会导致层层钻探与整树渲染，使用 Context 充当全局 useState 则容易无限膨胀且难以精细订阅。Zustand 以“按需选择片段”的方式让组件仅在相关状态变化时渲染，同时通过动作与状态分离、切片化组织与中间件（persist、devtools 等）提升可维护性与可测性。
      </Typography.Paragraph>
      <Typography.Paragraph>
        典型收益：
        1）选择性订阅降低渲染范围；
        2）将业务逻辑封装为动作，统一入口便于埋点与校验；
        3）按领域拆分 store/slice，减少耦合；
        4）支持持久化与时间旅行等能力，便于调试与恢复。
      </Typography.Paragraph>
      <RenderHighlight>
        <Card size="small" title="计数">
          <Space>
            <Typography.Text>count={count}</Typography.Text>
            <Typography.Link onClick={() => inc()}>+1</Typography.Link>
            <Typography.Link onClick={() => dec()}>-1</Typography.Link>
          </Space>
        </Card>
      </RenderHighlight>
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>通过 hook 订阅所需片段（count），动作从 store 中获取，避免不必要渲染。</Typography.Paragraph>
      </Card>
      <CodeBlock code={code} />
    </Space>
  )
}
