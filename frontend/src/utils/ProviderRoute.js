import { Outlet, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProviderRoute = ({ path, ...props }) => {
  const { user } = useContext(AuthContext);

  return user.is_provider ? <Outlet /> : <Navigate to="/" />;
};

export default ProviderRoute;