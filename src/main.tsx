import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './index.css';
import App from './App';

//补丁，vite不会注入环境变量，会导致某些包运行错误
window.process = { env: { NODE_ENV: 'dev' } };

ReactDOM.render(
  <DndProvider backend={ HTML5Backend }>
    <App />
  </DndProvider>,
  document.getElementById('root')
)
