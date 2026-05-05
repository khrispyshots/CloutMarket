import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThirdwebProvider } from 'thirdweb/react';
import App from './App.tsx';
import { CloutMarketProvider } from './engine/CloutMarketContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider>
      <CloutMarketProvider>
        <App />
      </CloutMarketProvider>
    </ThirdwebProvider>
  </StrictMode>,
);
