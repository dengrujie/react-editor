import { selector } from 'recoil';
import { componentStore } from './atom';
import { cloneDeep } from 'lodash-es';
import { Ilist } from '../../pages/Container/Body';
import { getStyleOfRotate } from '../../utils/componentCalculate';

const isNearly = (dragValue: number, targetValue: number, diff = 3) => {
    const isNear = Math.abs(dragValue - targetValue) <= diff
    return {
        isNear,
        targetValue,
    };
};

export const componentIdList = selector({
    key: 'componentIdList',
    get: ({ get }) => {
        const { list } = get(componentStore);
        return list.map((item) => item.config.uuid)
    }
});

export interface INearComponent {
    showVerticalLeft: boolean,
    showVerticalMid: boolean,
    showVerticalRight: boolean,
    showAcrossTop: boolean,
    showAcrossMid: boolean,
    showAcrossBottom: boolean,
    left: number,
    top: number,
};

export const nearComponent = selector<INearComponent>({
    key: 'nearComponent',
    get: ({ get }) => {
        let showVerticalLeft = false, showVerticalMid = false, showVerticalRight = false, showAcrossTop = false, showAcrossMid = false, showAcrossBottom = false, left = 0, top = 0;
        const { selectedComponent, list } = get(componentStore);
        if(!selectedComponent) {
            return {
                showVerticalLeft,
                showVerticalMid,
                showVerticalRight,
                showAcrossTop,
                showAcrossMid,
                showAcrossBottom,
                left,
                top,
            }
        }
        const currentComponent = list.find((item) => item.config.uuid === selectedComponent);
        const currentComponentStyle = getStyleOfRotate(currentComponent!);
        const newList = list.filter((item) => item.config.uuid !== selectedComponent);
        newList.forEach((item) => {
            const itemStyle = getStyleOfRotate(item);
            const drageVerticalLeft = Number(currentComponentStyle.left);
            const drageVerticalMid = Number(currentComponentStyle.left) + (Number(currentComponentStyle.width) / 2);
            const drageVerticalRight = Number(currentComponentStyle.left) + Number(currentComponentStyle.width);
            const drageAcrossTop = Number(currentComponentStyle.top);
            const drageAcrossMid = Number(currentComponentStyle.top) + (Number(currentComponentStyle.height) / 2);
            const drageAcrossBottom = Number(currentComponentStyle.top) + Number(currentComponentStyle.height);
            const targetVerticalLeft = Number(itemStyle.left);
            const targetVerticalMid = Number(itemStyle.left) + (Number(itemStyle.width) / 2);
            const targetVerticalRight = Number(itemStyle.left) + Number(itemStyle.width);
            const targetAcrossTop = Number(itemStyle.top);
            const targetAcrossMid = Number(itemStyle.top) + (Number(itemStyle.height) / 2);
            const targetAcrossBottom = Number(itemStyle.top) + Number(itemStyle.height);
            const VerticalLeftDiff = isNearly(drageVerticalLeft, targetVerticalLeft);
            const VerticalLeftDiff2 = isNearly(drageVerticalLeft, targetVerticalMid);
            const VerticalLeftDiff3 = isNearly(drageVerticalLeft, targetVerticalRight);
            const VerticalLeftDiff4 = isNearly(drageVerticalMid, targetVerticalLeft);
            const VerticalLeftDiff5 = isNearly(drageVerticalMid, targetVerticalMid);
            const VerticalLeftDiff6 = isNearly(drageVerticalMid, targetVerticalRight);
            const VerticalLeftDiff7 = isNearly(drageVerticalRight, targetVerticalLeft);
            const VerticalLeftDiff8 = isNearly(drageVerticalRight, targetVerticalMid);
            const VerticalLeftDiff9 = isNearly(drageVerticalRight, targetVerticalRight);
            const VerticalTopDiff1 = isNearly(drageAcrossTop, targetAcrossTop);
            const VerticalTopDiff2 = isNearly(drageAcrossTop, targetAcrossMid);
            const VerticalTopDiff3 = isNearly(drageAcrossTop, targetAcrossBottom);
            const VerticalTopDiff4 = isNearly(drageAcrossMid, targetAcrossTop);
            const VerticalTopDiff5 = isNearly(drageAcrossMid, targetAcrossMid);
            const VerticalTopDiff6 = isNearly(drageAcrossMid, targetAcrossBottom);
            const VerticalTopDiff7 = isNearly(drageAcrossBottom, targetAcrossTop);
            const VerticalTopDiff8 = isNearly(drageAcrossBottom, targetAcrossMid);
            const VerticalTopDiff9 = isNearly(drageAcrossBottom, targetAcrossBottom);
            showVerticalLeft = VerticalLeftDiff.isNear || VerticalLeftDiff2.isNear || VerticalLeftDiff3.isNear;
            showVerticalMid = VerticalLeftDiff4.isNear || VerticalLeftDiff5.isNear || VerticalLeftDiff6.isNear;
            showVerticalRight = VerticalLeftDiff7.isNear || VerticalLeftDiff8.isNear || VerticalLeftDiff9.isNear;
            showAcrossTop = VerticalTopDiff1.isNear || VerticalTopDiff2.isNear || VerticalTopDiff3.isNear;
            showAcrossMid = VerticalTopDiff4.isNear || VerticalTopDiff5.isNear || VerticalTopDiff6.isNear;
            showAcrossBottom = VerticalTopDiff7.isNear || VerticalTopDiff8.isNear || VerticalTopDiff9.isNear;

            if(VerticalLeftDiff.isNear) {
                left = VerticalLeftDiff.targetValue;
            }
            if(VerticalLeftDiff2.isNear) {
                left = VerticalLeftDiff2.targetValue;
            }
            if(VerticalLeftDiff3.isNear) {
                left = VerticalLeftDiff3.targetValue;
            }
            if(VerticalTopDiff1.isNear) {
                top = VerticalTopDiff1.targetValue;
            }
            if(VerticalTopDiff2.isNear) {
                top = VerticalTopDiff2.targetValue;
            }
            if(VerticalTopDiff3.isNear) {
                top = VerticalTopDiff3.targetValue;
            }
        });
        return {
            showVerticalLeft,
            showVerticalMid,
            showVerticalRight,
            showAcrossTop,
            showAcrossMid,
            showAcrossBottom,
            left,
            top,
        }
    }
});

export const activeComponent = selector<Ilist| undefined>({
    key: 'activeComponent',
    get: ({ get }) => {
        const { selectedComponent, list } = get(componentStore);
        const currentComponent = list.find((item) => item.config.uuid === selectedComponent);
        return currentComponent;
    },
    set: ({ set, get }, newValue) => {
        const { selectedComponent, list } = get(componentStore);
        const cloneList = cloneDeep(list);
        const newList = cloneList.map((item) => {
            if(item.config.uuid === selectedComponent) {
                return newValue as Ilist
            }
            return item;
        });
        set(componentStore, (values) => ({...values, list: newList}))
    },
});
