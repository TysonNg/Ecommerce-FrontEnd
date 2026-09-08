import AdminShell from '@/features/admin/AdminShell';
import './admin.css';

export const metadata = { title: 'E-Shop Administration', robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
