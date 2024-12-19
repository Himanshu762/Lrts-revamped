import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';
import { createRoot } from 'react-dom/client';
import { DarkModeProvider } from '../src/context/DarkModeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </StrictMode>
);