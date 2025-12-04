import React from 'react'
import { Card, Space, Typography, Button,Row,Col } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type PersistState = { pcount: number; inc: () => void; reset: () => void; hydrated: boolean; setHydrated: (v: boolean) => void }
const usePersistStore = create<PersistState>()(
  persist(
    (set, get) => ({
      pcount: 0,
      inc: () => set({ pcount: get().pcount + 1 }),
      reset: () => set({ pcount: 0 }),
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: 'zustand-middlewares-persist',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (s) => s?.setHydrated(true),
    },
  ),
)

export default function PersistTab() {
  useRenderTracker('Zustand(Middlewares): PersistTab')
  const pcount = usePersistStore((s) => s.pcount)
  const hydrated = usePersistStore((s) => s.hydrated)
  const inc = usePersistStore.getState().inc
  const reset = usePersistStore.getState().reset
  const setHydrated = usePersistStore.getState().setHydrated
  const storageKey = 'zustand-middlewares-persist'
  const storageValue = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
  const code = `import { persist, createJSONStorage } from 'zustand/middleware'
const useStore = create(
  persist(
    (set, get) => ({
      pcount: 0,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      inc: () => set({ pcount: get().pcount + 1 }),
    }),
    {
      name: 'key',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (s) => s?.setHydrated(true),
    },
  ),
)`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title="持久化示例">
        <RenderHighlight>
          <Row>
            <Col>
              <Typography.Text>pcount={pcount}</Typography.Text>
            </Col>  
          </Row>
          <Row>
            <Col>
              <Typography.Text type="secondary">{storageKey}</Typography.Text>
              <Typography.Text type="secondary">{String(storageValue)}</Typography.Text>
              <Typography.Text type="secondary">hydrated={String(hydrated)}</Typography.Text>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col >
              <Button onClick={() => inc()}>+1</Button>
            </Col>
            <Col >
              <Button onClick={() => reset()}>重置</Button>
            </Col>
            <Col >
              <Button onClick={() => setHydrated(true)}>hydrated=true</Button>
            </Col>
            <Col >
              <Button onClick={() => setHydrated(false)}>hydrated=false</Button>
            </Col>
            <Col >
              <Button onClick={() => { localStorage.removeItem('zustand-middlewares-persist'); reset() }}>清理本地存储</Button>
            </Col>
          </Row>
        </RenderHighlight>
      </Card>
      
      <CodeBlock code={code} />
      
      <Card size="small" title="说明">
        <Typography.Paragraph>使用 JSONStorage 将状态保存到 localStorage，并在恢复后标记 hydrated。</Typography.Paragraph>
      </Card>
    </Space>
  )
}
