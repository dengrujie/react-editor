import React, { FC, memo } from 'react';
import { cloneDeep } from 'lodash-es';
import './Shape.less';
import { useRecoilState } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';

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
        const hasTop = /top/.test(point!.id);
        const hasBottom = /bottom/.test(point!.id);
        const hasLeft = /left/.test(point!.id);
        const hasRight = /right/.test(point!.id);
        // 是否需要保存快照
        let needSave = false;
        setComponentState((state) => ({
            ...state,
            snapshotSave: needSave
        }));
        const move = (moveEvent: MouseEvent) => {
            const newlist =  cloneDeep(list);
            const selected = newlist.find((item) => item.config.uuid === id);
            const newStyle = selected!.config.style;
            const currX = moveEvent.clientX;
            const currY = moveEvent.clientY;
            const disX = currX - startX;
            const disY = currY - startY;
            const newHeight = Number(newStyle.height) + (hasTop ? -disY : hasBottom ? disY : 0);
            const newWidht = Number(newStyle.width) + (hasLeft ? -disX : hasRight ? disX : 0);
            newStyle.height = (newHeight ? newHeight : 0);
            newStyle.width = (newWidht ? newWidht : 0);
            newStyle.left = Number(newStyle.left) + (hasLeft? disX : 0);
            newStyle.top = Number(newStyle.top) + (hasTop? disY : 0);
            
            // selected!.config.style = newStyle;
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
