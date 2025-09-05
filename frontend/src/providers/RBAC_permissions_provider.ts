import React, { createContext, useContext } from "react";
import { useGetIdentity } from "@refinedev/core";

type Identity = {
  id: string;
  name: string;
  email: string;
  role: string;   // 👈 important
};

const PermissionContext = createContext<{ role: string | null }>({ role: null });

export const PermissionProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: identity, isLoading } = useGetIdentity();

  const role = identity?.role ?? null;

  if (isLoading) return null; // show loader or nothing until role is fetched

  return (
    <PermissionContext.Provider value={{ role }}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = () => useContext(PermissionContext);