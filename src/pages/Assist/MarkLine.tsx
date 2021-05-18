import React, { FC } from 'react';
import './markLine.less';
import { useRecoilState, useRecoilValue } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import { nearComponent, INearComponent } from '../../recoil/Component/selecotr';
import { WRAPPERLEFT, WRAPPERTOP } from '../Container/Body';
import { getStyleOfRotate } from '../../utils/componentCalculate';

const lineList = ['vertical-left', 'vertical-mid', 'vertical-right', 'across-top', 'across-mid', 'across-bottom'];

type LineStyle = {
    top?: number,
    left?: number,
}

const getLineType = (line: string) => {
    return /vertical/.test(line);
}

const isLineShow = (line: string, component: INearComponent) => {
    const { showVerticalLeft, showVerticalMid, showVerticalRight, showAcrossTop, showAcrossMid, showAcrossBottom } = component
    if(line === 'vertical-left') {
        return showVerticalLeft;
    }
    if(line === 'vertical-mid') {
        return showVerticalMid;
    }
    if(line === 'vertical-right') {
        return showVerticalRight;
    }
    if(line === 'across-top') {
        return showAcrossTop;
    }
    if(line === 'across-mid') {
        return showAcrossMid;
    }
    if(line === 'across-bottom') {
        return showAcrossBottom;
    }
}

const MarkLine: FC = () => {
    const [componentState] = useRecoilState(componentStore);
    const markLineObj = useRecoilValue(nearComponent);
    const { selectedComponent, list } = componentState;
    const getStyle = (lineName: string) => {
        const current = list.find((item) => item.config.uuid === selectedComponent);
        if (current) {
            const currentComponentStyle = getStyleOfRotate(current);
            const { width, height, top, left } = currentComponentStyle;
            const styles: LineStyle = {};
            switch (lineName) {
                case 'vertical-left':
                    styles.left = left as number + WRAPPERLEFT;
                    break;
                case 'vertical-mid':
                    styles.left = (left as number + WRAPPERLEFT + (Number(width) / 2));
                    break;
                case 'vertical-right':
                    styles.left = left as number + WRAPPERLEFT + Number(width);
                    break;
                case 'across-top':
                    styles.top = top as number + WRAPPERTOP;
                    break;
                case 'across-mid':
                    styles.top = top as number + WRAPPERTOP + (Number(height) / 2);
                    break;
                case 'across-bottom':
                    styles.top = top as number + WRAPPERTOP + Number(height);
                    break;
                default:
                    break;
            }
            return styles;
        }
        return {};
    }
    return (
        <div className='markline-active'>
            {
                lineList.map((item) => (<div key={item} className={`${getLineType(item) ? 'markline-vertical' : 'markline-across'} ${isLineShow(item, markLineObj)?'markline-show':'markline-hide'}`} style={getStyle(item)}></div>))
            }
        </div>
    )
}

export default MarkLine;
