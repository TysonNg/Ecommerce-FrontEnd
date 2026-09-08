import Link from 'next/link';
import { AdminShop, formatDate, ShopStatus } from './api';

export function StatusBadge({ status }: { status: ShopStatus }) {
  return <span className={`admin-badge ${status}`}>{status}</span>;
}

export function ShopTable({ shops }: { shops: AdminShop[] }) {
  if (!shops.length) return <div className="admin-empty"><h2>No shops found</h2><p>New applications will appear here. Try adjusting your filters.</p></div>;
  return <div className="admin-table-scroll" tabIndex={0} role="region" aria-label="Shop applications table">
    <table className="admin-table">
      <thead><tr>{['Shop', 'Owner', 'Email', 'Submitted', 'Status', 'Action'].map((title) => <th scope="col" key={title}>{title}</th>)}</tr></thead>
      <tbody>{shops.map((shop) => <tr key={shop._id}>
        <td><span className="admin-shop-name">{shop.name}</span><span className="admin-shop-slug">{shop.slug}</span></td>
        <td>{shop.ownerId?.name || 'Unavailable'}</td><td className="admin-muted">{shop.ownerId?.email || '—'}</td>
        <td>{formatDate(shop.createdAt)}</td><td><StatusBadge status={shop.status} /></td>
        <td><Link className="admin-text-link" href={`/admin/shops/${shop._id}`} aria-label={`View ${shop.name}`}>View →</Link></td>
      </tr>)}</tbody>
    </table>
  </div>;
}

export function LoadError({ message, retry }: { message: string; retry: () => void }) {
  return <div className="admin-empty"><p role="alert">{message}</p><button className="admin-button" onClick={retry}>Retry</button></div>;
}
