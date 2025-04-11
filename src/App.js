// src/App.js
import React from 'react';
import CustomFlow from './components/CustomFlow';
import { ReactFlowProvider } from 'reactflow';

function App() {
  return (
    <ReactFlowProvider>
      <CustomFlow />
    </ReactFlowProvider>
  );
}

export default App;
