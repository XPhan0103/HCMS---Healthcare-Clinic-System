import * as React from "react";
import { useEffect, useState } from "react";
import { usePatientStore } from "../store/usePatientStore";
import { PatientFilterBar } from "../components/PatientFilterBar";
import { PatientListBoard } from "../components/PatientListBoard";
import { useToast } from "@/shared/components/ToastProvider";

export const PatientPage: React.FC = () => {
  // Chỉ gọi Action Method (fetchPatients) để trigger state update. Data được tự bind ở component con.
  const { fetchPatients } = usePatientStore();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Gọi API trên mount
    fetchPatients(0, 20).catch(() => {
      // Vì ListBoard đã hiện giao diện error, toast ở đây chỉ như 1 thông báo phụ thêm
      // toast("Hệ thống gián đoạn khi tải dữ liệu", "error");
    });
  }, [fetchPatients]);

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    // TODO: Gắn debounce và truyền searchTerm vào tham số fetch api nếu Backend support
  };

  const handleOpenCreateModal = () => {
    toast("Tính năng 'Thêm Bệnh Nhi Mới' đang được xây dựng", "info");
  };

  return (
    <div className="h-full flex flex-col space-y-6 pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Danh sách Bệnh nhi</h1>
        <p className="text-base text-gray-500">Tra cứu, cập nhật thông tin và theo dõi hồ sơ y tế bệnh nhân.</p>
      </div>

      <PatientFilterBar 
        onSearch={handleSearch} 
        onOpenCreate={handleOpenCreateModal} 
      />
      
      <div className="flex-1">
        <PatientListBoard />
      </div>
    </div>
  );
};

export default PatientPage;
