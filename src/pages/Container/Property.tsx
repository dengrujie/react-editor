import React, { FC, memo, useEffect } from 'react';
import { Form, InputNumber } from 'antd';
import { useRecoilState } from 'recoil';
import { activeComponent } from '../../recoil/Component/selecotr';
import { STYLE } from './Body';

const labelMap: STYLE = {
    width: '宽度',
    height: '高度',
    top: 'y坐标',
    left: 'x坐标',
}

const Property: FC = memo(() => {
    const [currentComponent, setCurrentComponent] = useRecoilState(activeComponent);
    const initialValues = Object.assign({}, currentComponent?.config.style);
    const changeValue = (changedValues: any, allValues: any) => {
        const newComponent = Object.assign({}, currentComponent, { style: allValues });
        setCurrentComponent(newComponent);
    };
    const [form] = Form.useForm();
    useEffect(() => {
        form.setFieldsValue(currentComponent?.config.style)
    }, [currentComponent]);
    return (
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            initialValues={initialValues}
            onValuesChange={changeValue}
            form={form}>
                {
                    Object.keys(initialValues).map((key) => (
                        <Form.Item key={key} label={labelMap[key]} name={key}>
                            <InputNumber />
                        </Form.Item>
                    ))
                }
        </Form>
    )
});

export default Property;