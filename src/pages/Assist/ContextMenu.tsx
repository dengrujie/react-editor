import React, { FC } from 'react';
import { Menu, Item, ItemParams } from 'react-contexify';
import 'react-contexify/dist/ReactContexify.css';

export const MENU_ID = 'editor';

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

const ContextMenu: FC = () => {
    const handleItemClick = ({ event }: ItemParams) =>{
        console.log(event.currentTarget.dataset.type)
    };
    return (
        <>
            <Menu id={MENU_ID}>
                {
                    RightMenuList.map((item) => (
                        <Item key={item.value} data-type={item.value} onClick={handleItemClick}>{item.text}</Item>
                    ))
                }
            </Menu>
        </>
    )
}

export default ContextMenu;
