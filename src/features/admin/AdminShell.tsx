'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import api from '@/app/protected/protected';
import { adminAccessStatus, adminApi, errorMessage, errorStatus, Person, subscribeToAdminAccessLoss } from './api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChartSimple, faStore, faArrowLeft, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [account, setAccount] = useState<Person | null>(null);
  const [state, setState] = useState<'loading' | 'login' | 'denied' | 'ready' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const check = useCallback(async () => {
    setState('loading');
    if (!Cookies.get('accessToken')) { setState('login'); return; }
    try { setAccount(await adminApi.me()); setState('ready'); setMessage(''); }
    catch (error) {
      const status = adminAccessStatus(error);
      setMessage(status === 401 ? 'Your session has expired. Please sign in again.' : errorMessage(error));
      setState(status === 401 ? 'login' : status === 403 ? 'denied' : 'error');
    }
  }, []);
  useEffect(() => { void check(); }, [check]);
  useEffect(() => subscribeToAdminAccessLoss((status) => {
    setAccount(null);
    setMenuOpen(false);
    setState(status === 401 ? 'login' : 'denied');
    setMessage(status === 401 ? 'Your session has expired. Please sign in again.' : '');
  }), []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    setBusy(true); setMessage('');
    try {
      const { data } = await api.post('/user/login', { email: String(fields.get('email')).trim(), password: fields.get('password') });
      const { user, tokens } = data.metadata;
      Cookies.set('_id', user._id, { expires: 7 });
      Cookies.set('accessToken', tokens.accessToken, { expires: 1 });
      Cookies.set('refreshToken', tokens.refreshToken, { expires: 7 });
      localStorage.setItem('name', user.name); localStorage.setItem('isActive', 'true');
      await check();
    } catch (error) { setMessage(errorMessage(error)); }
    finally { setBusy(false); }
  };
  const logout = async () => {
    setBusy(true); setMessage('');
    try {
      await api.post('/user/logout');
    } catch (error) {
      if (errorStatus(error) !== 401) { setMessage(errorMessage(error)); setBusy(false); return; }
    }
    ['_id', 'accessToken', 'refreshToken'].forEach((key) => Cookies.remove(key));
    localStorage.removeItem('name'); localStorage.removeItem('isActive');
    setAccount(null); setState('login'); setBusy(false);
  };

  if (state !== 'ready') return (
    <div className="admin-ui admin-entry">
      <div className="admin-entry-brand"><span className="admin-brand-mark">E</span> E-Shop <span>Administration</span></div>
      <main className="admin-login-panel">
        {state === 'loading' ? <p role="status">Checking your account…</p> : state === 'login' ? <>
          <p className="admin-eyebrow">ADMIN ACCESS</p><h1>Sign in</h1>
          <p className="admin-muted">Manage shop applications and approvals.</p>
          <form onSubmit={login} className="admin-login-form">
            <label htmlFor="admin-email">Email address</label><input id="admin-email" name="email" type="email" autoComplete="username" required />
            <label htmlFor="admin-password">Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required />
            {message && <p role="alert" className="admin-error">{message}</p>}
            <button className="admin-button primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
        </> : <>
          <h1>{state === 'denied' ? 'Access denied' : 'Unable to load admin'}</h1>
          <p className="admin-muted" role="alert">{state === 'denied' ? 'Your account does not have administrator access.' : message}</p>
          <button className="admin-button" disabled={busy} onClick={state === 'denied' ? logout : check}>{state === 'denied' ? 'Sign out' : 'Retry'}</button>
        </>}
        <Link className="admin-back-link" href="/">← Back to store</Link>
      </main>
    </div>
  );

  return (
    <div className="admin-ui admin-shell">
      <a className="admin-skip" href="#admin-content">Skip to content</a>
      <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`} id="admin-navigation">
        <Link href="/admin" className="admin-brand"><span className="admin-brand-mark">E</span><span>E-Shop<small>ADMINISTRATION</small></span></Link>
        <p className="admin-nav-label">WORKSPACE</p>
        <nav aria-label="Admin navigation">
          <Link href="/admin" className={pathname === '/admin' ? 'selected' : ''} aria-current={pathname === '/admin' ? 'page' : undefined}><FontAwesomeIcon icon={faChartSimple} /> Overview</Link>
          <Link href="/admin/shops" className={pathname.startsWith('/admin/shops') ? 'selected' : ''} aria-current={pathname.startsWith('/admin/shops') ? 'page' : undefined}><FontAwesomeIcon icon={faStore} /> Shops</Link>
        </nav>
        <Link className="admin-store-link" href="/"><FontAwesomeIcon icon={faArrowLeft} /> Back to store</Link>
        <div className="admin-sidebar-footer">E-Shop management</div>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <button className="admin-button admin-menu-toggle" aria-expanded={menuOpen} aria-controls="admin-navigation" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><FontAwesomeIcon icon={faBars} /></button>
          <span className="admin-topbar-label">Administration <span>/ Shop approvals</span></span>
          <div className="admin-account"><span className="admin-avatar" aria-hidden="true">{account?.name?.charAt(0).toUpperCase()}</span><span>{account?.name}<small>Administrator</small></span>
            <button title="Sign out" aria-label="Sign out" className="admin-icon-button" disabled={busy} onClick={logout}><FontAwesomeIcon icon={faArrowRightFromBracket} /></button>
          </div>
        </header>
        <main id="admin-content" className="admin-content">
          {message && <p role="alert" className="admin-notice error">{message}</p>}
          {children}
        </main>
      </div>
    </div>
  );
}
