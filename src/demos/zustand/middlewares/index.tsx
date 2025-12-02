import React, { useMemo } from 'react'
import { Space, Typography, Tabs } from 'antd'
import { useRenderTracker } from '@/utils/renderLog'
import PersistTab from './persist'
import DevtoolsTab from './devtools'
import SubscribeWithSelectorTab from './subscribe-with-selector'

export default function ZustandMiddlewaresPage() {
  useRenderTracker('Zustand(Middlewares): PageRoot')
  const items = useMemo(() => ([
    { key: 'persist', label: '持久化（persist）', children: <PersistTab /> },
    { key: 'devtools', label: '调试（devtools）', children: <DevtoolsTab /> },
    { key: 'subsel', label: '选择订阅（subscribeWithSelector）', children: <SubscribeWithSelectorTab /> },
  ]), [])
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>常用中间件的使用</Typography.Title>
      <Tabs defaultActiveKey="persist" items={items} />
    </Space>
  )
}
