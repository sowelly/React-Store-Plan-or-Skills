import {globalStore, selectDirect} from "@/store/globalStore";
import {PageAProvider, usePageASelector} from "./store";
import {Button, Card, Form, type FormProps, Input, Masonry, Radio, Space, Table, Tabs, Typography} from "antd";
import CodeBlock from "@/components/CodeBlock";
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
        {key: 'tab1', label: 'list 1', children: <TABContent/>},
        {key: 'tab2', label: 'form data', children: <TABContent2/>},
        {key: 'tab3', label: 'image Masonry', children: <TABContent3/>},
    ]), [])

    const codePage = `import { globalStore, selectDirect } from '@/store/globalStore'
import { PageAProvider, usePageASelector } from './store'
import { Button, Card, Form, type FormProps, Input, Masonry, Radio, Space, Table, Tabs, Typography } from 'antd'
import React, { useMemo, useState } from 'react'

const columns = [
  { key: 'a', title: 'a', dataIndex: 'a' },
  { key: 'b', title: 'b', dataIndex: 'b' },
]

const TABContent = () => {
  const data = usePageASelector('data')
  const setData = usePageASelector('setData')
  return (
    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
      <Button onClick={() => setData()}>新增一行</Button>
      <Table columns={columns} dataSource={data} rowKey={(_, idx) => String(idx ?? 0)} />
    </Space>
  )
}

type LayoutType = Parameters<typeof Form>[0]['layout']

const TABContent2 = () => {
  const formData = usePageASelector('formData')
  const submitForm = usePageASelector('submitForm')
  const [form] = Form.useForm()
  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal')

  const onFormLayoutChange: FormProps<any>['onValuesChange'] = ({ layout }) => {
    setFormLayout(layout)
  }

  const handleSubmit = (data: any) => {
    submitForm(data)
  }

  return (
    <>
      <Card title={'form val'}>
        <div>formLayout: {formLayout}</div>
        <div>fieldA: {formData.fieldA}</div>
        <div>fieldB: {formData.fieldB}</div>
      </Card>
      <Form
        layout={formLayout}
        form={form}
        onFinish={handleSubmit}
        initialValues={{ layout: formLayout }}
        onValuesChange={onFormLayoutChange}
        style={{ maxWidth: formLayout === 'inline' ? 'none' : 600 }}
      >
        <Form.Item label="Form Layout" name="layout">
          <Radio.Group value={formLayout}>
            <Radio.Button value="horizontal">Horizontal</Radio.Button>
            <Radio.Button value="vertical">Vertical</Radio.Button>
            <Radio.Button value="inline">Inline</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Field A" name="fieldA">
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item label="Field B" name="fieldB">
          <Input placeholder="input placeholder" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

const TABContent3 = () => {
  const imageList = usePageASelector('imageList')
  const setImageList = usePageASelector('setImageList')
  return (
    <Space orientation="vertical" size={12} style={{ width: '100%' }}>
      <Button onClick={() => setImageList()}>新增一组图片</Button>
      <Masonry
        columns={4}
        gutter={16}
        items={imageList.map((img, index) => ({ key: 'item-' + index, data: img }))}
        itemRender={({ data }) => (
          <img src={data + '?w=523&auto=format'} alt="sample" style={{ width: '100%' }} />
        )}
      />
    </Space>
  )
}

export default function PageA() {
  const username = globalStore(selectDirect('userName'))
  const items = useMemo(() => ([
    { key: 'tab1', label: 'TAB 1', children: <TABContent /> },
    { key: 'tab2', label: 'TAB 2', children: <TABContent2 /> },
    { key: 'tab3', label: 'TAB 3（non-page-global）', children: <TABContent3 /> },
  ]), [])
}
`

    const codeFactory = `import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from 'zustand/shallow'
import type { StoreApi, UseBoundStore } from 'zustand'
import React from 'react'

export function createContextStore<S>(createStoreFn: () => UseBoundStore<StoreApi<S>>) {
  const Ctx = createContext<UseBoundStore<StoreApi<S>> | null>(null)

  const Provider = ({ children }: { children: ReactNode }) => {
     const [store] = useState(createStoreFn)
    return React.createElement(Ctx.Provider, { value: store }, children)
  }

  const useCtxStore = <U>(selector: (s: S) => U, eq = shallow) => {
    const store = useContext(Ctx)
    if (!store) throw new Error('Must use inside Provider')
    return useStoreWithEqualityFn(store, selector, eq)
  }

  return { Provider, useCtxStore }
}`

    const codeStore = `----- src/demos/global-scope-demo/pageA/store/index.ts -----
import { create } from 'zustand'
import { createContextStore } from '@/store/factory'
import tableDataSlice from './tableDataSlice'
import formDataSlice from './formDataSlice'
import picStoreSlice from "./picStoreSlice.ts";

type PageAStore = ReturnType<typeof tableDataSlice> & ReturnType<typeof formDataSlice>&ReturnType<typeof picStoreSlice>

const createPageAStore = () =>
  create<PageAStore>()((...args) => ({
    ...tableDataSlice(...args),
    ...formDataSlice(...args),
    ...picStoreSlice(...args),
  }))

const { Provider: PageAProvider, useCtxStore } = createContextStore<PageAStore>(createPageAStore)

export const usePageASelector = <K extends keyof PageAStore>(key: K) => useCtxStore((state) => state[key])

export { PageAProvider }

----- src/demos/global-scope-demo/pageA/store/tableDataSlice.ts -----
const tableDataSlice = (set: any, get: any) => ({
  data: [{ a: 0, b: 0 }],
  setData: () =>
    set((s: { data: Array<{ a: number; b: number }> }) => ({
      data: [...s.data, { a: Math.random(), b: Math.random() }],
    })),
})

export default tableDataSlice

----- src/demos/global-scope-demo/pageA/store/formDataSlice.ts -----
const formDataSlice = (set: any) => ({
    formData: {},
    submitForm: (val) => set(() => ({formData: val})),
})

export default formDataSlice

----- src/demos/global-scope-demo/pageA/store/picStoreSlice.ts -----
const picStoreSlice = (set) => ({
    imageList: [
        'https://images.unsplash.com/photo-1510001618818-4b4e3d86bf0f',
        'https://images.unsplash.com/photo-1507513319174-e556268bb244',
        'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2',
        'https://images.unsplash.com/photo-1492778297155-7be4c83960c7',
        'https://images.unsplash.com/photo-1508062878650-88b52897f298',
        'https://images.unsplash.com/photo-1506158278516-d720e72406fc',
        'https://images.unsplash.com/photo-1552203274-e3c7bd771d26',
        'https://images.unsplash.com/photo-1528163186890-de9b86b54b51',
        'https://images.unsplash.com/photo-1727423304224-6d2fd99b864c',
        'https://images.unsplash.com/photo-1675090391405-432434e23595',
        'https://images.unsplash.com/photo-1554196967-97a8602084d9',
        'https://images.unsplash.com/photo-1491961865842-98f7befd1a60',
        'https://images.unsplash.com/photo-1721728613411-d56d2ddda959',
        'https://images.unsplash.com/photo-1731901245099-20ac7f85dbaa',
        'https://images.unsplash.com/photo-1617694455303-59af55af7e58',
        'https://images.unsplash.com/photo-1709198165282-1dab551df890',
    ],
    setImageList: () => set((s) => ({imageList: [...s.imageList, ...s.imageList]})),
})

export default picStoreSlice`

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
                <Tabs
                  defaultActiveKey="page"
                  items={[
                    { key: 'page', label: 'page', children: <CodeBlock code={codePage} /> },
                    { key: 'createContextStore', label: 'createContextStore', children: <CodeBlock code={codeFactory} /> },
                    { key: 'store', label: 'store', children: <CodeBlock code={codeStore} /> },
                  ]}
                />
            </Space>
        </PageAProvider>
    )
}


