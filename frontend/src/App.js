import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/global.css';
import styled from 'styled-components';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ResultPage from './pages/ResultPage';
import InsectListPage from './pages/InsectListPage';
import AboutPage from './pages/AboutPage';
import TestButtons from './test-buttons';
import SimpleApp from './SimpleApp';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Routes>
          <Route path="/" element={<SimpleApp />} />
          <Route path="/original" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/insects" element={<InsectListPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/test" element={<TestButtons />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

export default App;
