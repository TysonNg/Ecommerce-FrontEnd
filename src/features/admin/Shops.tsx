'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { adminApi, errorMessage, ShopList } from './api';
import { LoadError, ShopTable } from './ShopTable';

export default function Shops() {
  const params = useSearchParams();
  const router = useRouter();
  const q = params.get('q') || '';
  const status = params.get('status') || 'pending';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const [data, setData] = useState<ShopList | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const navigate = (query: string, filter: string, target: number) => {
    const next = new URLSearchParams({ status: filter, page: String(target) });
    if (query.trim()) next.set('q', query.trim());
    router.push(`/admin/shops?${next}`);
  };
  useEffect(() => {
    const controller = new AbortController();
    setData(null); setError('');
    adminApi.shops({ q, status, page, limit: 20 }, controller.signal).then(setData)
      .catch((error) => { if (!controller.signal.aborted) setError(errorMessage(error)); });
    return () => controller.abort();
  }, [q, status, page, attempt]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const fields = new FormData(event.currentTarget);
    navigate(String(fields.get('q')), String(fields.get('status')), 1);
  };
  return <>
    <div className="admin-breadcrumb"><Link href="/admin">Admin</Link><span>/</span>Shops</div>
    <div className="admin-page-heading"><div><h1>Shops</h1><p>Review applications and view the shops in your marketplace.</p></div></div>
    <section className="admin-panel">
      <form key={`${q}:${status}`} className="admin-filters" onSubmit={submit}>
        <div className="admin-field"><label htmlFor="shop-search">Search shops</label><input id="shop-search" name="q" placeholder="Search by shop name…" maxLength={200} defaultValue={q} /></div>
        <div className="admin-field"><label htmlFor="shop-status">Status</label><select id="shop-status" name="status" defaultValue={status}><option value="all">All statuses</option><option value="pending">Pending</option><option value="active">Active</option><option value="rejected">Rejected</option></select></div>
        <button className="admin-button primary">Apply filters</button><Link className="admin-button" href="/admin/shops">Reset</Link>
      </form>
      {error ? <LoadError message={error} retry={() => setAttempt(attempt + 1)} /> : !data ? <div className="admin-empty" role="status">Loading shops…</div> : <>
        <ShopTable shops={data.items} />
        <footer className="admin-pagination"><span>{data.total.toLocaleString('en-GB')} shops · Newest first</span><nav aria-label="Shop pagination">
          <button className="admin-button" disabled={page <= 1} onClick={() => navigate(q, status, page - 1)}>Previous</button><span>Page {page} of {Math.max(1, data.totalPages)}</span><button className="admin-button" disabled={page >= data.totalPages} onClick={() => navigate(q, status, page + 1)}>Next</button>
        </nav></footer>
      </>}
    </section>
  </>;
}
