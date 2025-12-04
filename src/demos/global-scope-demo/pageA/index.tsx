import {globalStore, selectDirect} from "@/store/globalStore";
import {PageAProvider, usePageASelector} from "./store";
import {Button, Card, Form, type FormProps, Input, Masonry, Radio, Space, Table, Tabs, Typography} from "antd";
import React, {useMemo, useState} from "react";


const columns = [
    {
        key: "a",
        title: "a",
        dataIndex: "a",
    }, {
        key: "b",
        title: "b",
        dataIndex: "b",
    },
]

const TABContent = () => {
    const data = usePageASelector('data')
    const setData = usePageASelector('setData')
    console.log('data', data)
    return (
        <Space orientation="vertical" size={12} style={{width: '100%'}}>
            <Button onClick={() => setData()}>新增一行</Button>
            <Table columns={columns} dataSource={data} rowKey={(_, idx) => String(idx ?? 0)}/>
        </Space>
    )
}
type LayoutType = Parameters<typeof Form>[0]['layout'];

const TABContent2 = () => {
    const formData = usePageASelector('formData')
    const submitForm = usePageASelector('submitForm')
    const [form] = Form.useForm();
    const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');

    const onFormLayoutChange: FormProps<any>['onValuesChange'] = ({layout}) => {
        setFormLayout(layout);
    };


    const handleSubmit = (data: any) => {
        console.log('data', data)
        submitForm(data);
    }

    return (
        <>
            <Card title={'form val'}>
                <div> formLayout: {formLayout}                </div>
                <div> fieldA: {formData.fieldA}                </div>
                <div> fieldB: {formData.fieldB}               </div>
            </Card>
            <Form
                layout={formLayout}
                form={form}
                onFinish={handleSubmit}
                initialValues={{layout: formLayout}}
                onValuesChange={onFormLayoutChange}
                style={{maxWidth: formLayout === 'inline' ? 'none' : 600}}
            >
                <Form.Item label="Form Layout" name="layout">
                    <Radio.Group value={formLayout}>
                        <Radio.Button value="horizontal">Horizontal</Radio.Button>
                        <Radio.Button value="vertical">Vertical</Radio.Button>
                        <Radio.Button value="inline">Inline</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Field A" name="fieldA">
                    <Input placeholder="input placeholder"/>
                </Form.Item>
                <Form.Item label="Field B" name="fieldB">
                    <Input placeholder="input placeholder"/>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>

        </>)
}

const TABContent3 = () => {
    const imageList = usePageASelector('imageList')
    const setImageList = usePageASelector('setImageList')
    console.log('data', imageList)
    return (
        <Space orientation="vertical" size={12} style={{width: '100%'}}>
            <Button onClick={() => setImageList()}>新增一组图片</Button>
            <Masonry
                columns={4}
                gutter={16}
                items={imageList.map((img, index) => ({
                    key: `item-${index}`,
                    data: img,
                }))}
                itemRender={({data}) => (
                    <img src={`${data}?w=523&auto=format`} alt="sample" style={{width: '100%'}}/>
                )}
            />
        </Space>
    )
}

export default function PageA() {
    const username = globalStore(selectDirect('userName'))

    const items = useMemo(() => ([
        {key: 'tab1', label: 'TAB 1', children: <TABContent/>},
        {key: 'tab2', label: 'TAB 2', children: <TABContent2/>},
        {key: 'tab3', label: 'TAB 3（non-page-global）', children: <TABContent3/>},
    ]), [])

    return (
        <PageAProvider>
            <Space orientation="vertical" size={16} style={{width: '100%'}}>
                <Card size={"small"} title={'页面说明'}>
                    <Typography.Paragraph>
                        本页演示使用 <Typography.Text code>Zustand</Typography.Text> 进行状态管理：
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        - 全局状态通过 <Typography.Text
                        code>globalStore</Typography.Text> 提供，例如显示 <Typography.Text
                        code>userName</Typography.Text>。
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        - 页面级状态通过 <Typography.Text code>PageAProvider</Typography.Text> 提供的上下文
                        Store（基于 <Typography.Text code>createContextStore</Typography.Text>）进行隔离，Tabs
                        内的数据使用slice方案进行切分避免store臃肿。
                    </Typography.Paragraph>
                </Card>
                <Card size={"small"} title={'global username'}> {username}</Card>

                <Tabs defaultActiveKey="persist" items={items}/>
            </Space>
        </PageAProvider>
    )
}


