import { Suspense } from 'react';
import Shops from '@/features/admin/Shops';
export default function ShopsPage() { return <Suspense fallback={<p role="status">Loading shops…</p>}><Shops /></Suspense>; }
