import React, { FC } from 'react';
import { RecoilRoot } from 'recoil';
import { Layout } from 'antd';
import Headers from "./pages/Container/Header";
import ComponentList from './pages/Container/ComponentList';
import Attribute from "./pages/Container/Attribute";
import Body from "./pages/Container/Body";
import './App.css';

const { Header, Content, Sider } = Layout;

const App: FC = () => {

  return (
    <RecoilRoot>
      <Layout>
        <Header style={{ backgroundColor: '#fff', marginBottom: 10 }}>
          <Headers></Headers>
        </Header>
        <Layout>
          <Sider theme='light' width={250}>
            <ComponentList />
          </Sider>
          <Content style={{ padding: '0 15px' }}>
            <Body />
          </Content>
          <Sider theme='light' width={300}>
            <Attribute />
          </Sider>
        </Layout>
      </Layout>
    </RecoilRoot>
  )
}

export default App