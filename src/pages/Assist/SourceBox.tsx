import React, { FC, useCallback, useEffect } from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { Menu, Item, useContextMenu, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { useRecoilState } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import Shape from './Shape';
import RotateBox from './RotateBox';

const MENU_ID = 'blahblah';

const RightMenuList = [
    {
        text: '删除',
        value: 'delete'
    },
    {
        text: '置顶',
        value: 'top'
    },
    {
        text: '置底',
        value: 'bottom'
    },
    {
        text: '上移',
        value: 'moveup'
    },
    {
        text: '下移',
        value: 'movedown'
    },
]

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
    const { show } = useContextMenu({
        id: MENU_ID,
    });
    const handleItemClick = ({ event }: ItemParams) =>{
        console.log(event.currentTarget.dataset.type)
    };
    const selectCurrentComponent = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.stopPropagation();
        changeSnapshotSave((state) => ({
            ...state,
            selectedComponent: uuid,
        }))
    }, []);
    return (
        <>
            <div ref={drager} style={{ position: 'absolute', ...style }} onContextMenu={show} onMouseDown={selectCurrentComponent} onClick={selectCurrentComponent}>
                { selectedComponent === config.uuid && <Shape id={config.uuid}/> }
                { selectedComponent === config.uuid && <RotateBox/> }
                {children}
            </div>
            <Menu id={MENU_ID}>
                {
                    RightMenuList.map((item) => (
                        <Item key={item.value} data={config} data-type={item.value} onClick={handleItemClick}>{item.text}</Item>
                    ))
                }
            </Menu>
        </>
    )
}

export default SourceBox;
