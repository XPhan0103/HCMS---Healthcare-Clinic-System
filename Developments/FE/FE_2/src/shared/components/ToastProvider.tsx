import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).substring(2, 11);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-dismiss sau 3.5s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success": return <CheckCircle2 className="h-5 w-5 text-white" />;
      case "error": return <AlertCircle className="h-5 w-5 text-white" />;
      default: return <Info className="h-5 w-5 text-white" />;
    }
  };

  const getBgClass = (type: ToastType) => {
    switch (type) {
      case "success": return "bg-green-600";
      case "error": return "bg-red-600";
      default: return "bg-blue-600";
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center justify-between gap-3 min-w-[300px] px-4 py-3 rounded-lg shadow-lg text-sm text-white transform transition-all duration-300 animate-in slide-in-from-bottom-5",
              getBgClass(t.type)
            )}
          >
            <div className="flex items-center gap-3">
              {getIcon(t.type)}
              <span className="font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((i) => i.id !== t.id))}
              className="text-white/80 hover:text-white transition-colors focus:outline-none"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
