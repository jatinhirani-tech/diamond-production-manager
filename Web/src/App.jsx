import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DiamondProvider } from './context/DiamondContext';
import AppLayout from './components/layout/AppLayout';

import Dashboard from './pages/Dashboard';
import DailyRecords from './pages/DailyRecords';
import AddDiamond from './pages/AddDiamond';
import MonthlySummary from './pages/MonthlySummary';
import MonthlyHistory from './pages/MonthlyHistory';
import Settings from './pages/Settings';

export default function App() {
  return (
    <DiamondProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="records" element={<DailyRecords />} />
            <Route path="add" element={<AddDiamond />} />
            <Route path="monthly" element={<MonthlySummary />} />
            <Route path="history" element={<MonthlyHistory />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DiamondProvider>
  );
}
