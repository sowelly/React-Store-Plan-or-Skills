import { Tabs } from 'antd'
import DynScopedSimple from './Simple'
import DynScopedOfficial from './Official'

export default function DynScopedIndex() {
  return (
    <Tabs
      defaultActiveKey="simple"
      items={[
        { key: 'simple', label: '简易示例', children: <DynScopedSimple /> },
        { key: 'official', label: '官方示例', children: <DynScopedOfficial /> },
      ]}
    />
  )
}
