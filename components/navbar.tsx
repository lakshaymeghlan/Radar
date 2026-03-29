"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { Rocket, Bell, Briefcase, Menu, X, ExternalLink } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { RadarLogo } from './ui/radar-logo';

import { ThemeToggle } from './theme-toggle';
import { useAuth } from './auth-provider';
import { AuthModal } from './auth-modal';
import { NotificationDropdown } from './notification-dropdown';

const NavbarContent = () => {
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
    const openModal = () => setIsAuthModalOpen(true);
    window.addEventListener("open-auth-modal", openModal);
    return () => window.removeEventListener("open-auth-modal", openModal);
  }, []);


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
      <motion.a 
        href="https://build-what.vercel.app/" 
        target="_blank" 
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/50 dark:bg-sky-950/10 border border-[#009ED1]/20 hover:border-[#009ED1]/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-300 shadow-[0_2px_10px_-4px_rgba(0,158,209,0.2)] hover:shadow-[0_8px_20px_-8px_rgba(0,158,209,0.4)]"
      >
        <div className="relative flex items-center gap-2">
          <div className="w-6 h-6 rounded-[8px] bg-gradient-to-br from-[#009ED1] to-[#0088B5] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,158,209,0.4)] group-hover:rotate-12 transition-transform duration-500">
            <span className="text-[11px] font-black">B</span>
          </div>
          
          <span className="flex items-center text-[11px] font-black tracking-widest leading-none">
            <span className="text-slate-900 dark:text-white">BUILD</span>
            <span className="bg-gradient-to-r from-[#009ED1] to-sky-400 bg-clip-text text-transparent">WHAT</span>
          </span>
          
          <ExternalLink className="w-2.5 h-2.5 text-[#009ED1] opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Premium Badge */}
        <div className="absolute -top-2.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#009ED1] to-sky-400 text-[8px] font-black text-white shadow-lg shadow-sky-200 dark:shadow-none animate-bounce scale-90 group-hover:scale-100 transition-transform">
          NEW
        </div>

        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-[#009ED1]/5 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
      </motion.a>
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
      <motion.a 
        href="https://build-what.vercel.app/" 
        target="_blank" 
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/50 dark:bg-sky-950/10 border border-[#009ED1]/20 hover:border-[#009ED1]/50 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-300 shadow-[0_2px_10px_-4px_rgba(0,158,209,0.2)] hover:shadow-[0_8px_20px_-8px_rgba(0,158,209,0.4)]"
      >
        <div className="relative flex items-center gap-2">
          <div className="w-6 h-6 rounded-[8px] bg-gradient-to-br from-[#009ED1] to-[#0088B5] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(0,158,209,0.4)] group-hover:rotate-12 transition-transform duration-500">
            <span className="text-[11px] font-black">B</span>
          </div>
          
          <span className="flex items-center text-[11px] font-black tracking-widest leading-none">
            <span className="text-slate-900 dark:text-white">BUILD</span>
            <span className="bg-gradient-to-r from-[#009ED1] to-sky-400 bg-clip-text text-transparent">WHAT</span>
          </span>
          
          <ExternalLink className="w-2.5 h-2.5 text-[#009ED1] opacity-40 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Premium Badge */}
        <div className="absolute -top-2.5 -right-1.5 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#009ED1] to-sky-400 text-[8px] font-black text-white shadow-lg shadow-sky-200 dark:shadow-none animate-bounce scale-90 group-hover:scale-100 transition-transform">
          NEW
        </div>

        {/* Ambient Glow */}
        <div className="absolute inset-0 rounded-full bg-[#009ED1]/5 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500" />
      </motion.a>
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
                  
                    {/* Separate section for External Apps */}
                  <div className="mt-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-4 px-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Builds Ecosystem</span>
                       <div className="px-2 py-0.5 rounded-full bg-sky-500 text-[8px] font-bold text-white tracking-widest animate-pulse">LIVE</div>
                    </div>
                    <motion.a 
                      href="https://build-what.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.98 }}
                      className="group p-5 rounded-3xl bg-gradient-to-br from-white to-sky-50 dark:from-slate-900 dark:to-sky-950/20 border-2 border-sky-100 dark:border-sky-500/10 transition-all flex items-center justify-between shadow-[0_10px_30px_-15px_rgba(0,158,209,0.2)] active:shadow-inner"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#009ED1] to-[#0088B5] flex items-center justify-center text-white shadow-lg shadow-sky-200 dark:shadow-none transition-transform group-hover:rotate-12">
                            <Rocket className="w-6 h-6" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#009ED1] rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-base font-black uppercase tracking-widest text-slate-900 dark:text-white">BUILD</span>
                            <span className="text-base font-black uppercase tracking-widest text-[#009ED1]">WHAT</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-sky-400/60 font-medium">Real-world Problem Discovery</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-[#009ED1]" />
                      </div>
                    </motion.a>
                  </div>
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
