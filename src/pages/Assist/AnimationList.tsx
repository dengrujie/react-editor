import React, { FC, useState } from 'react';
import { Tabs, Button } from 'antd';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { allConfiger } from '../../recoil/Configer/atom';
import { activeComponent } from '../../recoil/Component/selecotr';
import { cloneDeep } from 'lodash-es';

const animationDataList = [
    {
        label: '进入',
        key: 'comming',
        children: [
            { label: '渐显', value: 'animate__fadeIn' }
        ]
    },
    {
        label: '强调',
        key: 'stress',
        children: [
            { label: '弹跳', value: 'animate__bounce' }
        ]
    },
    {
        label: '退出',
        key: 'exitting',
        children: [
            { label: '渐出', value: 'animate__fadeOut' }
        ]
    },
];

const { TabPane } = Tabs;

const AnimationList:FC = () => {
    const changeAllConfiger = useSetRecoilState(allConfiger);
    const [currentComponent, changeCurrentComponent] = useRecoilState(activeComponent);
    const [previewAnimate, setPreviewAnimate] = useState('');
    const changePreviewAnimate = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        if(e.currentTarget.dataset.type === previewAnimate) return;
        setPreviewAnimate(e.currentTarget.dataset.type!);
    }
    const addAnimation = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const newAnimations = currentComponent?.config.animations.slice() as string [];
        newAnimations?.push(e.currentTarget.dataset.type as string);
        const newComponent = cloneDeep(currentComponent);
        newComponent!.config.animations = newAnimations;
        changeCurrentComponent(newComponent);
        changeAllConfiger((values) => ({
            ...values,
            animationModalState: false
        }))
    }
    return (
        <Tabs defaultActiveKey={animationDataList[0].key}>
            {
                animationDataList.map((item) => (
                    <TabPane tab={item.label} key={item.key}>
                        {
                            item.children.map((item2) => (
                                <Button 
                                    key={item2.value} 
                                    className={`animate__animated ${ previewAnimate === item2.value ? item2.value : ''}`} 
                                    onMouseOver={changePreviewAnimate}
                                    data-type={item2.value}
                                    onClick={addAnimation}>
                                    {item2.label}
                                </Button>
                            ))
                        }
                    </TabPane>
                ))
            }
        </Tabs>
    )
};

export default AnimationList;