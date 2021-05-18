import React, { FC, useMemo } from 'react';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';
import { useRecoilValue, useRecoilState } from 'recoil';
import { componentStore } from '../../recoil/Component/atom';
import { activeComponent, editComponent } from '../../recoil/Component/selecotr';

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
    const currentComponent = useRecoilValue(activeComponent);
    const showMenuList = useMemo(() => {
        if(!currentComponent) {
            return RightMenuList.filter((item) => item.value === 'paste');
        }
        return RightMenuList
    }, [currentComponent]);
    const [componentState, setComponentState] = useRecoilState(componentStore);
    const { list } = componentState;
    const [editState] = useRecoilState(editComponent);
    const { currentIndex } = editState;
    const handleItemClick = ({ event }: ItemParams) =>{
        switch (event.currentTarget.dataset.type) {
            case 'copy':
                copyComponent()
                break;
            case 'paste':
                
                break;
            case 'shear':
                
                break;
            case 'delete':
                
                break;        
            default:
                break;
        }
    };
    const copyComponent = () => {
        console.log(list, currentIndex)
        setComponentState((values) => ({
            ...values,
            copyData: {
                index: currentIndex,
                data: currentComponent
            }
        }))
    }
    const deleComponent = () => {}
    const pasteComponent = () => {}

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
