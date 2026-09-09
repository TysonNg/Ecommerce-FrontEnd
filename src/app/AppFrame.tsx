'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/shared/header';
import { Footer } from '@/shared/footer';
import { InitGuestId } from '@/features/users/actions/initGuestId';
import { GlobalProvider } from './context/GloBalProvider';
import LoginModal from '@/features/users/compornents/modalToAccess/LoginModal';

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return <>{children}</>;
  return (
    <GlobalProvider>
      <div className="site">
        <InitGuestId />
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <LoginModal />
        <Footer />
      </div>
    </GlobalProvider>
  );
}
