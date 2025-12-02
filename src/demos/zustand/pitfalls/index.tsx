import React, { useMemo, useState } from 'react'
import { Space, Tabs, Typography } from 'antd'
import { useRenderTracker } from '@/utils/renderLog'
import CombinedSubscriptionsDemo from './CombinedSubscriptionsDemo'
import PersistFlickerDemo from './PersistFlickerDemo'
import MapSetPitfallsDemo from './MapSetPitfallsDemo'

 



export default function ZustandPitfallsHub() {
  useRenderTracker('Pitfalls: Hub')
  const [key, setKey] = useState('pit-subscriptions')
  const items = useMemo(() => ([
    { key: 'pit-subscriptions', label: '联动与订阅策略对比', children: <CombinedSubscriptionsDemo/> },
    { key: 'pit-1.5', label: 'persist 初始闪烁', children: <PersistFlickerDemo/> },
    { key: 'pit-map-set', label: 'Map/Set 可变结构更新陷阱', children: <MapSetPitfallsDemo/> },
  ]), [])
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
       <Typography.Title level={4}>Zustand 常见渲染与数据陷阱</Typography.Title>
        <Typography.Paragraph>
          Zustand 是轻量强大的，但也因此更容易被误用。
        </Typography.Paragraph>
      <Tabs items={items} activeKey={key} onChange={setKey}/>
    </Space>
  )
}





