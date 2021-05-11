import React, { FC, useCallback, useEffect } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { useRecoilState } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import Shape from './Shape';
import RotateBox from './RotateBox';

interface ISourceBox {
    uuid: string | undefined;
}

const SourceBox: FC<ISourceBox> = ({ uuid, children}) => {
    const [ componentState, changeSnapshotSave] = useRecoilState(componentStore);
    const { list, selectedComponent } = componentState;
    const { config } = list.find((item) => item.config.uuid === uuid)!;
    const { style } = config;
    const changeSnapshotSaveStatus = useCallback((status: boolean, dragging: boolean) => {
        changeSnapshotSave((state) => ({
            ...state,
            snapshotSave: status,
            isDragging: dragging
        }))
    }, []);
    const [collected, drager] = useDrag(() => ({
        type: 'test',
        item: config,
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging()
        }),
        end: (item) => {
            changeSnapshotSaveStatus(true, false)
        },
    }))
    useEffect(() => {
        changeSnapshotSaveStatus(!collected.isDragging, collected.isDragging)
    }, [collected.isDragging])
    const selectCurrentComponent = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        changeSnapshotSave((state) => ({
            ...state,
            selectedComponent: uuid,
        }))
    }, []);
    return (
        <>
            <div ref={drager} style={{ position: 'absolute', ...style }} onMouseDown={selectCurrentComponent} onClick={selectCurrentComponent}>
                { selectedComponent === config.uuid && <Shape id={config.uuid}/> }
                { selectedComponent === config.uuid && <RotateBox/> }
                {children}
            </div>
        </>
    )
}

export default SourceBox;
