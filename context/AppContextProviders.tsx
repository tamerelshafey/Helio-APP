import React from 'react';
import { AuthProvider } from './AuthContext';
import { UIProvider } from './UIContext';
import { AppProvider } from './AppContext';
import { ServicesProvider } from './ServicesContext';
import { PropertiesProvider } from './PropertiesContext';
import { ContentProvider } from './ContentContext';
import { UserManagementProvider } from './UserManagementContext';
import { TransportationProvider } from './TransportationContext';
import { CommunityProvider } from './CommunityContext';
import { MarketplaceProvider } from './MarketplaceContext';

const AppContextProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <AppProvider>
          <UserManagementProvider>
            <ServicesProvider>
              <PropertiesProvider>
                <ContentProvider>
                  <TransportationProvider>
                    <MarketplaceProvider>
                      <CommunityProvider>
                        {children}
                      </CommunityProvider>
                    </MarketplaceProvider>
                  </TransportationProvider>
                </ContentProvider>
              </PropertiesProvider>
            </ServicesProvider>
          </UserManagementProvider>
        </AppProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default AppContextProviders;