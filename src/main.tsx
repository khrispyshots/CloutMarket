import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { CloutMarketProvider } from './engine/CloutMarketContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CloutMarketProvider>
      <App />
    </CloutMarketProvider>
  </StrictMode>,
);
