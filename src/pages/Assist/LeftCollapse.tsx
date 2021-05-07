import React, { FC } from 'react';
import { useRecoilState } from 'recoil';
import { allConfiger } from '../../recoil/Configer/atom';
import './LeftCollapse.less';
import { Modal } from 'antd';
import AnimationList from './AnimationList';

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
        <Modal 
            visible={actionModalState || animationModalState} 
            closable={false} 
            footer={null} 
            style={{ margin: 0, top: 0, height: '100%' }}
            bodyStyle={{ padding: 0 }}
            onCancel={hideModal}>
            <div className='leftCollapse-body'>
                {
                    animationModalState && <AnimationList/>
                }
            </div>
        </Modal>
    )
}

export default LeftCollapse;
