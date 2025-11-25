import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// 引入 antd v5 的样式重置，确保基础元素风格一致
import 'antd/dist/reset.css'
import { ConfigProvider, App as AntdApp } from 'antd'
import App from '@/App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/*
      使用 ConfigProvider 包裹应用，后续可在此集中配置主题与组件行为。
      这里额外包一层 AntdApp，细粒度控制基础样式和消息、通知容器。
    */}
    <ConfigProvider>
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
