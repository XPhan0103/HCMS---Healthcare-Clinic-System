import * as React from "react";
import { Outlet } from "react-router-dom";

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col shadow-sm z-10">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-blue-600">
          <span className="font-bold text-white text-xl tracking-tight">HCMS Clinic</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* Navigation Links Placeholder */}
          <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-md text-sm font-semibold transition-colors cursor-pointer">
            Bảng điều khiển
          </div>
          <div className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors cursor-pointer">
            Lịch khám bệnh
          </div>
          <div className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md text-sm font-medium transition-colors cursor-pointer">
            Hồ sơ Bệnh nhi
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-500">Phiên bản 1.0 (MVP)</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar Placeholder */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
          <div className="font-semibold text-gray-800 text-lg">Trang chủ</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">Dr. Minh</div>
                <div className="text-xs text-gray-500">Bác sĩ chuyên khoa</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                BS
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
