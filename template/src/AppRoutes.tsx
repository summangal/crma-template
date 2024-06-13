import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SamplePage from './pages/Sample.page';
import CustomLoginCallback from './components/auth/Okta/CustomLoginCallback';
import RequiredAuth from './components/auth/Okta/SecureRoute';

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
        path="/"
        element={<Navigate to="/sample" />}
      />
      <Route
        path="/*"
        element={<RequiredAuth />}>
        <Route
          path="sample"
          element={<SamplePage />}
        />
      </Route>
      <Route
        path="*"
        element={<>NOT Found</>}
      />
    </Routes>
  );
};

export default AppRoutes;
