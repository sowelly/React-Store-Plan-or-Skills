import React from 'react'
import { Tabs } from 'antd'
import DynGlobalSimple from './Simple'
import DynGlobalOfficial from './Official'

export default function DynGlobalIndex() {
  return (
    <Tabs
      defaultActiveKey="simple"
      items={[
        { key: 'simple', label: '简易示例', children: <DynGlobalSimple /> },
        { key: 'official', label: '官方示例', children: <DynGlobalOfficial /> },
      ]}
    />
  )
}
