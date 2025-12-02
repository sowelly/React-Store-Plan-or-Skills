import './App.css'
import React, {useMemo, useState} from 'react'
import {Card, Col, Layout, Menu, Row, Typography} from 'antd'
import type {MenuProps} from 'antd'
import {RenderLogProvider, RenderLogPanel} from '@/utils/renderLog'
import PropsDrillingDemo from '@/demos/props'
import ContextDemo from '@/demos/context'
import ContextGlobalUseStatePage from '@/demos/context/global-usestate'
import ContextLoopTrapPage from '@/demos/context/loop-trap'
import ContextUnmemoizedProviderPage from '@/demos/context/provider-unmemoized'
import ZustandBasicPage from '@/demos/zustand/basic'
import ZustandModularPage from '@/demos/zustand/modular'
import ZustandSlicesPage from '@/demos/zustand/slices'
import ZustandPitfallsPage from '@/demos/zustand/pitfalls'
import HookMultiCallScopePage from '@/demos/hooks/multi-call-scope'
import ZustandSelectorFactoryPage from '@/demos/zustand/selector-factory'
import JotaiBasicPage from '@/demos/jotai/basic'
import JotaiDerivedPage from '@/demos/jotai/derived'
import JotaiAsyncPage from '@/demos/jotai/async'

const {Sider, Content, Header} = Layout

type DemoKey =
    | 'props'
    | 'context-global'
    | 'context-mix-local'
    | 'context-loop-trap'
    | 'context-unmemoized'
    | 'zustand-basic'
    | 'zustand-modular'
    | 'zustand-slices'
    | 'zustand-pitfalls'
    | 'zustand-selector-factory'
    | 'hook-multi-call-scope'
    | 'jotai-basic'
    | 'jotai-derived'
    | 'jotai-async'

const menuItems: MenuProps['items'] = [
    { key: 'props', label: 'Props 传递 / 属性钻探' },
    {
        key: 'context',
        label: '引入 Context',
        children: [
            { key: 'context-global', label: '将 Context 当作全局 useState' },
            { key: 'context-mix-local', label: '多 Context + 本地状态混用混乱' },
            { key: 'context-loop-trap', label: '状态循环陷阱' },
            { key: 'context-unmemoized', label: 'Provider 值未缓存导致重渲染' },
        ],
    },
    {
        key: 'zustand',
        label: '引入 Zustand',
        children: [
            { key: 'zustand-basic', label: 'Zustand的基础使用' },
            { key: 'zustand-modular', label: '状态管理的模块化思路' },
            { key: 'zustand-slices', label: 'Store Slice 模式（推荐）' },
            { key: 'zustand-selector-factory', label: '工厂函数选择器模式（静态选择）' },
            { key: 'zustand-pitfalls', label: '常见陷阱' },
        ],
    },
    {
        key: 'jotai',
        label: '引入 Jotai',
        children: [
            { key: 'jotai-basic', label: 'Jotai 的基础使用' },
            { key: 'jotai-derived', label: '派生 Atom（计算状态）' },
            { key: 'jotai-async', label: '异步 Atom 与 Suspense' },
        ],
    },
    { key: 'hook-multi-call-scope', label: 'Hook 多次调用的独立状态环境' },
]

function App() {
    const [active, setActive] = useState<DemoKey>('props')

    const content = useMemo(() => {
        switch (active) {
            case 'props':
                return <PropsDrillingDemo />
            case 'context-global':
                return <ContextGlobalUseStatePage />
            case 'context-mix-local':
                return <ContextDemo />
            case 'context-loop-trap':
                return <ContextLoopTrapPage />
            case 'context-unmemoized':
                return <ContextUnmemoizedProviderPage />
            case 'zustand-basic':
                return <ZustandBasicPage />
            case 'zustand-modular':
                return <ZustandModularPage />
            case 'zustand-slices':
                return <ZustandSlicesPage />
            case 'zustand-pitfalls':
                return <ZustandPitfallsPage />
            case 'zustand-selector-factory':
                return <ZustandSelectorFactoryPage />
            case 'hook-multi-call-scope':
                return <HookMultiCallScopePage />
            case 'jotai-basic':
                return <JotaiBasicPage />
            case 'jotai-derived':
                return <JotaiDerivedPage />
            case 'jotai-async':
                return <JotaiAsyncPage />
            default:
                return null
        }
    }, [active])

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width={240} theme="dark" breakpoint="lg" collapsedWidth={56}>
                <div style={{ padding: '12px 16px' }}>
                    <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>react store hooks plan</Typography.Title>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={menuItems}
                    selectedKeys={[active]}
                    defaultOpenKeys={["context", "zustand", "jotai"]}
                    onClick={(info) => {
                        if (info.key === 'zustand') return
                        if (info.key === 'context') return
                        setActive(info.key as DemoKey)
                    }}
                />
            </Sider>
            <Layout>
                {/* <Header style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        {active === 'props' && 'Props 传递与属性钻探影响'}
                        {active === 'context' && 'Context 当作全局 useState 的影响'}
                        {active === 'zustand' && 'Zustand 切片管理与选择性订阅'}
                    </Typography.Title>
                </Header> */}
                <Content style={{ padding: 24, background: '#fff', overflow: 'auto' }}>
                    <RenderLogProvider>
                        <Row gutter={16}>
                            <Col xs={24} lg={16}>
                                {content}
                            </Col>
                            <Col xs={24} lg={8}>
                                <div style={{ position: 'sticky', top: 24 }}>
                                    <Card size="small" styles={{ body: { height: 380, overflow: 'hidden', padding: 0 } }}>
                                        <RenderLogPanel title="本演示渲染更新记录" />
                                    </Card>
                                </div>
                            </Col>
                        </Row>
                    </RenderLogProvider>
                </Content>
            </Layout>
        </Layout>
    )
}

export default App
