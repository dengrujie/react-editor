import React, { FC } from 'react';
import { RedoOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash-es';
import { useRecoilState } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import { allConfiger } from '../../recoil/Configer/atom';
import { activeComponent } from '../../recoil/Component/selecotr';
import { WRAPPERLEFT, WRAPPERTOP } from '../Container/Body';
import { calcLeftdistance } from '../../utils/componentCalculate';
import './Shape.less';

const RotateBox: FC = () => {
    const [configer] = useRecoilState(allConfiger);
    const [, setComponentState] = useRecoilState(componentStore);
    const [currentComponent, changeCurrentComponent] = useRecoilState(activeComponent);
    const calcRateAngle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        e.preventDefault();
        const downEvent = window.event as MouseEvent;
        downEvent.stopPropagation();
        downEvent.preventDefault();
        // 是否需要保存快照
        let needSave = false;
        const leftDis = configer.modeOption.name === 'pc' ? 0 : calcLeftdistance(configer.modeOption.style.width as number)
        const centerX = WRAPPERLEFT + Number(currentComponent?.config.style.left) + (Number(currentComponent?.config.style.width) / 2) + leftDis;
        const centerY = WRAPPERTOP + Number(currentComponent?.config.style.top) + (Number(currentComponent?.config.style.top) / 2);
        const startX = downEvent.clientX;
        const startY = downEvent.clientY;
        const startRotate = currentComponent!.rotate;
        const move = (moveEvent: MouseEvent) => {
            const newComponent = cloneDeep(currentComponent);
            const currX = moveEvent.clientX;
            const currY = moveEvent.clientY;
            // 旋转前的角度
            const rotateDegreeBefore = Math.atan2(startY - centerY, startX - centerX) / (Math.PI / 180);
            // 旋转后的角度
            const rotateDegreeAfter = Math.atan2(currY - centerY, currX - centerX) / (Math.PI / 180);
            // 获取旋转的角度值， startRotate 为初始角度值
            newComponent!.rotate = startRotate + rotateDegreeAfter - rotateDegreeBefore;
            newComponent!.config.style.transform = `rotate(${newComponent!.rotate}deg)`;
            changeCurrentComponent(newComponent);
            setComponentState((state) => ({
                ...state,
                snapshotSave: needSave
            }));
        }
        const up = () => {
            needSave = true;
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
            setComponentState((state) => ({
                ...state,
                snapshotSave: needSave
            }))
        }
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    }
    return (
        <div className='rotate-icon' onMouseDown={calcRateAngle}>
            <RedoOutlined rotate={-90} style={{ fontSize: 16}} />
        </div>
    )
}

export default RotateBox;