import React, { FC, useMemo } from 'react';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { useRecoilValue, useRecoilState } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import { activeComponent, editComponent } from '../../recoil/Component/selecotr';
import { Ilist, WRAPPERLEFT, WRAPPERTOP } from '../Container/Body';
import { calcLeftdistance } from '../../utils/componentCalculate';
import { allConfiger } from '../../recoil/Configer/atom';
import { cloneDeep } from 'lodash-es';
import { getUniqueId } from '../../utils/base';

export const MENU_ID = 'editor';

const RightMenuList = [
    {
        text: '复制',
        value: 'copy'
    },
    {
        text: '粘贴',
        value: 'paste'
    },
    {
        text: '剪切',
        value: 'shear'
    },
    {
        text: '删除',
        value: 'delete'
    },
    {
        text: '锁定',
        value: 'lock'
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

const ContextMenu: FC = () => {
    const configer = useRecoilValue(allConfiger);
    const currentComponent = useRecoilValue(activeComponent);
    const showMenuList = useMemo(() => {
        if(!currentComponent) {
            return RightMenuList.filter((item) => item.value === 'paste');
        }
        return RightMenuList
    }, [currentComponent]);
    const [componentState, setComponentState] = useRecoilState(componentStore);
    const { list } = componentState;
    const [editState, changeEditState] = useRecoilState(editComponent);
    const { currentIndex, data } = editState;
    const handleItemClick = ({ event }: ItemParams) =>{
        switch (event.currentTarget.dataset.type) {
            case 'copy':
                copyComponent();
                break;
            case 'paste':
                pasteComponent(event.clientX, event.clientY);
                break;
            case 'shear':
                copyComponent();
                deleComponent();
                break;
            case 'delete':
                deleComponent();
                break;        
            default:
                break;
        }
    };
    const copyComponent = () => {
        setComponentState((values) => ({
            ...values,
            copyData: {
                index: currentIndex,
                data: currentComponent
            }
        }));
    };
    const deleComponent = () => {
        changeEditState({
            type: 'remove'
        });
    };
    const pasteComponent = (x: number, y: number) => {
        const width = configer.modeOption.name === 'pc' ? 0 : configer.modeOption.style.width as number;
        const left = x - calcLeftdistance(width) - WRAPPERLEFT;
        const top = y - WRAPPERTOP;
        const newData = cloneDeep(data) as Ilist;
        newData.config.uuid = getUniqueId();
        newData.config.style.left = left;
        newData.config.style.top = top;
        changeEditState({
            type: 'add',
            data: newData
        });
    };

    return (
        <>
            <Menu id={MENU_ID}>
                {
                    showMenuList.map((item) => (
                        <Item key={item.value} data-type={item.value} onClick={handleItemClick}>{item.text}</Item>
                    ))
                }
            </Menu>
        </>
    )
}

export default ContextMenu;
