import React, { FC, memo } from 'react';
import { Button } from 'antd';
import DragerBox from '../Assist/DragerBox';
import { ComponentsList } from '../../components';

export type ComponentConfig = {
    name: string;
    value: ComponentsList;
}

const store: ComponentConfig[] = [
    {
        name: '按钮',
        value: 'CustomButton',
    }
]

const ComponentList: FC = memo(() => {
    return (
        <>
        {store.map((item) => (
            <DragerBox key={item.value} config={item}>
                <Button>
                    {item.name}
                </Button>
            </DragerBox>
        ))}
        </>
    )
});

export default ComponentList;
