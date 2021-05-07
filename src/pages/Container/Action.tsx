import React, { FC, memo } from 'react';
import { Button } from 'antd';
import { useSetRecoilState } from 'recoil';
import { allConfiger } from '../../recoil/Configer/atom';

const Action: FC = memo(() => {
    const changeConfiger = useSetRecoilState(allConfiger);
    const showActionModal = () => {
        changeConfiger((values) => ({
            ...values,
            actionModalState: true
        }));
    };
    return (
        <div>
            <div style={{textAlign: 'center'}}><Button onClick={showActionModal}>添加事件</Button></div>
        </div>
    )
});

export default Action;