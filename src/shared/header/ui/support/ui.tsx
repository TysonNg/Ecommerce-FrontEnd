import Link from 'next/link';

export const Supports = () => {
  return (
    <ul className="flex items-center gap-4 lg:gap-6 text-xs tracking-wide text-white/85 whitespace-nowrap py-2.5">
      <li>
        <Link href="/faq" className="hover:text-white transition-colors duration-150">
          FAQs
        </Link>
      </li>
      <li>
        <Link href="/contact" className="hover:text-white transition-colors duration-150">
          Help
        </Link>
      </li>
      <li>
        <Link href="/contact" className="hover:text-white transition-colors duration-150">
          Support
        </Link>
      </li>
    </ul>
  );
};