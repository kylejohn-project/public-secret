import {
  Navigate,
  Outlet,
} from "react-router-dom";

import {
  isAdminAuthenticated,
} from "../../services/adminAuth";


export default function ProtectedAdminRoute() {
  if (
    !isAdminAuthenticated()
  ) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
}