import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import NodeResultsPage from './components/NodeResultsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/node/:nodeId" element={<NodeResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
