import React from 'react'
import { Card, Space, Typography, Tabs } from 'antd'
import { useRenderTracker } from '@/utils/renderLog'
import GlobalVanillaIndex from './global'
import DynGlobalIndex from './dyn-global'
import ScopedIndex from './scoped'
import DynScopedIndex from './dyn-scoped'

export default function ZustandVanillaFactoryPage() {
  useRenderTracker('ZustandVanillaFactory: PageRoot')
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title level={4}>工厂模式创建状态管理（vanilla 分类演示）</Typography.Title>
         <Typography.Paragraph>
          以下四类演示展示了 vanilla 风格 store 的不同作用域与动态性组合；同时，等价的 vanilla 接口可结合 useStoreWithEqualityFn 与浅比较实现更细粒度的重渲染控制。
        </Typography.Paragraph>
      <Tabs
        defaultActiveKey="global"
        items={[
          { key: 'global', label: 'Global  ', children: <GlobalVanillaIndex /> },
          { key: 'dyn-global', label: 'Dynamic global  ', children: <DynGlobalIndex /> },
          { key: 'scoped', label: 'Scoped (non-global)  ', children: <ScopedIndex /> },
          { key: 'dyn-scoped', label: 'Dynamic scoped (non-global)  ', children: <DynScopedIndex /> },
        ]}
      />
    </Space>
  )
}
