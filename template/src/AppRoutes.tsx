import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SamplePage from './pages/Sample.page';
import CustomLoginCallback from './components/auth/Okta/CustomLoginCallback';
import RequiredAuth from './components/auth/Okta/SecureRoute';
import DashBoardPage from './pages/Dashboard.page';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/login/callback"
        element={<CustomLoginCallback />}
      />
      <Route
        path="/logout/callback"
        element={<Navigate to="/sample" />}
      />
      <Route
        path="/*"
        element={<RequiredAuth />}>
        <Route
          path="dashboard"
          element={<DashBoardPage />}
        />
      </Route>
      <Route
        path="/"
        element={<Navigate to="/dashboard" />}
      />
      <Route
        path="sample"
        element={<SamplePage />}
      />
      <Route
        path="*"
        element={<>NOT Found</>}
      />
    </Routes>
  );
};

export default AppRoutes;
