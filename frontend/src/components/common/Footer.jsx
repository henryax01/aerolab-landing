import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const NAV_LINKS = [
  { to: '/',          key: 'nav.home' },
  { to: '/about',     key: 'nav.about' },
  { to: '/portfolio', key: 'nav.portfolio' },
  { to: '/order',     key: 'nav.order' },
  { to: '/contact',   key: 'nav.contact' },
];

const LEGAL_LINKS = [
  { to: '/terms',   key: 'footer.terms' },
  { to: '/privacy', key: 'footer.privacy' },
];

const SOCIAL_LINKS = [
  { href: '#', Icon: FaGithub,   label: 'GitHub' },
  { href: '#', Icon: FaLinkedin, label: 'LinkedIn' },
  { href: '#', Icon: FaInstagram, label: 'Instagram' },
];

export default function Footer({ brand }) {
  const { t } = useTranslation('common');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* Brand column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center">
                <div className="absolute inset-0 rounded border border-cyan-500/40" />
                <div className="absolute inset-[3px] rounded border border-cyan-500/20" />
                <div className="h-2.5 w-2.5 rounded-sm bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </div>
              <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-slate-100">
                {brand}
              </span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-slate-500">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-400/70">
                {t('footer.status')}
              </span>
            </div>
          </div>

          {/* Nav column */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] font-semibold tracking-widest uppercase text-slate-500">
              {t('nav.menu')}
            </p>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="w-fit text-xs tracking-wider text-slate-500 transition-colors duration-200 hover:text-cyan-400"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social column */}
          <div className="flex flex-col gap-3">
            <p className="font-mono text-[10px] font-semibold tracking-widest uppercase text-slate-500">
              {t('footer.social')}
            </p>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded border border-slate-800 text-slate-500 transition-all duration-200 hover:border-cyan-500/50 hover:text-cyan-400 hover:shadow-[0_0_8px_#22d3ee40]"
                >
                  <Icon className="text-base" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-slate-600">
            © {year} {brand}. {t('footer.rights')}
          </p>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-[11px] tracking-wider text-slate-600 transition-colors duration-200 hover:text-cyan-400"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
          <p className="font-mono text-[10px] tracking-widest uppercase text-slate-700">
            v1.0.0 // Build estable
          </p>
        </div>
      </div>
    </footer>
  );
}
