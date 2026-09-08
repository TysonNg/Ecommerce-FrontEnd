import api from '@/app/protected/protected';

export type ShopStatus = 'pending' | 'active' | 'rejected';

export interface Shop {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  status: ShopStatus;
  rejectionReason?: string;
}

export interface CreateShopInput {
  name: string;
  logo?: string;
  description?: string;
}

export const getMyShop = async (): Promise<Shop | null> => {
  const response = await api.get('/shop/me');
  return response.data.metadata;
};

export const createShop = async (input: CreateShopInput): Promise<Shop> => {
  const response = await api.post('/shop', input);
  return response.data.metadata;
};
