import { useEffect } from "react";

import { getCurrentUser } from "../../api/auth.api";

import { setCredentials, clearCredentials, setLoading } from "./authSlice";

import { useAppDispatch } from "../../app/hooks";

const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await getCurrentUser();

        dispatch(setCredentials(response.user));
      } catch {
        dispatch(clearCredentials());
      } finally {
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;
