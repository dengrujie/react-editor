import React, { FC, memo } from 'react';
import { Tabs } from 'antd';
import { useRecoilValue } from 'recoil';
import { activeComponent } from '../../recoil/Component/selecotr';
import Action from './Action';
import Animation from './Animation';
import Property from './Property';

const { TabPane } = Tabs;

const Attribute: FC = memo(() => {
    const currentComponent = useRecoilValue(activeComponent);
    return (
        <Tabs defaultActiveKey="property">
            <TabPane tab="属性" key="property">
                {
                    currentComponent && <Property/>
                }
            </TabPane>
            <TabPane tab="动画" key="animation">
                {
                    currentComponent && <Animation/>
                }
            </TabPane>
            <TabPane tab="事件" key="event">
                {
                    currentComponent && <Action/>
                }
            </TabPane>
        </Tabs>
    )
});

export default Attribute;
