'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { adminApi, AdminShop, errorMessage, errorStatus, formatDate } from './api';
import { LoadError, StatusBadge } from './ShopTable';

export default function ShopDetail({ shopId }: { shopId: string }) {
  const [shop, setShop] = useState<AdminShop | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState('');
  const [dialogError, setDialogError] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const controller = new AbortController(); setError(''); setShop(null);
    adminApi.shop(shopId, controller.signal).then(setShop).catch((error) => { if (!controller.signal.aborted) setError(errorMessage(error)); });
    return () => controller.abort();
  }, [shopId, attempt]);
  const open = (next: 'approve' | 'reject') => { setAction(next); setReason(''); setDialogError(''); dialog.current?.showModal(); };
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (!action || busy) return;
    if (action === 'reject' && (!reason.trim() || reason.trim().length > 500)) { setDialogError('Enter a reason between 1 and 500 characters.'); return; }
    setBusy(true); setDialogError(''); setNotice('');
    try {
      await adminApi.review(shopId, action, reason.trim());
      setNotice(action === 'approve' ? 'Shop approved. The owner can now manage their shop.' : 'Shop rejected. The owner can view your reason.');
      dialog.current?.close(); setAction(null); setAttempt((value) => value + 1);
      heading.current?.focus();
    } catch (error) {
      if (errorStatus(error) === 409) {
        dialog.current?.close(); setAction(null); setNotice('This application has already been reviewed. The latest status is shown below.'); setAttempt((value) => value + 1);
        heading.current?.focus();
      } else setDialogError(errorMessage(error));
    } finally { setBusy(false); }
  };
  return <>
    <div className="admin-breadcrumb"><Link href="/admin">Admin</Link><span>/</span><Link href="/admin/shops">Shops</Link><span>/</span>Application</div>
    <div className="admin-page-heading"><div><h1 ref={heading} tabIndex={-1}>Shop application</h1><p>Review the business details before making a decision.</p></div><Link className="admin-button" href="/admin/shops">← Back to shops</Link></div>
    {notice && <p className="admin-notice" role="status">{notice}</p>}
    {error ? <section className="admin-panel"><LoadError message={error} retry={() => setAttempt(attempt + 1)} /></section> : !shop ? <p className="admin-panel admin-empty" role="status">Loading application…</p> : <div className="admin-detail-grid">
      <section className="admin-panel"><header className="admin-panel-header"><div><h2>{shop.name}</h2><p>{shop.slug}</p></div><StatusBadge status={shop.status} /></header>
        <div className="admin-detail-body"><dl>
          <div><dt>Owner</dt><dd>{shop.ownerId?.name || 'Unavailable'}</dd></div><div><dt>Email address</dt><dd>{shop.ownerId?.email || '—'}</dd></div>
          <div><dt>Submitted</dt><dd>{formatDate(shop.createdAt)}</dd></div><div><dt>Shop ID</dt><dd>{shop._id}</dd></div>
          <div className="wide"><dt>Description</dt><dd className="admin-description">{shop.description || 'No description provided.'}</dd></div>
          <div className="wide"><dt>Logo URL</dt><dd>{shop.logo && /^https?:\/\//i.test(shop.logo) ? <a className="admin-text-link" href={shop.logo} target="_blank" rel="noopener noreferrer">{shop.logo}</a> : 'No logo provided.'}</dd></div>
        </dl></div>
      </section>
      <section className="admin-panel"><header className="admin-panel-header"><h2>Application review</h2></header><div className="admin-detail-body">
        {shop.status === 'pending' ? <><p className="admin-muted">This shop is waiting for approval. Approving gives the owner access to seller tools.</p><div className="admin-review-actions"><button className="admin-button primary" disabled={busy} onClick={() => open('approve')}>Approve shop</button><button className="admin-button" disabled={busy} onClick={() => open('reject')}>Reject</button></div></> : <>
          <dl><div><dt>Decision</dt><dd><StatusBadge status={shop.status} /></dd></div><div><dt>Reviewed on</dt><dd>{formatDate(shop.reviewedAt)}</dd></div><div className="wide"><dt>Reviewed by</dt><dd>{shop.reviewedBy?.name || 'Not recorded'}{shop.reviewedBy?.email && <p className="admin-muted">{shop.reviewedBy.email}</p>}</dd></div></dl>
          {shop.status === 'rejected' && <p className="admin-review-reason"><strong>Reason</strong><br />{shop.rejectionReason || 'No reason recorded.'}</p>}
        </>}
      </div></section>
    </div>}
    <dialog className="admin-dialog" ref={dialog} aria-labelledby="review-title" onKeyDown={(event) => {
      if (event.key !== 'Tab') return;
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), textarea:not(:disabled)'));
      const first = controls[0]; const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }} onCancel={(event) => { if (busy) event.preventDefault(); }} onClose={() => setAction(null)}>
      <form onSubmit={submit}><h2 id="review-title">{action === 'approve' ? 'Approve this shop?' : 'Reject this application?'}</h2><p>{action === 'approve' ? 'The owner will be able to create products and manage their shop.' : 'Explain why this application is being declined. The shop owner will see this reason.'}</p>
        {action === 'reject' && <><label htmlFor="rejection-reason">Reason for rejection</label><textarea id="rejection-reason" value={reason} onChange={(event) => setReason(event.target.value)} required disabled={busy} aria-describedby="reason-count" aria-invalid={reason.trim().length > 500 || undefined} /><small id="reason-count">{reason.trim().length}/500 characters</small></>}
        {dialogError && <div className="admin-error" role="alert">{dialogError}</div>}
        <footer><button type="button" className="admin-button" autoFocus disabled={busy} onClick={() => dialog.current?.close()}>Cancel</button><button className={`admin-button ${action === 'approve' ? 'primary' : 'danger'}`} disabled={busy}>{busy ? 'Saving…' : action === 'approve' ? 'Confirm approval' : 'Confirm rejection'}</button></footer>
      </form>
    </dialog>
  </>;
}
