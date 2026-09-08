'use client';

import { FormEvent, useState } from 'react';
import { createShop } from '../actions/shop';

export const ShopRegistrationForm = () => {
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError('Shop name is required.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await createShop({ name: name.trim(), logo: logo.trim(), description: description.trim() });
      window.dispatchEvent(new Event('shop-status-updated'));
    } catch {
      setError('We could not submit your shop registration. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-xl border border-[#d3d3d3] bg-white p-6 text-[#333] sm:p-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0573f0]">Seller account</p>
      <h1 className="mt-2 text-2xl font-bold">Open your shop</h1>
      <p className="mt-2 text-sm leading-6 text-[#7f7d7d]">Submit your shop details. You can start managing products after an administrator approves the application.</p>

      <label className="mt-6 block text-sm font-semibold" htmlFor="shop-name">Shop name</label>
      <input id="shop-name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full border border-[#d3d3d3] px-3 py-2 outline-none focus:border-[#0573f0]" maxLength={120} required />

      <label className="mt-4 block text-sm font-semibold" htmlFor="shop-logo">Logo URL <span className="font-normal text-[#7f7d7d]">(optional)</span></label>
      <input id="shop-logo" type="url" value={logo} onChange={(event) => setLogo(event.target.value)} className="mt-2 w-full border border-[#d3d3d3] px-3 py-2 outline-none focus:border-[#0573f0]" placeholder="https://" />

      <label className="mt-4 block text-sm font-semibold" htmlFor="shop-description">Description <span className="font-normal text-[#7f7d7d]">(optional)</span></label>
      <textarea id="shop-description" value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-28 w-full border border-[#d3d3d3] px-3 py-2 outline-none focus:border-[#0573f0]" maxLength={1000} />

      {error && <p className="mt-4 text-sm text-[#dd3b3b]">{error}</p>}
      <button disabled={isSubmitting} className="mt-6 bg-[#0573f0] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#045fca] disabled:cursor-not-allowed disabled:opacity-60" type="submit">
        {isSubmitting ? 'Submitting...' : 'Submit for approval'}
      </button>
    </form>
  );
};
