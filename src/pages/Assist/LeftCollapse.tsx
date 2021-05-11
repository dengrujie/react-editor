import React, { FC } from 'react';
import { useRecoilState } from 'recoil';
import { allConfiger } from '../../recoil/Configer/atom';
import './LeftCollapse.less';
import { Drawer } from 'antd';
import AnimationList from './AnimationList';
import ActionList from './ActionList';

const LeftCollapse:FC = () => {
    const [config, setConfig] = useRecoilState(allConfiger);
    const { actionModalState, animationModalState } = config;
    const hideModal = () => {
        setConfig((values) => ({
            ...values,
            actionModalState: false,
            animationModalState: false,
        }))
    }
    return (
        <Drawer
            visible={actionModalState || animationModalState}
            closable={false}
            placement="left"
            onClose={hideModal}
        >
            <div className='leftCollapse-body'>
                {
                    animationModalState && <AnimationList/>
                }
                {
                    actionModalState && <ActionList/>
                }
            </div>
        </Drawer>
    )
}

export default LeftCollapse;
