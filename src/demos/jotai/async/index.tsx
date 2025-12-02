import React, { Suspense } from 'react'
import { Card, Space, Typography } from 'antd'
import CodeBlock from '@/components/CodeBlock'
import { RenderHighlight, useRenderTracker } from '@/utils/renderLog'
import { atom, useAtom, useAtomValue } from 'jotai'

const urlAtom = atom('https://jsonplaceholder.typicode.com/todos/1')
const dataAtom = atom(async (get) => {
  const url = get(urlAtom)
  const res = await fetch(url)
  return res.json() as Promise<{ id: number; title: string }>
})

function TodoView() {
  const todo = useAtomValue(dataAtom)
  return (
    <Space direction="vertical">
      <Typography.Text>title={todo.title}</Typography.Text>
      <Typography.Text type="secondary">id={todo.id}</Typography.Text>
    </Space>
  )
}

export default function JotaiAsyncPage() {
  useRenderTracker('Jotai: AsyncPage')
  const [url, setUrl] = useAtom(urlAtom)

  const code = `import { atom, useAtomValue } from 'jotai'

const urlAtom = atom('https://jsonplaceholder.typicode.com/todos/1')
const dataAtom = atom(async (get) => {
  const url = get(urlAtom)
  const res = await fetch(url)
  return res.json()
})

function TodoView() {
  const todo = useAtomValue(dataAtom)
  return <div>{todo.title}</div>
}

function Page() {
  return (
    <Suspense fallback={<span>loading...</span>}>
      <TodoView />
    </Suspense>
  )
}`

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>异步 Atom 与 Suspense</Typography.Title>
      <Typography.Paragraph>
        异步 Atom 的读函数可以返回 Promise，组件通过 Suspense 处理加载状态。派生异步 Atom 需使用 async/await 获取其依赖的值。
      </Typography.Paragraph>
      <RenderHighlight>
        <Card size="small" title="异步数据">
          <Suspense fallback={<Typography.Text>loading...</Typography.Text>}>
            <TodoView />
          </Suspense>
        </Card>
      </RenderHighlight>
      <Card size="small" title="当前请求 URL">
        <Space>
          <Typography.Text>{url}</Typography.Text>
          <Typography.Link onClick={() => setUrl('https://jsonplaceholder.typicode.com/todos/2')}>切换到 /todos/2</Typography.Link>
        </Space>
      </Card>
      <CodeBlock code={code} />
    </Space>
  )
}

