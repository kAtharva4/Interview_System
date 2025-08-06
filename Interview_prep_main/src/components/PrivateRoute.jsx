// src/components/PrivateRoute.js
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
