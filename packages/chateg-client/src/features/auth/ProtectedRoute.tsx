import { FC, ReactNode } from "react";
import { useAuth } from "./useAuth";
import { Navigate } from "react-router-dom";

export interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { authData } = useAuth();
  return authData ? children : <Navigate to="/login" replace />;
};
