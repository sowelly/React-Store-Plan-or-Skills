import React from 'react'
import { Card, Space, Typography } from 'antd'
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
      <Card size="small" title="代码示例">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', wordBreak: 'break-word' }}><code>{code}</code></pre>
      </Card>
    </Space>
  )
}
