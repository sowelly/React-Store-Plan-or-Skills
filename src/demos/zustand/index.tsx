import React, { useMemo, useState } from 'react'
import { Typography, Space, Tabs } from 'antd'
import ZustandBasicPage from '@/demos/zustand/basic'
import ZustandModularPage from '@/demos/zustand/modular'
import ZustandSlicesPage from '@/demos/zustand/slices'
import ZustandPitfallsPage from '@/demos/zustand/pitfalls'

export default function ZustandHub() {
  const [key, setKey] = useState('slices')
  const items = useMemo(() => ([
    { key: 'basic', label: 'Zustand的基础使用', children: <ZustandBasicPage/> },
    { key: 'modular', label: '状态管理的模块化思路', children: <ZustandModularPage/> },
    { key: 'slices', label: 'Store Slice 模式（推荐）', children: <ZustandSlicesPage/> },
    { key: 'pitfalls', label: '常见陷阱', children: <ZustandPitfallsPage/> },
  ]), [])
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>Zustand的基础使用与常见陷阱</Typography.Title>
      <Typography.Paragraph>
       在复杂应用中，组件间不可避免会共享状态。为了避免 props 层层传递或 Context 无限膨胀，我们会使用第三方状态库来管理跨组件的全局状态。
      </Typography.Paragraph>
      <Tabs items={items} activeKey={key} onChange={setKey}/>
    </Space>
  )
}

