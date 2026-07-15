import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "../features/theme/ThemeContext.jsx";
import { useEffect, Suspense } from "react";
import { useGetUserQuery } from "../features/auth/api/auth.api.js";
import useAuth from "../features/auth/hooks/useAuth.js";
import Loader from "../shared/components/Loader.jsx";

function App() {
  const { data, isLoading } = useGetUserQuery();
  const { handleSetUser } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    
    if (data) {
      handleSetUser(data.data);
    } else {
      handleSetUser(null);
    }
  }, [data, isLoading]);

  return (
    <div className="h-screen w-full overflow-hidden">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <ThemeProvider>
        <Suspense fallback={
          <div className="h-screen w-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
            <Loader message="Loading page components..." />
          </div>
        }>
          <Outlet />
        </Suspense>
      </ThemeProvider>
    </div>
  );
}

export default App;
