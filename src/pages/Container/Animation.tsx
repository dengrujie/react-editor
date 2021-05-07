import React, { FC, memo } from 'react';
import { Button, Tag, Divider } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash-es';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { allConfiger } from '../../recoil/Configer/atom';
import { activeComponent } from '../../recoil/Component/selecotr';

const Animation: FC = memo(() => {
    const changeConfiger = useSetRecoilState(allConfiger);
    const currentComponent = useRecoilValue(activeComponent);
    const changeActiveComponent = useSetRecoilState(activeComponent);
    const { animations } = currentComponent!.config;
    const showAnimationModal = () => {
        changeConfiger((values) => ({
            ...values,
            animationModalState: true
        }));
    };
    const deleteAnimation = (index: number) => {
        const newAnimations = animations.slice();
        newAnimations.splice(index, 1);
        const newComponent = cloneDeep(currentComponent);
        newComponent!.config.animations = newAnimations;
        changeActiveComponent(newComponent);
    }
    return (
        <div>
            <div style={{textAlign: 'center'}}><Button onClick={showAnimationModal}>添加动画</Button></div>
            <Divider/>
            <div>
                { 
                    animations.map((item, index) => (
                        <div key={item+index} style={{ padding: 2, textAlign: 'center'}}><Tag color="blue-inverse" closable onClose={() => deleteAnimation(index)} closeIcon={<CloseCircleOutlined style={{ color: '#fff' }} />}>{item}</Tag></div>
                    ))
                }
            </div>
        </div>
    )
});

export default Animation;