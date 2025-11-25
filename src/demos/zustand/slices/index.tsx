import React from 'react'
import { Card, Col, Input, List, Row, Space, Typography, Button } from 'antd'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { useChatStore } from '@/store/chat/store'
import { useShallow } from '@/store/boundStore'

function ChatConnectionPanel() {
  useRenderTracker('Chat: ConnectionPanel')
  const connected = useChatStore((s) => s.connected)
  const connect = useChatStore((s) => s.connect)
  const disconnect = useChatStore((s) => s.disconnect)
  const toggle = useChatStore((s) => s.toggle)
  return (
    <RenderHighlight>
      <Space>
        <Typography.Text>status={connected ? 'connected' : 'disconnected'}</Typography.Text>
        <Button size="small" onClick={connect}>连接</Button>
        <Button size="small" onClick={disconnect}>断开</Button>
        <Button size="small" onClick={toggle}>切换</Button>
      </Space>
    </RenderHighlight>
  )
}

function ChatMessagesPanel() {
  useRenderTracker('Chat: MessagesPanel')
  const messages = useChatStore((s) => s.messages)
  return (
    <RenderHighlight>
      <List
        size="small"
        bordered
        dataSource={messages}
        renderItem={(m) => (
          <List.Item>
            <Space>
              <Typography.Text>[{m.sender}]</Typography.Text>
              <Typography.Text>{m.text}</Typography.Text>
            </Space>
          </List.Item>
        )}
      />
    </RenderHighlight>
  )
}

function ChatInputPanel() {
  useRenderTracker('Chat: InputPanel')
  const input = useChatStore((s) => s.input)
  const setInput = useChatStore((s) => s.setInput)
  const send = useChatStore((s) => s.send)
  return (
    <RenderHighlight>
      <Space>
        <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="输入消息" />
        <Button size="small" type="primary" onClick={send}>发送</Button>
      </Space>
    </RenderHighlight>
  )
}

function ChatSummary() {
  useRenderTracker('Chat: Summary')
  const { connected, count } = useChatStore(
    useShallow((s) => ({ connected: s.connected, count: s.messages.length })),
  )
  return (
    <RenderHighlight>
      <Typography.Text>summary: status={connected ? 'connected' : 'disconnected'} messages={count}</Typography.Text>
    </RenderHighlight>
  )
}

function ChatDerivedPanel() {
  useRenderTracker('Chat: DerivedPanel')
  const count = useChatStore((s) => s.messages.length)
  const last = useChatStore((s) => s.messages[s.messages.length - 1] || null)
  const [filter, setFilter] = React.useState('')
  const filtered = useChatStore((s) => s.messages).filter((m) => m.text.toLowerCase().includes(filter.toLowerCase()))
  const filteredPreview = filtered[0]?.text || '无'
  return (
    <RenderHighlight>
      <Space direction="vertical">
        <Typography.Text>派生数据：消息总数={count}</Typography.Text>
        <Typography.Text>最后一条消息={last ? last.text : '无'}</Typography.Text>
        <Space>
          <Input size="small" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="筛选文本" />
          <Typography.Text>筛选匹配条数={filtered.length}</Typography.Text>
          <Typography.Text>示例={filteredPreview}</Typography.Text>
        </Space>
      </Space>
    </RenderHighlight>
  )
}

export default function ZustandSlicesPage() {
  useRenderTracker('Chat: SlicesRoot')
  const code = `// connectionSlice.ts
type ConnectionSlice = {
  connected: boolean
  connect: () => void
  disconnect: () => void
  toggle: () => void
}
export const createConnectionSlice = (set, get) => ({
  connected: false,
  connect: () => set({ connected: true }),
  disconnect: () => set({ connected: false }),
  toggle: () => set(s => ({ connected: !s.connected })),
})

// messageSlice.ts
type ChatMessage = { id: number; text: string; sender: 'me' | 'system'; time: number }
type MessageSlice = {
  messages: ChatMessage[]
  addMessage: (text: string, sender?: 'me' | 'system') => void
  clearMessages: () => void
}
export const createMessageSlice = (set, get) => ({
  messages: [],
  addMessage: (text, sender = 'me') => set(s => ({
    messages: [...s.messages, { id: Date.now(), text, sender, time: Date.now() }],
  })),
  clearMessages: () => set({ messages: [] }),
})

// inputSlice.ts
type InputSlice = { input: string; setInput: (v: string) => void; send: () => void }
export const createInputSlice = (set, get) => ({
  input: '',
  setInput: v => set({ input: v }),
  send: () => { const text = get().input; if (!text.trim()) return; get().addMessage(text, 'me'); set({ input: '' }) },
})

// store.ts（组合）
type ChatStore = ConnectionSlice & MessageSlice & InputSlice
export const useChatStore = create<ChatStore>()((set, get) => ({
  ...createConnectionSlice(set, get),
  ...createMessageSlice(set, get),
  ...createInputSlice(set, get),
}))`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Store Slice</Typography.Title>
      <Typography.Paragraph style={{ color: '#666' }}>把“一个全局 Store”拆成多个按功能管理的小模块，再在最终 Store 中组合起来。</Typography.Paragraph>
      <Row gutter={[12, 12]}>
        <Col span={12}>
          <Card size="small" title="连接状态">
            <ChatConnectionPanel />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="汇总">
            <ChatSummary />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="消息列表">
            <ChatMessagesPanel />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="输入与发送">
            <ChatInputPanel />
          </Card>
        </Col>
        <Col span={24}>
          <Card size="small" title="派生数据（组件内计算）">
            <ChatDerivedPanel />
          </Card>
        </Col>
      </Row>
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>
          组件按需订阅：连接面板订阅连接片段；消息列表订阅消息片段；输入面板订阅输入片段。组合读取用 useShallow。派生数据（如消息总数、最后一条消息）在组件内计算，不存入 store，避免无关渲染与状态臃肿。
        </Typography.Paragraph>
      </Card>
      <Card size="small" title="代码示例">
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', overflow: 'auto', wordBreak: 'break-word' }}>
          <code>{code + "\n\n// 组件内派生数据读取\nconst count = useChatStore(s => s.messages.length)\nconst last = useChatStore(s => s.messages.at(-1))\nconst summary = useChatStore(useShallow(s => ({ connected: s.connected, count: s.messages.length })))\n\n// 局部筛选派生数据\nconst [filter, setFilter] = useState('')\nconst filtered = useChatStore(s => s.messages).filter(m => m.text.includes(filter))"}</code>
        </pre>
      </Card>
    </Space>
  )
}
