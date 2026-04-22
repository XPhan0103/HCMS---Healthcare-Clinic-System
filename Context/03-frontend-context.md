# Layer 3: Frontend Technical Context (HCMS)

This layer providing deep technical specifications, directory mapping, and implementation samples for the React 19 frontend.

## 1. Primary Tech Stack
- **Framework:** React 19 (Functional Components + Hooks).
- **Build Tool:** Vite 8.0 (Lightning-fast development).
- **language:** TypeScript 5.0 (Strict typing).
- **Styling:** Tailwind CSS 5 (Utility-first design).
- **State Mgmt:** Zustand (Centralized logic) & React Context (Global themes/Auth).
- **Networking:** Axios + Axios Interceptors (Security).

## 2. Exploded Directory Structure

```text
frontend/src/
├── app/                     # App Core (Configuration & Setup)
│   ├── providers/           # App-wide context providers (Auth, Theme)
│   ├── routers/             # React Router 7 configuration
│   └── layouts/             # Standard Layouts (Dashboard, Auth, Public)
├── assets/                  # Static assets (images, vectors, fonts)
├── features/                # Bounded Contexts (Feature-specific logic & UI)
│   ├── booking/             # Context: Appointments
│   │   ├── components/      # Feature-specific sub-components
│   │   ├── services/        # API calls related to Booking
│   │   ├── store/           # Zustand store for booking state
│   │   └── pages/           # Page components (Dashboard, CreateBooking)
│   └── patient/             # Context: Patient Management
├── shared/                  # Reusable items (Global across features)
│   ├── components/          # Generic UI (Button, Input, Table, Modal)
│   ├── hooks/               # Custom hooks (useAuth, useClickOutside)
│   ├── services/            # Generic API client, Axios interceptors
│   ├── types/               # Common TypeScript interfaces/types
│   └── utils/               # Formatters, Validation helpers
└── styles/                  # Tailwind CSS, Global animations
```

## 3. Implementation Code Samples

### A. Modular Component with Tailwind (Shared)
```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

export const Button = ({ variant = 'primary', isLoading, children, ...props }: ButtonProps) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`} disabled={isLoading} {...props}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
};
```

### B. Custom Hook for API & State (Feature Service)
```typescript
import { create } from 'zustand';
import { patientService } from '@/shared/services/patient.service';

interface PatientState {
  patients: Patient[];
  loading: boolean;
  fetchPatients: () => Promise<void>;
}

// Feature Store using Zustand
export const usePatientStore = create<PatientState>((set) => ({
  patients: [],
  loading: false,
  fetchPatients: async () => {
    set({ loading: true });
    try {
      const response = await patientService.getAll();
      set({ patients: response.data, loading: false });
    } catch (error) {
      set({ loading: false });
      // Handle global error notification here
    }
  },
}));
```

### C. Feature Page Component
```tsx
import { usePatientStore } from '../store/usePatientStore';

export const PatientListPage = () => {
  const { patients, loading, fetchPatients } = usePatientStore();

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Danh sách Bệnh nhi</h1>
      {loading ? <SkeletonTable /> : <Table data={patients} columns={columns} />}
    </div>
  );
};
```

## 4. Design & Frontend Best Practices
- **Component Isolation:** Keep business logic outside of generic UI components in `shared/`. Generic components should only depend on props.
- **Type Safety:** Never use `any`. Always define interfaces for API responses and component props.
- **Interceptors:** Use Axios interceptors to automatically inject the JWT token into headers and handle 401 (Unauthorized) redirects.
- **Micro-Animations:** Use Tailwind `transition` and `hover` utilities for immediate feedback. For complex entrance animations, use `framer-motion`.
- **Responsive Design:** Follow "Mobile First." Use `sm:`, `md:`, `lg:` prefixes for all layouts.
