import React, { ReactNode } from 'react';
import { AppProvider } from './AppContext';
import { AuthProvider } from './AuthContext';
import { UIProvider } from './UIContext';
import { TransportationProvider } from './TransportationContext';
import { CommunityProvider } from './CommunityContext';
import { ServicesProvider } from './ServicesContext';
import { PropertiesProvider } from './PropertiesContext';
import { ContentProvider } from './ContentContext';
import { UserManagementProvider } from './UserManagementContext';
import { MarketplaceProvider } from './MarketplaceContext';

interface AppContextProvidersProps {
  children: ReactNode;
}

const AppContextProviders: React.FC<AppContextProvidersProps> = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <AppProvider>
          <UserManagementProvider>
            <ContentProvider>
              <PropertiesProvider>
                <ServicesProvider>
                  <TransportationProvider>
                    <CommunityProvider>
                      <MarketplaceProvider>
                        {children}
                      </MarketplaceProvider>
                    </CommunityProvider>
                  </TransportationProvider>
                </ServicesProvider>
              </PropertiesProvider>
            </ContentProvider>
          </UserManagementProvider>
        </AppProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default AppContextProviders;
