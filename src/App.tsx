import './App.css'
import React, {useMemo, useState} from 'react'
import {Card, Col, Layout, Menu, Row, Typography} from 'antd'
import type {MenuProps} from 'antd'
import {RenderLogProvider, RenderLogPanel} from '@/utils/renderLog'
import PropsDrillingDemo from '@/demos/props'
import ContextDemo from '@/demos/context'
import ZustandHub from '@/demos/zustand'

const {Sider, Content, Header} = Layout

type DemoKey = 'props' | 'context' | 'zustand'

const menuItems: MenuProps['items'] = [
    {key: 'props', label: 'Props 传递 / 属性钻探'},
    {key: 'context', label: 'Context 全局 useState'},
    {key: 'zustand', label: 'Zustand 方案'},
]

function App() {
    const [active, setActive] = useState<DemoKey>('props')

    const content = useMemo(() => {
        switch (active) {
            case 'props':
                return <PropsDrillingDemo/>
            case 'context':
                return <ContextDemo/>
            case 'zustand':
                return <ZustandHub/>
            default:
                return null
        }
    }, [active])

    return (
        <Layout style={{ height: '100vh' }}>
            <Sider width={240} theme="dark" breakpoint="lg" collapsedWidth={56}>
                <div style={{ padding: '12px 16px' }}>
                    <Typography.Title level={4} style={{ color: '#fff', margin: 0 }}>状态方案演示</Typography.Title>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    items={menuItems}
                    selectedKeys={[active]}
                    onClick={(info) => setActive(info.key as DemoKey)}
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
                                    <Card size="small" bodyStyle={{ height: 'calc(100vh - 180px)', overflow: 'hidden', padding: 0 }}>
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
