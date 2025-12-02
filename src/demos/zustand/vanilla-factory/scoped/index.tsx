import React from 'react'
import { Tabs } from 'antd'
import ScopedSimple from './Simple'
import ScopedOfficial from './Official'

export default function ScopedIndex() {
  return (
    <Tabs
      defaultActiveKey="simple"
      items={[
        { key: 'simple', label: '简易示例', children: <ScopedSimple /> },
        { key: 'official', label: '官方示例', children: <ScopedOfficial /> },
      ]}
    />
  )
}
