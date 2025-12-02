import React from 'react'
import { Button, Card, Space, Typography } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import CodeBlock from '@/components/CodeBlock'
import { create } from 'zustand'

type MapSetState = {
  map: Map<string, number>
  set: Set<string>
  mutateMapInPlace: (k: string) => void
  updateMapWithNewInstance: (k: string) => void
  mutateSetInPlace: (v: string) => void
  updateSetWithNewInstance: (v: string) => void
  reset: () => void
}

const useMapSetStore = create<MapSetState>()((set, get) => ({
  map: new Map<string, number>([['a', 0], ['b', 0]]),
  set: new Set<string>(['x']),
  mutateMapInPlace: (k) => {
    const m = get().map
    m.set(k, (m.get(k) ?? 0) + 1)
    set({ map: m })
  },
  updateMapWithNewInstance: (k) => {
    const m = new Map(get().map)
    m.set(k, (m.get(k) ?? 0) + 1)
    set({ map: m })
  },
  mutateSetInPlace: (v) => {
    const s = get().set
    if (s.has(v)) s.delete(v)
    else s.add(v)
    set({ set: s })
  },
  updateSetWithNewInstance: (v) => {
    const s = new Set(get().set)
    if (s.has(v)) s.delete(v)
    else s.add(v)
    set({ set: s })
  },
  reset: () => set({ map: new Map([['a', 0], ['b', 0]]), set: new Set(['x']) }),
}))

export default function MapSetPitfallsDemo() {
  useRenderTracker('Pitfalls: MapSetPitfallsDemo')
  const map = useMapSetStore((s) => s.map)
  const setVal = useMapSetStore((s) => s.set)
  const mutateMapInPlace = useMapSetStore.getState().mutateMapInPlace
  const updateMapWithNewInstance = useMapSetStore.getState().updateMapWithNewInstance
  const mutateSetInPlace = useMapSetStore.getState().mutateSetInPlace
  const updateSetWithNewInstance = useMapSetStore.getState().updateSetWithNewInstance
  const reset = useMapSetStore.getState().reset

  const entries = Array.from(map.entries()).map(([k, v]) => `${k}:${v}`).join(', ')
  const members = Array.from(setVal.values()).join(', ')

  const sample = `// Map/Set 是可变数据结构，应创建新实例以更新引用
const useMapSetStore = create(set => ({
  map: new Map([['a', 0]]),
  set: new Set(['x']),
  // 错误：就地修改并保留旧引用，订阅整个 map/set 的视图不会更新
  mutateMapInPlace: (k) => set(s => { s.map.set(k, (s.map.get(k) ?? 0) + 1); return { map: s.map } }),
  // 正确：复制后更新并设置新引用
  updateMapWithNewInstance: (k) => set(s => { const m = new Map(s.map); m.set(k, (m.get(k) ?? 0) + 1); return { map: m } }),
}))

// 订阅建议：订阅具体值（map.get('a')）而非整个 map，以减少无关重渲染`

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card size="small" title="Map：就地变更 vs 新实例">
        <Space direction="vertical">
          <RenderHighlight>
            <Typography.Text>map entries: {entries}</Typography.Text>
          </RenderHighlight>
          <Space>
            <Button onClick={() => mutateMapInPlace('a')}>就地修改 a</Button>
            <Button onClick={() => updateMapWithNewInstance('a')}>新实例更新 a</Button>
            <Button onClick={() => mutateMapInPlace('b')}>就地修改 b</Button>
            <Button onClick={() => updateMapWithNewInstance('b')}>新实例更新 b</Button>
          </Space>
        </Space>
      </Card>

      <Card size="小" title="Set：就地变更 vs 新实例">
        <Space direction="vertical">
          <RenderHighlight>
            <Typography.Text>set members: {members}</Typography.Text>
          </RenderHighlight>
          <Space>
            <Button onClick={() => mutateSetInPlace('x')}>就地切换 x</Button>
            <Button onClick={() => updateSetWithNewInstance('x')}>新实例切换 x</Button>
            <Button onClick={() => mutateSetInPlace('y')}>就地切换 y</Button>
            <Button onClick={() => updateSetWithNewInstance('y')}>新实例切换 y</Button>
          </Space>
        </Space>
      </Card>

      <Space>
        <Button onClick={() => reset()}>重置</Button>
      </Space>

      <Card size="small" title="说明与对照">
        <Typography.Paragraph>
          Map 与 Set 为可变结构，就地修改会保留旧引用；当视图订阅的是整个结构（而非具体值）时，将不会触发渲染。最佳实践是在更新时创建新实例并设置到 store，以改变引用并触发订阅者更新；或订阅具体值（例如 map.get('a')），减少无关重渲染。
        </Typography.Paragraph>
      </Card>

      <CodeBlock code={sample} />
    </Space>
  )
}

