import React, { FC } from 'react';
import { Form, Select, Input } from 'antd';

const { Option } = Select;

const events = {
    redirect(url: string) {
        if(url) {
            window.location.href = url;
        }
    },
};

const eventList = [
    {
        key: 'redirect',
        label: '页面跳转',
        event: events.redirect,
        param: '',
    },
];

const ActionList:FC = () => {
    return (
        <div>
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
            >
                <Form.Item label='事件'>
                    <Select>
                        <Option value='redirect'>跳转</Option>
                    </Select>
                </Form.Item>
                <Form.Item label='参数'>
                    <Input/>
                </Form.Item>
            </Form>
        </div>
    )
};

export default ActionList;