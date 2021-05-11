import React, { FC, memo } from 'react';
import { cloneDeep } from 'lodash-es';
import './Shape.less';
import { useRecoilState } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import { allConfiger } from '../../recoil/Configer/atom';
import { getInitializeComponentCenter, getSymmetry, calcScaleAndRotateComponentStyle } from '../../utils/componentCalculate';

type Point = {
    id: string
}

type PointStyle = {
    left?: number | string,
    right?: number | string,
    top?: number | string,
    bottom?: number | string,
    transform?: string,
    cursor: string,
}

interface IShape {
    id: string | undefined;
}

const pointList: Point[] = [
    {
        id: 'top'
    },
    {
        id: 'top-left'
    },
    {
        id: 'top-right'
    },
    {
        id: 'left'
    },
    {
        id: 'right'
    },
    {
        id: 'bottom'
    },
    {
        id: 'bottom-left'
    },
    {
        id: 'bottom-right'
    },
]

const getPointStyle = (point: Point) => {
    const style: PointStyle = {
        left: '50%',
        right: '50%',
        cursor: 'all-scroll',
    };
    const hasTop = /top/.test(point.id);
    const hasBottom = /bottom/.test(point.id);
    const hasLeft = /left/.test(point.id);
    const hasRight = /right/.test(point.id);

    hasTop && (style.top = 0,style.transform = 'translate(-50%, -50%)');
    hasBottom && (style.bottom = 0, style.transform = 'translate(-50%, 50%)');
    hasLeft && (style.left = 0, style.right = '100%');
    hasRight && (style.right = 0, style.left = '100%');

    if(hasLeft && !(hasTop || hasBottom)) {
        style.top = '50%';
        style.transform = 'translate(-50%, -50%)';
    }
    if(hasRight && !(hasTop || hasBottom)) {
        style.top = '50%';
        style.transform = 'translate(-50%, -50%)';
    }
    return style;
}

const Shape: FC<IShape> = memo(({ id }) => {
    const [configer] = useRecoilState(allConfiger);
    const [componentState, setComponentState] = useRecoilState(componentStore);
    const { list } = componentState;
    const handleMouseDownOnPoint = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { key } = e.currentTarget.dataset;
        const point = pointList.find((item) => item.id === key);
        const downEvent = window.event as MouseEvent;
        downEvent.stopPropagation();
        downEvent.preventDefault();
        const startX = downEvent.clientX;
        const startY = downEvent.clientY;
        // 是否需要保存快照
        let needSave = false;
        setComponentState((state) => ({
            ...state,
            snapshotSave: needSave
        }));
        // 当前点击坐标
        const currentPoint = {
            x: startX,
            y: startY,
        };
        const move = (moveEvent: MouseEvent) => {
            const newlist =  cloneDeep(list);
            const selected = newlist.find((item) => item.config.uuid === id);
            const newStyle = selected!.config.style;
            const currX = moveEvent.clientX;
            const currY = moveEvent.clientY;
            // 模式宽度空白距离
            const modeWidth = configer.modeOption.name === 'pc' ? 0 : Number(configer.modeOption.style.width);
            // 组件旋转前中心坐标
            const centerPoint = getInitializeComponentCenter(selected!, modeWidth);
            // 当前对称点坐标
            const symmetricPoint = getSymmetry(centerPoint, currentPoint);
            // 当前鼠标坐标
            const movePoint = {
                x: currX,
                y: currY,
            }
            const newS = calcScaleAndRotateComponentStyle(selected!, movePoint, symmetricPoint, point!.id);
            newStyle.height = newS.height;
            newStyle.width = newS.width;
            newStyle.left = newS.left;
            newStyle.top = newS.top;
            setComponentState((state) => ({
                ...state,
                list: newlist,
                snapshotSave: needSave
            }))
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
    };
    return (
        <div className='shape-box shape-box-active'>
            {
                pointList.map((item) => <div key={item.id} className='shape-box-point' style={getPointStyle(item)} data-key={item.id} onMouseDown={handleMouseDownOnPoint}></div>)
            }
        </div>
    )
});

export default Shape;
