import axios from 'axios';
import api from '@/app/protected/protected';

export type ShopStatus = 'pending' | 'active' | 'rejected';
export interface Person { _id: string; name: string; email: string }
export interface AdminShop {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  status: ShopStatus;
  ownerId: Person | null;
  reviewedBy: Person | null;
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
export interface ShopList { items: AdminShop[]; total: number; page: number; limit: number; totalPages: number }
export interface ShopSummary { total: number; pending: number; active: number; rejected: number }

type AccessLostListener = (status: 401 | 403) => void;
const accessLostListeners = new Set<AccessLostListener>();
export function subscribeToAdminAccessLoss(listener: AccessLostListener) {
  accessLostListeners.add(listener);
  return () => { accessLostListeners.delete(listener); };
}
export function adminAccessStatus(error: unknown): 401 | 403 | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  const status = error.response?.status;
  if (status && [400, 401, 403].includes(status) && error.config?.url?.includes('/user/handleRefreshToken')) return 401;
  return status === 401 || status === 403 ? status : undefined;
}
async function adminRequest<T>(request: Promise<T>): Promise<T> {
  try { return await request; }
  catch (error) {
    const status = adminAccessStatus(error);
    if (status) accessLostListeners.forEach((listener) => listener(status));
    throw error;
  }
}
export const adminApi = {
  me: async () => (await api.get('/admin/me')).data.metadata as Person,
  summary: async (signal?: AbortSignal) => (await adminRequest(api.get('/admin/shops/summary', { signal }))).data.metadata as ShopSummary,
  shops: async (params: { q?: string; status?: string; page?: number; limit?: number }, signal?: AbortSignal) =>
    (await adminRequest(api.get('/admin/shops', { params, signal }))).data.metadata as ShopList,
  shop: async (id: string, signal?: AbortSignal) => (await adminRequest(api.get(`/admin/shops/${id}`, { signal }))).data.metadata as AdminShop,
  review: async (id: string, action: 'approve' | 'reject', reason?: string) => adminRequest(api.patch(`/admin/shops/${id}/${action}`, { reason })),
};
export const errorStatus = (error: unknown) => axios.isAxiosError(error) ? error.response?.status : undefined;
export const errorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Unable to connect. Check your connection and try again.';
    if (error.response.status === 401) return 'Your session has expired. Please sign in again.';
    if (error.response.status === 403) return 'You do not have permission to perform this action.';
    if (error.response.status === 404) {
      const isShopRequest = /\/admin\/shops\/[a-f0-9]{24}(?:\/(?:approve|reject))?(?:\?.*)?$/i.test(error.config?.url || '');
      return isShopRequest ? 'This shop could not be found.' : 'The admin service is unavailable. Please try again later.';
    }
    return typeof error.response.data?.message === 'string' ? error.response.data.message : 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
};
export const formatDate = (date?: string) => date ? new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date(date)) : '—';
