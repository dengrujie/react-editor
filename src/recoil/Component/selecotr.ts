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
            if(VerticalLeftDiff4.isNear && !showVerticalLeft) {
                left = VerticalLeftDiff4.targetValue - (Number(currentComponentStyle.width) / 2);
            }
            if(VerticalLeftDiff5.isNear && !showVerticalLeft) {
                left = VerticalLeftDiff5.targetValue - (Number(currentComponentStyle.width) / 2);
            }
            if(VerticalLeftDiff6.isNear && !showVerticalLeft) {
                left = VerticalLeftDiff6.targetValue - (Number(currentComponentStyle.width) / 2);
            }
            if(VerticalLeftDiff7.isNear && !showVerticalLeft && !showVerticalMid) {
                left = VerticalLeftDiff7.targetValue - Number(currentComponentStyle.width);
            }
            if(VerticalLeftDiff8.isNear && !showVerticalLeft && !showVerticalMid) {
                left = VerticalLeftDiff8.targetValue - Number(currentComponentStyle.width);
            }
            if(VerticalLeftDiff7.isNear && !showVerticalLeft && !showVerticalMid) {
                left = VerticalTopDiff9.targetValue - Number(currentComponentStyle.width);
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
            if(VerticalTopDiff4.isNear && !showAcrossTop) {
                top = VerticalTopDiff4.targetValue - (Number(currentComponentStyle.height) / 2);
            }
            if(VerticalTopDiff5.isNear && !showAcrossTop) {
                top = VerticalTopDiff5.targetValue - (Number(currentComponentStyle.height) / 2);
            }
            if(VerticalTopDiff6.isNear && !showAcrossTop) {
                top = VerticalTopDiff6.targetValue - (Number(currentComponentStyle.height) / 2);
            }
            if(VerticalTopDiff7.isNear && !showAcrossTop && !showAcrossMid) {
                top = VerticalTopDiff7.targetValue - Number(currentComponentStyle.height);
            }
            if(VerticalTopDiff8.isNear && !showAcrossTop && !showAcrossMid) {
                top = VerticalTopDiff8.targetValue - Number(currentComponentStyle.height);
            }
            if(VerticalTopDiff9.isNear && !showAcrossTop && !showAcrossMid) {
                top = VerticalTopDiff9.targetValue - Number(currentComponentStyle.height);
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

interface ICopyData {
    currentIndex: number;
    saveIndex: number | undefined;
    data: '' | Ilist| undefined;
}

type EditComponentType = 'add' | 'remove' | 'edit'
interface IEditComponent {
    type: EditComponentType;
    data?: Ilist
}

export const editComponent = selector<ICopyData | IEditComponent>({
    key: 'editComponent',
    get: ({ get }): ICopyData => {
        const { copyData, list, selectedComponent } = get(componentStore);
        const currentIndex = list.findIndex((item) => item.config.uuid === selectedComponent);
        return { currentIndex, saveIndex: copyData.index, data: copyData.data };
    },
    set: ({ set, get }, newValue) => {
        const { list, copyData } = get(componentStore);
        const { type, data } = newValue as IEditComponent;
        const cloneList = cloneDeep(list);
        if (type === 'add') {
            cloneList.push(data!);
        }
        if (type === 'remove') {
            cloneList.splice(copyData.index!, 1)
        }
        if (type === 'edit') {
            cloneList.splice(copyData.index!, 1, data!);
        }
        set(componentStore, (values) => ({...values, list: cloneList}));
    },
});
