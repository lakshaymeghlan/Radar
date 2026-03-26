"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { RefreshCw, Check, Clock, Rocket, Bell, Briefcase, Menu, X } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { RadarLogo } from './ui/radar-logo';

import { ThemeToggle } from './theme-toggle';
import { useAuth } from './auth-provider';
import { AuthModal } from './auth-modal';
import { NotificationDropdown } from './notification-dropdown';

const NavbarContent = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('mode');
  const [currentHash, setCurrentHash] = useState('');

  useEffect(() => {
    setCurrentHash(window.location.hash);
    const handleHashChange = () => setCurrentHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      setIsMobileMenuOpen(false); // Close menu on cleanup
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname, searchParams, currentHash]);

  const isActive = (path: string, mode?: string, hash?: string) => {
    if (mode) {
      return pathname === path && activeTab === mode;
    }
    if (hash) {
      return pathname === path && currentHash === hash;
    }
    return pathname === path && !activeTab && (!currentHash || currentHash === '#');
  };

  useEffect(() => {
    setLastSync(new Date().toLocaleTimeString());

    const openModal = () => setIsAuthModalOpen(true);
    window.addEventListener("open-auth-modal", openModal);
    return () => window.removeEventListener("open-auth-modal", openModal);
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setIsDone(false);
    try {
      await fetch('/api/fetch-news');
      await fetch('/api/fetch-startups');
      setIsDone(true);
      setLastSync(new Date().toLocaleTimeString());
      setTimeout(() => {
        setIsDone(false);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const navLinks = user ? (
    <>
      <Link 
        href="/inbox" 
        className={`relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
          isActive('/inbox') ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span className="relative z-10">Inbox</span>
        {isActive('/inbox') && (
          <motion.div
            layoutId="navTab"
            className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
      {user.role === 'builder' ? (
        <>
          <Link 
            href="/profile#startups" 
            className={`relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              isActive('/profile', undefined, '#startups') ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="relative z-10">My Startups</span>
            {isActive('/profile', undefined, '#startups') && (
              <motion.div
                layoutId="navTab"
                className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
          <Link 
            href="/profile#applicants" 
            className={`relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              isActive('/profile', undefined, '#applicants') ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="relative z-10">Applicants</span>
            {isActive('/profile', undefined, '#applicants') && (
              <motion.div
                layoutId="navTab"
                className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        </>
      ) : (
        <>
          <Link 
            href="/?mode=startups#content-section" 
            className={`relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              isActive('/', 'startups') ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="relative z-10">Browse Startups</span>
            {isActive('/', 'startups') && (
              <motion.div
                layoutId="navTab"
                className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
          <Link 
            href="/?mode=jobs#content-section" 
            className={`relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
              isActive('/', 'jobs') || isActive('/') ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="relative z-10">Find Jobs</span>
            {(isActive('/', 'jobs') || isActive('/')) && (
              <motion.div
                layoutId="navTab"
                className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </Link>
        </>
      )}
    </>
  ) : (
    <>
      <Link 
        href="/?mode=startups#content-section" 
        className={`relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
          isActive('/', 'startups') || isActive('/') ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span className="relative z-10">Browse Startups</span>
        {(isActive('/', 'startups') || isActive('/')) && (
          <motion.div
            layoutId="navTab"
            className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
      <Link 
        href="/?mode=jobs#content-section" 
        className={`relative px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
          isActive('/', 'jobs') ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span className="relative z-10">Find Jobs</span>
        {isActive('/', 'jobs') && (
          <motion.div
            layoutId="navTab"
            className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full"
            initial={false}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </>
  );

  return (
    <>
      <nav className="fixed top-0 z-[100] w-full px-2 sm:px-6 py-4 transition-all duration-700">
        <div 
          className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-8 py-3 rounded-full bg-white/70 dark:bg-slate-950/80 backdrop-blur-xl border border-white/40 dark:border-emerald-500/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-emerald-500/10 transition-all"
          suppressHydrationWarning
        >
          <div className="flex items-center gap-10" suppressHydrationWarning>
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-900 dark:bg-emerald-500 flex items-center justify-center text-white font-black text-xl sm:text-2xl group-hover:scale-110 transition-all duration-500 dark:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                B
              </div>
              <span className="text-xl sm:text-2xl font-bold tracking-tighter text-slate-900 dark:text-white dark:text-glow">
                Builds
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks}
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-6" suppressHydrationWarning>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {lastSync && (
              <div className="hidden lg:flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Last Sync: {lastSync}</span>
              </div>
            )}
            
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all duration-500 ${
                isDone 
                  ? 'bg-teal-500 text-white shadow-teal-200 shadow-lg' 
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
              } disabled:opacity-50`}
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="hidden sm:inline">Syncing...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : isDone ? (
                <>
                  <Check className="w-3 h-3" />
                  <span className="hidden sm:inline">Updated</span>
                  <span className="sm:hidden">Done</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3" />
                  <span className="hidden sm:inline">Update</span>
                  <span className="sm:hidden">Sync</span>
                </>
              )}
            </button>

            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:block">
                  <NotificationDropdown />
                </div>
                
                <Link 
                  href="/profile"
                  className="flex items-center gap-2 group px-1 sm:px-2 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition-all font-bold text-slate-900 dark:text-white"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-emerald-500 border border-slate-300 dark:border-emerald-500/30 overflow-hidden shadow-sm">
                    {user.image || user.avatar ? (
                      <img 
                        src={user.image || user.avatar} 
                        alt={user.name} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                </Link>

                <button 
                  onClick={() => logout()}
                  className="hidden md:block px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-500 hover:text-rose-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 sm:px-6 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
              >
                Sign In
              </button>
            )}

            <button 
              className="md:hidden p-2 text-slate-600 dark:text-slate-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden mt-4 mx-2 p-6 rounded-[2rem] bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border border-white/40 dark:border-emerald-500/20 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Navigation</span>
                  <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {user && <NotificationDropdown />}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {/* Extract individual links to make them easier to click on mobile */}
                  {user ? (
                    <>
                      <Link href="/inbox" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-emerald-500/20 transition-all flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest">Inbox</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </Link>
                      {user.role === 'builder' ? (
                        <>
                          <Link href="/profile#startups" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-emerald-500/20 transition-all">
                            <span className="text-xs font-bold uppercase tracking-widest">My Startups</span>
                          </Link>
                          <Link href="/profile#applicants" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-emerald-500/20 transition-all">
                            <span className="text-xs font-bold uppercase tracking-widest">Applicants</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href="/?mode=startups#content-section" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-emerald-500/20 transition-all">
                            <span className="text-xs font-bold uppercase tracking-widest">Browse Startups</span>
                          </Link>
                          <Link href="/?mode=jobs#content-section" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-emerald-500/20 transition-all">
                            <span className="text-xs font-bold uppercase tracking-widest">Find Jobs</span>
                          </Link>
                        </>
                      )}
                      <button 
                        onClick={() => logout()}
                        className="p-4 rounded-2xl bg-rose-500/5 text-rose-500 border border-rose-500/10 text-center text-xs font-bold uppercase tracking-widest mt-4"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/?mode=startups#content-section" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-emerald-500/20 transition-all">
                        <span className="text-xs font-bold uppercase tracking-widest">Browse Startups</span>
                      </Link>
                      <Link href="/?mode=jobs#content-section" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent hover:border-emerald-500/20 transition-all">
                        <span className="text-xs font-bold uppercase tracking-widest">Find Jobs</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export const Navbar = () => {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
};
