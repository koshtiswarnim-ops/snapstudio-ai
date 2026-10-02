import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Menu, X, CreditCard, LayoutDashboard, History, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCredits } from '../context/CreditContext';

export const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { availableCredits } = useCredits();

  const navLinks = [
    { label: 'WORKSPACES', path: '/generate' },
    { label: 'HISTORY', path: '/history' },
    { label: 'PRICING', path: '/pricing' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] z-50 bg-ground/80 backdrop-scientific border-b border-hairline transition-all duration-200">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Wordmark with Glowing Accent Dot */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent-cyan shadow-[0_0_8px_#4FD8E8]"></span>
          </span>
          <span className="font-heading font-extrabold text-lg tracking-tightHeading text-ink group-hover:text-accent-cyan transition-colors">
            SnapStudio<span className="text-accent-cyan">.AI</span>
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-ground-secondary border border-hairline font-mono-label text-[9px] text-ink-muted">
            v2.4 INSTRUMENT
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-7">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-mono-label text-[10.5px] tracking-monoLabel transition-colors ${
                isActive(link.path)
                  ? 'text-accent-cyan font-semibold'
                  : 'text-ink-secondary hover:text-accent-cyan'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action / Auth Status */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Credit Balance Indicator */}
              <Link
                to="/billing"
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-scientific bg-ground-secondary border border-hairline hover:border-accent-cyan/40 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5 text-accent-cyan" />
                <span className="font-mono-label text-[10px] text-ink">
                  {availableCredits} CREDITS
                </span>
              </Link>

              {/* Dashboard Link */}
              <Link
                to="/dashboard"
                className={`p-1.5 rounded-scientific transition-colors ${
                  isActive('/dashboard')
                    ? 'text-accent-cyan bg-accent-cyan/10'
                    : 'text-ink-secondary hover:text-ink'
                }`}
                title="Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
              </Link>

              {/* Profile Link */}
              <Link
                to="/profile"
                className={`p-1.5 rounded-scientific transition-colors ${
                  isActive('/profile')
                    ? 'text-accent-cyan bg-accent-cyan/10'
                    : 'text-ink-secondary hover:text-ink'
                }`}
                title="Profile Settings"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* CTA Button */}
              <Link
                to="/generate"
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-[10.5px] hover:bg-accent-cyan/90 transition-all shadow-[0_0_12px_rgba(79,216,232,0.25)]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>GENERATE IMAGE</span>
              </Link>

              <button
                onClick={logout}
                className="p-1.5 text-ink-muted hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="font-mono-label text-[10.5px] text-ink-secondary hover:text-ink transition-colors"
              >
                LOGIN
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-[10.5px] hover:bg-accent-cyan/90 transition-colors"
              >
                START FREE
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-ink-secondary hover:text-ink"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-ground-secondary border-b border-hairline px-6 py-5 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`font-mono-label text-xs tracking-monoLabel ${
                  isActive(link.path) ? 'text-accent-cyan font-bold' : 'text-ink-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-3 border-t border-hairline flex flex-col space-y-3">
            {user ? (
              <>
                <div className="flex items-center justify-between text-xs font-mono-label text-ink-secondary">
                  <span>ACCOUNT CREDITS:</span>
                  <span className="text-accent-cyan font-bold">{availableCredits} CREDITS</span>
                </div>
                <Link
                  to="/generate"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2 text-center rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs"
                >
                  GENERATE IMAGE
                </Link>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2 text-center rounded-scientific bg-ground-tertiary border border-hairline text-ink font-mono-label text-xs"
                >
                  DASHBOARD
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full text-left font-mono-label text-xs text-red-400 py-1"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2 text-center rounded-scientific bg-ground-tertiary border border-hairline text-ink font-mono-label text-xs"
                >
                  LOGIN
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-2 text-center rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs"
                >
                  CREATE ACCOUNT
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
