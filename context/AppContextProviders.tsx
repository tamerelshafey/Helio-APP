import React from 'react';

// All data context providers have been deprecated and replaced by TanStack Query.
// This component now simply renders its children, or can be removed entirely in the future if no other global providers are needed.

const AppContextProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
    </>
  );
};

export default AppContextProviders;