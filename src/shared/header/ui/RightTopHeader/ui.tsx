import Link from 'next/link';

export const RightTopHeader = () => {
  return (
    <ul className="flex items-center gap-4 lg:gap-6 text-xs tracking-wide text-white/85 whitespace-nowrap py-2.5">
      <li>
        <Link href="/return-policy" className="hover:text-white transition-colors duration-150">
          Shipping & return
        </Link>
      </li>
      <li>
        <Link href="/orders" className="hover:text-white transition-colors duration-150">
          Track order
        </Link>
      </li>
    </ul>
  );
};