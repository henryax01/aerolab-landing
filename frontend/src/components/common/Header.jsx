import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle.jsx';
import LangSwitcher from './LangSwitcher.jsx';
import SearchBar from './SearchBar.jsx';
import NotificationBell from './NotificationBell.jsx';

const NAV_LABEL_KEYS = {
  '/': 'nav.home',
  '/about': 'nav.about',
  '/portfolio': 'nav.portfolio',
  '/order': 'nav.order',
  '/contact': 'nav.contact',
  '/account': 'nav.account',
};

export default function Header({ navPages, theme, onToggleTheme, brand, roleLevel, token }) {
  const { t } = useTranslation('common');
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-3 py-2 text-[11px] font-medium tracking-wider transition-all duration-200 ${
      isActive
        ? 'text-cyan-300'
        : 'text-slate-400 hover:text-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-40">
      {/* Top accent bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-80" />

      <div className="border-b border-slate-700/60 bg-slate-950/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">

          {/* Brand */}
          <NavLink to="/" className="group flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute inset-0 rounded border border-cyan-500/40 group-hover:border-cyan-400/70 transition-colors duration-300" />
              <div className="absolute inset-[3px] rounded border border-cyan-500/20" />
              <div className="h-2.5 w-2.5 rounded-sm bg-cyan-400 group-hover:shadow-[0_0_8px_#22d3ee] transition-all duration-300" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-[0.2em] uppercase text-slate-100 font-mono">
                {brand}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                <span className="text-[9px] tracking-widest uppercase text-emerald-400/80 font-mono">Sistema activo</span>
              </div>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <nav aria-label={t('nav_aria.mainNav')} className="hidden items-center gap-1 md:flex">
            {navPages.map((page) => (
              <NavLink key={page.path} to={page.path} className={linkClass}>
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    )}
                    <span className={isActive ? 'text-cyan-300' : ''}>
                      {t(NAV_LABEL_KEYS[page.path] || page.label, { defaultValue: page.label })}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="rounded border border-slate-700 bg-slate-900 px-1">
              <SearchBar roleLevel={roleLevel} className="w-48 lg:w-64 [&_input]:bg-transparent [&_input]:text-slate-200 [&_input]:placeholder:text-slate-500 [&_input]:border-0 [&_input]:focus:ring-0" />
            </div>
            <div className="flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2 py-1.5">
              <NotificationBell token={token} />
              <div className="mx-1 h-4 w-px bg-slate-700" />
              <LangSwitcher />
              <div className="mx-1 h-4 w-px bg-slate-700" />
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            id="mobile-menu-toggle"
            className="flex h-9 w-9 items-center justify-center rounded border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:border-cyan-500/50 hover:text-cyan-400 md:hidden"
            aria-label={t(menuOpen ? 'nav_aria.closeMenu' : 'nav_aria.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FaTimes aria-hidden="true" className="text-sm" /> : <FaBars aria-hidden="true" className="text-sm" />}
          </button>
        </div>

        {/* Bottom scan line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-600/40 to-transparent" />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-b border-slate-700/60 bg-slate-950/98 px-4 py-4 md:hidden"
        >
          <SearchBar roleLevel={roleLevel} className="mb-4" onNavigate={() => setMenuOpen(false)} />
          <nav aria-label={t('nav_aria.mobileNav')} className="flex flex-col gap-1">
            {navPages.map((page) => (
              <NavLink
                key={page.path}
                to={page.path}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {({ isActive }) => (
                  <>
                    <span className={`h-1 w-1 rounded-full ${isActive ? 'bg-cyan-400 shadow-[0_0_6px_#22d3ee]' : 'bg-slate-600'}`} />
                    <span>{t(NAV_LABEL_KEYS[page.path] || page.label, { defaultValue: page.label })}</span>
                    {isActive && <span className="ml-auto text-[9px] font-mono text-cyan-500 tracking-widest">ACTIVO</span>}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-4">
            <NotificationBell token={token} onNavigate={() => setMenuOpen(false)} />
            <LangSwitcher />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      )}
    </header>
  );
}
