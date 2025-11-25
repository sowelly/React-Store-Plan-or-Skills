import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Divider, List, Space, Typography } from 'antd'
import { gsap } from 'gsap'

type LogItem = {
  id: number
  time: string
  message: string
}

type Listener = (logs: LogItem[]) => void

type RenderLogAPI = {
  addLog: (msg: string) => void
  clear: () => void
  subscribe: (listener: Listener) => () => void
}

const RenderLogContext = createContext<RenderLogAPI | null>(null)

export function RenderLogProvider({ children }: { children: React.ReactNode }) {
  const logsRef = useRef<LogItem[]>([])
  const idRef = useRef(0)
  const listenersRef = useRef<Set<Listener>>(new Set())

  const emit = (nextLogs: LogItem[]) => {
    listenersRef.current.forEach((fn) => {
      try {
        fn(nextLogs)
      } catch (e) {
        console.warn('RenderLog listener error:', e)
      }
    })
  }

  const addLog = (message: string) => {
    idRef.current += 1
    const id = idRef.current
    const time = new Date().toLocaleTimeString()
    console.log(`[渲染日志] ${time} - ${message}`)
    logsRef.current = [...logsRef.current, { id, time, message }]
    emit(logsRef.current)
  }

  const clear = () => {
    logsRef.current = []
    emit(logsRef.current)
  }

  const subscribe = (listener: Listener) => {
    listenersRef.current.add(listener)
    // 立即推送一次以同步当前日志
    listener(logsRef.current)
    return () => {
      listenersRef.current.delete(listener)
    }
  }

  const api = useMemo<RenderLogAPI>(() => ({ addLog, clear, subscribe }), [])

  return <RenderLogContext.Provider value={api}>{children}</RenderLogContext.Provider>
}

function useRenderLogAPI() {
  const ctx = useContext(RenderLogContext)
  if (!ctx) throw new Error('useRenderLogAPI must be used within RenderLogProvider')
  return ctx
}

// 在组件内调用以记录每次渲染（不会触发 Provider 重渲染）
export function useRenderTracker(name: string) {
  const { addLog } = useRenderLogAPI()
  const renderCountRef = useRef(0)
  renderCountRef.current += 1
  useEffect(() => {
    addLog(`${name} 发生渲染 #${renderCountRef.current}`)
  })
}

export function RenderLogPanel({ title = '组件渲染日志' }: { title?: string }) {
  const { subscribe, clear } = useRenderLogAPI()
  const [logs, setLogs] = useState<LogItem[]>([])

  useEffect(() => {
    return subscribe(setLogs)
  }, [subscribe])

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between', padding: 8 }}>
          <Typography.Text strong>{title}</Typography.Text>
          <Button size="small" onClick={() => { clear(); setLogs([]) }}>清空日志</Button>
        </Space>
        <Divider style={{ margin: '8px 0' }} />
      </div>
      <div style={{ overflow: 'auto', flex: 1 }}>
        <List
          size="small"
          bordered
          dataSource={logs}
          renderItem={(item) => (
            <List.Item>
              <Space>
                <Typography.Text type="secondary">{item.time}</Typography.Text>
                <Typography.Text>{item.message}</Typography.Text>
              </Space>
            </List.Item>
          )}
        />
      </div>
    </div>
  )
}

export function RenderHighlight({ children, color = 'rgba(255, 165, 0, 0.35)' }: { children: React.ReactNode, color?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!ref.current) return
    gsap.killTweensOf(ref.current)
    gsap.fromTo(ref.current, { backgroundColor: color }, { backgroundColor: 'transparent', duration: 0.6, ease: 'power2.out' })
  })
  return <div ref={ref}>{children}</div>
}
