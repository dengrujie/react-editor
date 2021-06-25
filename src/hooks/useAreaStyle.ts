import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from 'recoil';
import { calcLeftdistance, getStyleOfRotate } from '../utils/componentCalculate';
import { allConfiger } from '../recoil/Configer/atom';
import { componentStore } from '../recoil/Component/atom';
import { WRAPPERLEFT, WRAPPERTOP, Ilist } from '../pages/Container/Body';

export const useAreaStyle = () => {
    const configer = useRecoilValue(allConfiger);
    const componentState = useRecoilValue(componentStore);
    const { list, selectedComponent } = componentState;
    // 选中区域
    const [areaShow, setAreaShow] = useState(false);
    const [areaStyle, setAreaStyle] = useState({
        width: 0,
        height: 0,
        top: 0,
        left: 0
    });
    useEffect(() => {
        if(!areaShow) {
            setAreaStyle({
                width: 0,
                height: 0,
                top: 0,
                left: 0
            });
        };
    }, [areaShow]);
    const getAreaSelect = useCallback(() => {
        const result: Ilist[] = [];
        const areaX1 = areaStyle.left;
        const areaX2 = areaStyle.left + areaStyle.width;
        const areaY1 = areaStyle.top;
        const areaY2 = areaStyle.top + areaStyle.height;
        list.forEach((item) => {
            const { width, height, top, left } = item.config.style;
            const x1 = Number(left), x2 = Number(left) + Number(width), y1 = Number(top), y2 = Number(top) + Number(height);
            if (areaX1 < x2 && areaX2 > x1 && areaY1 < y2 && areaY2 > y1) {
                result.push(item);
            }
        });
        return result;
    }, [list, areaStyle]);
    const createGroup = useCallback(() => {
        const areaComponents = getAreaSelect();
        if (areaComponents.length <= 1) {
            setAreaShow(false);
            return;
        }
        let groupTop = Infinity, groupLeft = Infinity, groupRight = -Infinity, groupBottom = -Infinity;
        areaComponents.forEach((item) => {
            const { width, height, left, top } = getStyleOfRotate(item);
            if (Number(left) < groupLeft) groupLeft = Number(left);
            if (Number(top) < groupTop) groupTop = Number(top);
            if ((Number(left) + Number(width)) > groupRight) groupRight = Number(left) + Number(width);
            if ((Number(top) + Number(height)) > groupBottom) groupBottom = Number(top) + Number(height);
        });
        const width = groupRight - groupLeft;
        const height = groupBottom - groupTop;
        setAreaStyle({
            width,
            height,
            top: groupTop,
            left: groupLeft
        })
    }, [getAreaSelect, setAreaShow]);

    const [upStatus, setUpStatus] = useState(false);

    useEffect(() => {
        if(upStatus) {
            createGroup();
        }
    }, [upStatus]);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!selectedComponent) {
            e.preventDefault();
        }
        const startX = e.clientX;
        const startY = e.clientY;
        setAreaShow(true);
        const bodyWidth = configer.modeOption.name === 'pc' ? 0 : configer.modeOption.style.width as number;

        const move = (moveEvent: MouseEvent) => {
            const width = Math.abs(moveEvent.clientX - startX );
            const height = Math.abs(moveEvent.clientY - startY);
            let left;
            let top;
            if (moveEvent.clientX < startX) {
                left = moveEvent.clientX- calcLeftdistance(bodyWidth) - WRAPPERLEFT;
            } else {
                left = startX- calcLeftdistance(bodyWidth) - WRAPPERLEFT;
            }
            if (moveEvent.clientY < startY) {
                top = moveEvent.clientY - WRAPPERTOP;
            } else {
                top = startY - WRAPPERTOP;
            }
            setAreaStyle({
                width,
                height,
                top,
                left
            })
        };
        const up = (moveEvent: MouseEvent) => {
            document.removeEventListener('mousemove', move);
            document.removeEventListener('mouseup', up);
            if (moveEvent.clientX == startX && moveEvent.clientY == startY) {
                setAreaShow(false);
                return;
            }
            setUpStatus(true);
        };
        setUpStatus(false);
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
    };
    return {
        areaShow,
        areaStyle,
        handleMouseDown,
    }
}