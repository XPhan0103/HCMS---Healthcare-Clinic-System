import * as React from "react";
import { usePatientStore } from "../store/usePatientStore";
import { Skeleton } from "@/shared/components/Skeleton";
import { User2, Calendar, Phone, Activity } from "lucide-react";

export const PatientListBoard: React.FC = () => {
  // Lấy data từ Hook, TUYỆT ĐỐI không gọi service axios ở đây
  const { patients, loading, error } = usePatientStore();

  // 1. Handling Loading Skeleton UI
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
             <div className="flex items-center gap-3">
               <Skeleton className="w-12 h-12 rounded-full" />
               <div className="space-y-2 flex-1">
                 <Skeleton className="h-4 w-3/4" />
                 <Skeleton className="h-3 w-1/2" />
               </div>
             </div>
             <Skeleton className="h-4 w-full mt-2" />
             <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Handling Error Context
  if (error) {
    return (
      <div className="p-8 text-center bg-red-50/80 rounded-2xl border border-red-100 text-red-600 shadow-sm animate-in fade-in">
        <Activity className="w-10 h-10 mx-auto text-red-400 mb-2" />
        <p className="font-bold text-lg">Lỗi tải dữ liệu</p>
        <p className="text-sm mt-1 text-red-500">{error}</p>
      </div>
    );
  }

  // 3. Handling Empty State
  if (!patients || patients.length === 0) {
    return (
      <div className="p-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center animate-in fade-in">
        <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300 ring-4 ring-gray-50">
          <User2 size={36} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">Chưa có hồ sơ nào</h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
          Phòng khám hiện chưa có bệnh nhi nào được lưu dữ liệu hoặc từ khóa tìm kiếm của bạn không trùng khớp.
        </p>
      </div>
    );
  }

  // 4. Default Render (Mảng Patients)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
      {patients.map((p) => (
        <div key={p.id} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50/80 text-blue-600 rounded-full flex items-center justify-center font-extrabold text-lg ring-1 ring-blue-100/50 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {p.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 leading-tight">{p.fullName}</h4>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-1.5">
                  <span className="px-2 py-0.5 bg-gray-100 rounded-md text-gray-600 font-medium">
                    {p.gender === 'MALE' ? 'Nam' : p.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded-md">
              #{p.id}
            </div>
          </div>
          
          <div className="space-y-2.5 mt-5 text-sm text-gray-600 pt-4 border-t border-gray-50">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="font-medium text-gray-800">{p.parentPhoneNumber || 'Chưa có thông tin'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{p.dateOfBirth ? new Date(p.dateOfBirth).toLocaleDateString('vi-VN') : '---'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
