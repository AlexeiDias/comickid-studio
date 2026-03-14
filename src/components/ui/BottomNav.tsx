'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/library', icon: '📚', label: 'Library' },
  { href: '/editor/new', icon: '✏️', label: 'Create' },
  { href: '/gallery', icon: '🌟', label: 'Gallery' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-amber-900 tab-safe z-50">
      <div className="flex">
        {tabs.map(tab => {
          const isActive = pathname.startsWith(tab.href.replace('/new', ''));
          return (
            <Link key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center py-3 gap-1 transition-all ${
                isActive ? 'bg-amber-400' : 'bg-white'
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <span className={`text-xs font-extrabold ${isActive ? 'text-amber-900' : 'text-gray-500'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
