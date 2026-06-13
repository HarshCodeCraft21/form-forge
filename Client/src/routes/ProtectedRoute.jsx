import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFormStore } from '../store/useFormStore';

export const ProtectedRoute = ({ children }) => {
  const { user, loadingAuth } = useFormStore();

  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[#4F46E5] animate-spin" />
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B]">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated user to login screen
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
