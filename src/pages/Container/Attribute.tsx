import React, { FC, memo } from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const Attribute: FC = memo(() => {
    return (
        <Tabs defaultActiveKey="attribute">
            <TabPane tab="属性" key="attribute">
                Content of Tab Pane 1
            </TabPane>
            <TabPane tab="动画" key="animation">
                Content of Tab Pane 2
            </TabPane>
            <TabPane tab="事件" key="event">
                Content of Tab Pane 3
            </TabPane>
        </Tabs>
    )
});

export default Attribute;
