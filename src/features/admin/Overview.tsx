'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi, AdminShop, errorMessage, ShopSummary } from './api';
import { LoadError, ShopTable } from './ShopTable';

export default function Overview() {
  const [data, setData] = useState<{ summary: ShopSummary; shops: AdminShop[] } | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(''); setData(null);
    Promise.all([adminApi.summary(controller.signal), adminApi.shops({ status: 'pending', limit: 5 }, controller.signal)])
      .then(([summary, shops]) => setData({ summary, shops: shops.items }))
      .catch((error) => { if (!controller.signal.aborted) setError(errorMessage(error)); });
    return () => controller.abort();
  }, [attempt]);
  return <>
    <div className="admin-breadcrumb">Admin <span>/</span> Overview</div>
    <div className="admin-page-heading"><div><p className="admin-eyebrow">WORKSPACE OVERVIEW</p><h1>Shop approvals</h1><p>A clear view of your shops and the applications waiting for review.</p></div><Link className="admin-button" href="/admin/shops">Manage shops →</Link></div>
    {error ? <section className="admin-panel"><LoadError message={error} retry={() => setAttempt(attempt + 1)} /></section> : !data ? <div className="admin-panel admin-empty" role="status">Loading overview…</div> : <>
      <div className="admin-stats">{([
        ['total', 'Total shops', 'All registered shops', 'all'],
        ['pending', 'Pending', 'Awaiting your review', 'pending'],
        ['active', 'Active', 'Approved to sell', 'active'],
        ['rejected', 'Rejected', 'Applications declined', 'rejected'],
      ] as const).map(([key, label, caption, status]) => <Link key={key} className={`admin-stat ${key}`} href={`/admin/shops?status=${status}`}>
        <div className="admin-stat-top">{label}<span aria-hidden="true">↗</span></div><strong>{data.summary[key].toLocaleString('en-GB')}</strong><small>{caption}</small>
      </Link>)}</div>
      <section className="admin-panel"><header className="admin-panel-header"><div><h2>Pending applications</h2><p>The most recent shops waiting for approval.</p></div><Link className="admin-text-link" href="/admin/shops">View all →</Link></header><ShopTable shops={data.shops} /></section>
    </>}
  </>;
}
