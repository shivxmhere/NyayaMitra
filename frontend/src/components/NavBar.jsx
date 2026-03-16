import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import { Menu, X, LogOut } from 'lucide-react';

const AshokaChakra = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" className="flex-shrink-0">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#FF9933" strokeWidth="3" />
    <circle cx="50" cy="50" r="8" fill="#FF9933" />
    {[...Array(24)].map((_, i) => (
      <line key={i} x1="50" y1="12" x2="50" y2="42" stroke="#FF9933" strokeWidth="1.5"
        transform={`rotate(${i * 15} 50 50)`} />
    ))}
  </svg>
);

const navItems = [
  { path: '/dashboard', label: 'Dashboard', labelHi: 'डैशबोर्ड' },
  { path: '/case/1', label: 'My Case', labelHi: 'मेरा केस' },
  { path: '/ask', label: 'Ask Nyaya', labelHi: 'न्यायमित्र से पूछें' },
  { path: '/lawyers', label: 'Find Lawyer', labelHi: 'वकील खोजें' },
  { path: '/hearings', label: 'Hearings', labelHi: 'सुनवाइयाँ' },
];

export default function NavBar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const lang = localStorage.getItem('nyaya_lang') || 'hindi';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-bg-primary/90 backdrop-blur-xl border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <AshokaChakra />
          <div>
            <h1 className="font-devanagari text-lg font-bold text-accent-saffron leading-tight">
              न्यायमित्र
            </h1>
            <span className="text-[10px] text-text-tertiary tracking-widest uppercase">
              NyayaMitra
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === '/case/1' && location.pathname.startsWith('/case'));
            return (
              <Link key={item.path} to={item.path} className="relative nav-link">
                <span className={isActive ? 'text-accent-saffron' : ''}>
                  {lang === 'hindi' ? item.labelHi : item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent-saffron rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSelector />
          <span className="text-sm text-text-secondary">{user?.full_name}</span>
          <button onClick={logout} className="text-text-tertiary hover:text-accent-red transition-colors" title="Logout">
            <LogOut size={18} />
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-text-primary" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-bg-primary/95 backdrop-blur-xl border-b border-border-default"
          >
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block py-2 text-sm ${location.pathname === item.path ? 'text-accent-saffron' : 'text-text-secondary'}`}>
                  {lang === 'hindi' ? item.labelHi : item.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border-default flex items-center justify-between">
                <LanguageSelector />
                <button onClick={logout} className="text-accent-red text-sm flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
