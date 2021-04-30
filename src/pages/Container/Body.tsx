import React, { FC, useCallback, useEffect, useState } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { cloneDeep } from 'lodash-es';
import { useRecoilState, useRecoilValue } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import { componentIdList, nearComponent, INearComponent } from '../../recoil/Component/selecotr';
import { ComponentsList } from '../../components';
import ComponentBox from '../Assist/ComponentBox';
import SourceBox from '../Assist/SourceBox';
import MarkLine from '../Assist/MarkLine';

type STYLE = {
    [key: string]: string | number | undefined;
}

export interface IConfig {
    value: ComponentsList;
    uuid?: string;
    style: STYLE;
}

export interface IPosition {
    x: number | undefined;
    y: number | undefined;
}

export interface Ilist {
    config: IConfig;
}

export const WRAPPERLEFT = 265;
export const WRAPPERTOP = 74;

const Body: FC = () => {
    const [ offset, setOffset ] = useState({ x: 0, y: 0 });
    const [componentState, setComponentState] = useRecoilState(componentStore);
    const idList = useRecoilValue(componentIdList);
    const nearObj = useRecoilValue(nearComponent);
    const { list, snapshotData, snapshotIndex, snapshotSave, selectedComponent, isDragging } = componentState;
    const getNearTarget = (newTarget: Ilist, nearObj: INearComponent) => {
        // const newTarget = cloneDeep(target);
        if(nearObj.showVerticalLeft || nearObj.showVerticalMid || nearObj.showVerticalRight ) {
            newTarget!.config.style.left = nearObj.left;
        }
        if(nearObj.showAcrossTop || nearObj.showAcrossMid || nearObj.showAcrossBottom ) {
            newTarget!.config.style.top = nearObj.top;
        }
        return newTarget
    };
    const getNearStatus = (nearObj: INearComponent) => {
        let isNear = false
        Object.values(nearObj).forEach((item) => {
            if(item) isNear = item
        })
        return isNear;
    }
    // 第一个参数是 collect 方法返回的对象，第二个参数是一个 ref 值，赋值给 drop 元素
    const [collected, droper] = useDrop({
        // accept 是一个标识，需要和对应的 drag 元素中 item 的 type 值一致，否则不能感应
        accept: 'test',
        drop: (item: IConfig, monitor: DropTargetMonitor) => {
            const newItem = cloneDeep(item);
            const target = list.find((i) => i.config.uuid === newItem.uuid);
            newItem.style.left = monitor.getClientOffset()!.x - WRAPPERLEFT;
            newItem.style.top = monitor.getClientOffset()!.y - WRAPPERTOP;
            if (!target) {
                setComponentState((state) => ({
                    ...state,
                    list: [...list, {
                        config: newItem,
                    }],
                    isDragging: false
                }));
                saveSnapshot([...list, {
                    config: newItem,
                }])
            }
            return {
                config: item,
            }
        },
        hover: (item: IConfig, monitor: DropTargetMonitor) => {
            const target = list.find((i) => i.config.uuid === item.uuid);
            if (!target) return;
            const newList = cloneDeep(list);
            let newTarget = newList.find((i) => i.config.uuid === item.uuid);
            const disLeft = monitor.getSourceClientOffset()!.x - WRAPPERLEFT;
            const disTop = monitor.getSourceClientOffset()!.y - WRAPPERTOP;
            if(newTarget!.config.style.left === disLeft && newTarget!.config.style.top === disTop) return;
            newTarget!.config.style.left = monitor.getSourceClientOffset()!.x - WRAPPERLEFT;
            newTarget!.config.style.top = monitor.getSourceClientOffset()!.y - WRAPPERTOP;
            
            setComponentState((state) => ({
                ...state,
                list: [...newList],
                isDragging: true
            }));
            if (snapshotSave) {
                setOffset(monitor.getSourceClientOffset()!);
                saveSnapshot([...newList])
            }
            return {
                config: item,
            }
        },
        collect: (monitor: DropTargetMonitor) => ({
            x: monitor.getSourceClientOffset()?.x,
            y: monitor.getSourceClientOffset()?.y,
            item: monitor.getItem<IConfig>(),
        })
    });
    useEffect(() => {
        if (!isDragging && !selectedComponent) return;
        const newList = cloneDeep(list);
        let newTarget = newList.find((i) => i.config.uuid === selectedComponent);
        if(!getNearStatus(nearObj)) return;
        getNearTarget(newTarget!, nearObj);
        setComponentState((state) => ({
            ...state,
            list: [...newList]
        }));
    }, [isDragging, offset.x, offset.y])
    const saveSnapshot = useCallback((snapshotlList) => {
        const newSnapshotData = cloneDeep(snapshotData);
        newSnapshotData.push(snapshotlList)
        setComponentState((state) => ({
            ...state,
            snapshotData: newSnapshotData,
            snapshotIndex: snapshotIndex + 1
        }));
    }, [snapshotData, snapshotIndex]);
    useEffect(() => {
        saveSnapshot(list);
    }, [snapshotSave]);
    const selectCurrentComponent = useCallback(() => {
        setComponentState((state) => ({
            ...state,
            selectedComponent: '',
        }))
    }, []);
    return (
        <div style={{ backgroundColor: '#fff', padding: 10, minHeight: '100vh', position: 'relative' }} ref={droper} onClick={selectCurrentComponent}>
            <MarkLine />
            {
                idList.map((item) => {
                    if (isDragging && selectedComponent && !snapshotSave) {
                        if (item !== selectedComponent) {
                            return (
                                <SourceBox key={item} uuid={item}>
                                    <ComponentBox uuid={item!} />
                                </SourceBox>
                            )
                        } else {
                            return ''
                        }
                    } else {
                        return (
                            <SourceBox key={item} uuid={item}>
                                <ComponentBox uuid={item!} />
                            </SourceBox>
                        )
                    }
                })
            }
        </div>
    )
};

export default Body;
