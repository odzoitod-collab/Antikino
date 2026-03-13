import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';
import BottomSheetMenu from './BottomSheetMenu';

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isChat = location.pathname === '/chat';
  const { siteName, error } = useSiteConfig();
  const displayName = siteName || 'Антикино';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col">
      {error && (
        <div className="sticky top-0 z-50 w-full bg-amber-950/95 text-amber-200 text-center py-2 px-4 text-sm border-b border-amber-800">
          {error}
        </div>
      )}
      <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-black tracking-tighter uppercase">
            {displayName}
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-widest">
            <Link to="/rooms" className="hover:text-pink-500 transition-colors">Залы</Link>
            <Link to="/addons" className="hover:text-pink-500 transition-colors">Услуги</Link>
            <Link to="/contacts" className="hover:text-pink-500 transition-colors">Контакты</Link>
            <Link to="/booking" className="bg-pink-500 text-white px-4 py-2 hover:bg-pink-600 transition-colors rounded-xl">Бронь</Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 -mr-2 text-zinc-300 hover:text-white"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col">
        <Outlet />
      </main>

      {!isChat && (
        <footer className="bg-zinc-950 border-t border-zinc-900 py-8 px-4 mt-auto">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mb-4">{displayName} © {new Date().getFullYear()}</p>
            <div className="flex justify-center gap-4 text-xs text-zinc-400">
              <a href="#" className="hover:text-white">VK</a>
              <a href="#" className="hover:text-white">Telegram</a>
              <a href="#" className="hover:text-white">Instagram</a>
            </div>
          </div>
        </footer>
      )}

      <BottomSheetMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </div>
  );
}
