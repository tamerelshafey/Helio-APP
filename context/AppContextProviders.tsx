import React from 'react';
import { AuthProvider } from './AuthContext';
import { UIProvider } from './UIContext';
import { AppProvider } from './AppContext';
import { TransportationProvider } from './TransportationContext';
import { CommunityProvider } from './CommunityContext';
import { MarketplaceProvider } from './MarketplaceContext';
import { OffersProvider } from './OffersContext';

const AppContextProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <AuthProvider>
        <AppProvider>
          <TransportationProvider>
            <MarketplaceProvider>
              <CommunityProvider>
                <OffersProvider>
                  {children}
                </OffersProvider>
              </CommunityProvider>
            </MarketplaceProvider>
          </TransportationProvider>
        </AppProvider>
      </AuthProvider>
    </UIProvider>
  );
};

export default AppContextProviders;