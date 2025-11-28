import React from 'react'
import { Card, Col, Input, List, Row, Space, Typography, Button, Tabs } from 'antd'
import CodeBlock from '@/components/CodeBlock'
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
      <Tabs
        defaultActiveKey="slices"
        items={[
          { key: 'slices', label: 'Slice 结构', children: <SlicesTab/> },
          { key: 'derived', label: '派生数据', children: <DerivedTab/> },
        ]}
      />
    </Space>
  )
}

function SlicesTab() {
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
      </Row>
      <CodeBlock code={code} />
      <Card size="small" title="说明与对照">
        <Typography.Paragraph>各组件仅订阅所属 slice 片段，互不影响；组合 store 通过切片分治提升可维护性。</Typography.Paragraph>
      </Card>
      <BestPracticeCard />
    </Space>
  )
}

function DerivedTab() {
  const dcode = `// 组件内派生数据读取
const count = useChatStore(s => s.messages.length)
const last = useChatStore(s => s.messages.at(-1))
const summary = useChatStore(useShallow(s => ({ connected: s.connected, count: s.messages.length })))

// 局部筛选派生数据
const [filter, setFilter] = useState('')
const filtered = useChatStore(s => s.messages).filter(m => m.text.includes(filter))`
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Card size="small" title="派生数据（组件内计算）">
            <ChatDerivedPanel />
          </Card>
        </Col>
      </Row>
      <CodeBlock code={dcode} />
      <Card size="小" title="说明与对照">
        <Typography.Paragraph>派生数据在组件内计算，不存入 store。使用 useShallow 组合读取，避免不必要渲染。</Typography.Paragraph>
      </Card>
      <BestPracticeCard />
    </Space>
  )
}

function BestPracticeCard() {
  return (
    <Card size="small" title="最佳实践清单">
      <Typography.Paragraph>• 单字段订阅：组件仅选择所需字段，减少渲染范围与联动。</Typography.Paragraph>
      <Typography.Paragraph>• 组合读取用浅比较：当选择器返回对象/数组时，使用 useShallow 保持引用稳定，避免因新引用导致的无谓渲染。</Typography.Paragraph>
      <Typography.Paragraph>• 切片拆分：按领域（连接、消息、输入等）拆分 store，动作与状态聚合在所在域中，跨域通过上层组合。</Typography.Paragraph>
      <Typography.Paragraph>• 派生数据就地计算：如计数、最后一条消息、筛选结果在组件内计算，不写入 store，避免状态臃肿与非必要订阅。</Typography.Paragraph>
      <Typography.Paragraph>• 避免整库订阅：避免直接解构全库值，任意字段变化都会触发渲染，难以定位与优化。</Typography.Paragraph>
      <Typography.Paragraph>• 选择器稳定性：避免返回新对象引用；必要时以 useShallow 或等价函数保证一次渲染内快照一致。</Typography.Paragraph>
    </Card>
  )
}
