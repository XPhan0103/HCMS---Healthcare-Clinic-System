import * as React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export const PrivateRoute: React.FC = () => {
  const location = useLocation();
  
  // TODO: Thay thế bằng state từ Zustand Store khi hoàn thiện Context
  const token = localStorage.getItem("access_token");
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) {
    console.warn("🔐 Truy cập bị từ chối. Chuyển hướng về đăng nhập.");
    // Đẩy người dùng về login và lưu lại URL mà họ muốn vào trước đó
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Nếu xác thực thành công, render các module/page con
  return <Outlet />;
};
