import React from 'react'
import useHydratedClient from '@/hooks/useHydratedClient'
import { Button, Card, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { usePersisted } from '@/store/persistedStore'

export default function PersistFlickerDemo() {
  useRenderTracker('Pitfalls: PersistFlickerDemo')
  const pcount = usePersisted((s: any) => s.pcount)
  const inc = usePersisted.getState().inc
  const hydratedFlag = usePersisted((s: any) => s.hydrated)
  const isHydrated = useHydratedClient()
  const sample = `import { persist, createJSONStorage } from 'zustand/middleware'
const usePersisted = create(persist((set, get) => ({
  pcount: 0,
  inc: () => set({ pcount: get().pcount + 1 }),
  hydrated: false,
  setHydrated: (v) => set({ hydrated: v }),
}), {
  name: 'persist-demo',
  storage: createJSONStorage(() => localStorage),
  onRehydrateStorage: () => (state) => { state?.setHydrated(true) }
}))

// 外部 Hook
export function useHydrated() { return usePersisted(s => s.hydrated) }

// 纯客户端 Hook（与 store 无关）
import { useEffect, useRef } from 'react'
export function useHydratedClient() {
  const hydrated = useRef(false)
  useEffect(() => { hydrated.current = true }, [])
  return hydrated.current
}

// 使用方式
const isHydrated = useHydratedClient()
if (!isHydrated) { return null /* 或 Skeleton */ }
return <ChatView />`
  return (
    <Space direction="vertical">
      <RenderHighlight>
        <Typography.Text>方案一（store 标记）：{hydratedFlag ? `count=${pcount}` : '恢复中...'}</Typography.Text>
      </RenderHighlight>
      <RenderHighlight>
        <Typography.Text>方案二（纯客户端 Hook）：{isHydrated ? '已就绪（渲染客户端视图）' : '恢复中...（可返回 Skeleton）'}</Typography.Text>
      </RenderHighlight>
      <Card size="small"><Button onClick={() => inc()}>+1</Button></Card>
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>
          持久化初次渲染为默认值，rehydrate 后更新可能产生闪烁；可通过 store 内 hydrated 标记或外部 useHydrated Hook 控制渲染时机，避免闪烁与未及时更新。
        </Typography.Paragraph>
      </Card>
      <CodeBlock code={sample} />
    </Space>
  )
}

