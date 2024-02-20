// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Kiểm tra token

  if (!isAuthenticated) {
    // Nếu không có token, chuyển hướng đến trang đăng nhập
    return <Navigate to="/login" />;
  }

  return children; // Nếu đã xác thực, hiển thị component con
};

export default ProtectedRoute;
