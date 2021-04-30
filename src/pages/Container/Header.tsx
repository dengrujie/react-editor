import React, { FC, useState, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import { Row, Col, Button, Radio, RadioChangeEvent, InputNumber } from 'antd';
import { ButtonType } from 'antd/lib/button';

interface IButtonList {
    key: string,
    text: string,
    type: ButtonType,
}

const buttonList: IButtonList[] = [
    {
        key: 'undo',
        text: '撤销',
        type: 'default',
    },
    {
        key: 'redo',
        text: '重做',
        type: 'default',
    },
    {
        key: 'insertPicture',
        text: '插入图片',
        type: 'default',
    },
    {
        key: 'preview',
        text: '预览',
        type: 'default',
    },
    {
        key: 'save',
        text: '保存',
        type: 'default',
    },
    {
        key: 'clean',
        text: '清空画布',
        type: 'default',
    },
];
const modelOptions = [
    { label: '手机', value: 'mobile' },
    { label: '电脑', value: 'pc' },
    { label: '小程序', value: 'miniProgram' },
    { label: '自定义', value: 'custom' },
];

const Header: FC = React.memo(() => {
    const [modelRadio, setModelRadio] = useState('mobile');
    const [componentState, setComponentState] = useRecoilState(componentStore);
    const { snapshotData, snapshotIndex } = componentState;
    const modalChange = (e: RadioChangeEvent) => {
        setModelRadio(e.target.value);
    };
    const undo = useCallback(() => {
        if (snapshotIndex <= 0) return;
        const undolist = snapshotData[snapshotIndex - 1];
        setComponentState((state) => ({
            ...state,
            list: undolist,
            snapshotIndex: snapshotIndex - 1,
        }))
    }, [snapshotIndex, snapshotData]);
    const redo = useCallback(() => {
        if (snapshotIndex === (snapshotData.length - 1)) return;
        const redolist = snapshotData[snapshotIndex + 1];
        setComponentState((state) => ({
            ...state,
            list: redolist,
            snapshotIndex: snapshotIndex + 1,
        }))
    },[snapshotIndex, snapshotData]);
    const clean = useCallback(() => {
        setComponentState((state) => ({
            ...state,
            list: [],
            snapshotData: [],
            snapshotIndex: -1,
        }))
    },[]);
    const somethingAboutComponentStore = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        switch (e.currentTarget.dataset.key) {
            case 'undo':
                undo();
                break;
            case 'redo':
                redo();
                break;
            case 'clean':
                clean();
                break;
            default:
                break;
        }
    }
    return (
        <Row gutter={10}>
            {
                buttonList.map((item) => (
                    <Col key={item.key}>
                        <Button type={item.type} data-key={item.key} onClick={somethingAboutComponentStore}>{item.text}</Button>
                    </Col>
                ))
            }
            <Col>
                <Radio.Group
                    options={modelOptions}
                    onChange={modalChange}
                    value={modelRadio}
                    optionType="button"
                    buttonStyle="solid"
                />
            </Col>
            {
                modelRadio === 'custom' && (
                    <Col>
                        <InputNumber />
                        <span> x </span>
                        <InputNumber />
                    </Col>
                )
            }
        </Row>
    )
})

export default Header