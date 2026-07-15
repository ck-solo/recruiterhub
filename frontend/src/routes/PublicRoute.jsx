import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectInitialized } from '../features/auth/auth.slice';
import Loader from '../shared/components/Loader';

export const PublicRoute = () => {
  const user = useSelector(selectUser);
  const initialized = useSelector(selectInitialized);

  if (!initialized) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
        <Loader message="Checking session..." />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  return <Outlet />;
};