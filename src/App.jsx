import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CacheProvider } from './context/CacheContext';
import AppRoutes from './routes/AppRoutes';

/**
 * Root application component
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CacheProvider>
          <AppRoutes />
        </CacheProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
