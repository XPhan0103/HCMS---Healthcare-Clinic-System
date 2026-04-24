import * as React from "react";
import { Search, Plus } from "lucide-react";
import { InputField } from "@/shared/components/InputField";
import { Button } from "@/shared/components/Button";

interface Props {
  onSearch: (value: string) => void;
  onOpenCreate: () => void;
}

export const PatientFilterBar: React.FC<Props> = ({ onSearch, onOpenCreate }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 transition-all hover:shadow-md">
      <div className="w-full sm:w-96">
        <InputField 
          placeholder="Tìm kiếm tên, SĐT bệnh nhi..." 
          leftIcon={<Search className="w-4 h-4" />}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <Button onClick={onOpenCreate} className="w-full sm:w-auto shrink-0 shadow-sm">
        <Plus className="w-4 h-4 mr-2" />
        Thêm Bệnh Nhi Mới
      </Button>
    </div>
  );
};
