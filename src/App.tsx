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
import ZustandSelectorFactoryPage from '@/demos/zustand/selector-factory'
import ZustandMiddlewaresPage from '@/demos/zustand/middlewares'
import ZustandVanillaFactoryPage from '@/demos/zustand/vanilla-factory'
import ZustandGlobalScopeDemoPageA from '@/demos/global-scope-demo/pageA'
import {globalStore, selectDirect} from './store/globalStore'


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
    | 'zustand-vanilla-factory'
    | 'zustand-global-scope-demo'
    | 'zustand-middlewares'


const menuItems: MenuProps['items'] = [
    {key: 'props', label: 'Props 传递 / 属性钻探'},
    {
        key: 'context',
        label: '引入 Context',
        children: [
            {key: 'context-global', label: '将 Context 当作全局 useState'},
            {key: 'context-mix-local', label: '多 Context + 本地状态混用混乱'},
            {key: 'context-loop-trap', label: '状态循环陷阱'},
            {key: 'context-unmemoized', label: 'Provider 值未缓存导致重渲染'},
        ],
    },
    {
        key: 'zustand',
        label: '引入 Zustand',
        children: [
            {key: 'zustand-basic', label: 'Zustand的基础使用'},
            {key: 'zustand-modular', label: '状态管理的模块化思路'},
            {key: 'zustand-slices', label: 'Store Slice 模式（推荐）'},
            {key: 'zustand-selector-factory', label: '工厂函数选择器模式（静态选择）'},
            {key: 'zustand-vanilla-factory', label: '工厂模式创建状态管理（局部/全局）'},
            {key: 'zustand-middlewares', label: '常用中间件的使用'},
            {key: 'zustand-pitfalls', label: '常见陷阱'},
        ],
    },
    {key: 'zustand-global-scope-demo', label: '状态管理 Demo'},
]

function App() {
    const [active, setActive] = useState<DemoKey>('props')
    const [collapsed, setCollapsed] = useState(false)
    const userName = globalStore(selectDirect('userName'))

    const AppHeader = () => (
        <Header style={{background: '#abcdebff', padding: '0 24px'}}>
            <Typography.Title level={4} style={{color: '#fff', margin: 0, textAlign: 'right'}}>
                userName：{userName}
            </Typography.Title>
        </Header>
    )

    const content = useMemo(() => {
        switch (active) {
            case 'props':
                return <PropsDrillingDemo/>
            case 'context-global':
                return <ContextGlobalUseStatePage/>
            case 'context-mix-local':
                return <ContextDemo/>
            case 'context-loop-trap':
                return <ContextLoopTrapPage/>
            case 'context-unmemoized':
                return <ContextUnmemoizedProviderPage/>
            case 'zustand-basic':
                return <ZustandBasicPage/>
            case 'zustand-modular':
                return <ZustandModularPage/>
            case 'zustand-slices':
                return <ZustandSlicesPage/>
            case 'zustand-pitfalls':
                return <ZustandPitfallsPage/>
            case 'zustand-selector-factory':
                return <ZustandSelectorFactoryPage/>
            case 'zustand-vanilla-factory':
                return <ZustandVanillaFactoryPage/>
            case 'zustand-global-scope-demo':
                return <ZustandGlobalScopeDemoPageA/>
            case 'zustand-middlewares':
                return <ZustandMiddlewaresPage/>
            default:
                return null
        }
    }, [active])

    return (
        <Layout style={{height: '100vh'}}>
            <Sider width={240} theme="dark" breakpoint="lg" collapsedWidth={56} collapsible collapsed={collapsed}
                   onCollapse={(val) => setCollapsed(val)}>
                <div style={{padding: '12px 16px'}}>
                    <Typography.Title level={4} style={{
                        color: '#fff',
                        margin: 0
                    }}>{collapsed ? 'RSH' : 'react store hooks plan'}</Typography.Title>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={menuItems}
                    selectedKeys={[active]}
                    defaultOpenKeys={["context", "zustand"]}
                    onClick={(info) => {
                        if (info.key === 'zustand') return
                        if (info.key === 'context') return
                        setActive(info.key as DemoKey)
                    }}
                />
            </Sider>
            <Layout>
                <Content style={{padding: 24, background: '#fff', overflow: 'auto'}}>
                    <RenderLogProvider>
                        <Row gutter={16}>
                            <Col xs={24} lg={16}>
                                {content}
                            </Col>
                            <Col xs={24} lg={8}>
                                <div style={{position: 'sticky', top: 24}}>
                                    <Card size="small" styles={{body: {height: 780, overflow: 'hidden', padding: 0}}}>
                                        <RenderLogPanel title="本演示渲染更新记录"/>
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
