import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { RootState, AppDispatch } from '../app/store';
import { getProfile } from '../features/auth/authThunks';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  // Local flag to indicate we're performing the initial auth/profile check.
  const [checking, setChecking] = useState(true);
  const checkedRef = useRef(false);

  useEffect(() => {
    if (!checkedRef.current) {
      checkedRef.current = true;
      // Dispatch the profile fetch and keep 'checking' true until it resolves/rejects.
      // The thunk returns a promise so we can use finally to update state.
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      dispatch(getProfile()).finally(() => setChecking(false));
    } else {
      // If we've already checked and there is no loading in the store, stop checking.
      if (!loading) setChecking(false);
    }
  }, [dispatch, loading]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    checking,
  };
};