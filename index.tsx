import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { TransportationProvider } from './context/TransportationContext';
import { CommunityProvider } from './context/CommunityContext';
import { ServicesProvider } from './context/ServicesContext';
import { PropertiesProvider } from './context/PropertiesContext';
import { ContentProvider } from './context/ContentContext';
import { UserManagementProvider } from './context/UserManagementContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <AuthProvider>
        <UIProvider>
          <AppProvider>
            <UserManagementProvider>
              <ServicesProvider>
                <TransportationProvider>
                  <PropertiesProvider>
                    <CommunityProvider>
                      <ContentProvider>
                        <App />
                      </ContentProvider>
                    </CommunityProvider>
                  </PropertiesProvider>
                </TransportationProvider>
              </ServicesProvider>
            </UserManagementProvider>
          </AppProvider>
        </UIProvider>
      </AuthProvider>
    </HashRouter>
  </React.StrictMode>
);