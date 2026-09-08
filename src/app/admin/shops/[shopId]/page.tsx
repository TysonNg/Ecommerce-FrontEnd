import ShopDetail from '@/features/admin/ShopDetail';
export default async function ShopDetailPage({ params }: { params: Promise<{ shopId: string }> }) {
  const { shopId } = await params;
  return <ShopDetail shopId={shopId} />;
}
