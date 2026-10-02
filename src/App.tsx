/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { ClientCatalogView } from './components/ClientCatalogView';
import { AdminDashboard } from './components/AdminPanel/AdminDashboard';

const AppContent: React.FC = () => {
  const { viewMode } = useStore();

  return viewMode === 'admin' ? <AdminDashboard /> : <ClientCatalogView />;
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
