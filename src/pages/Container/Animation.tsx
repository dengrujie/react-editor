import React, { FC, memo } from 'react';
import { Button, Tag, Divider } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash-es';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { allConfiger } from '../../recoil/Configer/atom';
import { activeComponent } from '../../recoil/Component/selecotr';
import { runAnimation } from '../../utils/base';

const Animation: FC = memo(() => {
    const changeConfiger = useSetRecoilState(allConfiger);
    const currentComponent = useRecoilValue(activeComponent);
    const changeActiveComponent = useSetRecoilState(activeComponent);
    const { animations, uuid } = currentComponent!.config;
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
    };
    const playAllAnimation = () => {
        const element = document.querySelector(`[uuid=${uuid}]`);
        if(element) {
            runAnimation(element as HTMLElement, animations);
        }
    };
    const playAnimation = (index: number) => {
        const element = document.querySelector(`[uuid=${uuid}]`);
        if(element) {
            runAnimation(element as HTMLElement, [animations[index]]);
        }
    }
    return (
        <div>
            <div style={{textAlign: 'center'}}>
                <Button onClick={showAnimationModal}>添加动画</Button>&nbsp;
                <Button onClick={playAllAnimation}>播放动画</Button>
            </div>
            <Divider/>
            <div>
                { 
                    animations.map((item, index) => (
                        <div key={item.value+index} style={{ padding: 8, textAlign: 'center'}} onClick={() =>playAnimation(index)}>
                            <Tag color="blue-inverse" closable onClose={() => deleteAnimation(index)} closeIcon={<CloseCircleOutlined style={{ color: '#fff' }} />}>{item.label}</Tag>
                        </div>
                    ))
                }
            </div>
        </div>
    )
});

export default Animation;