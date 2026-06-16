import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/about', label: 'Nosotros' },
  { to: '/portfolio', label: 'Servicios' },
  { to: '/order', label: 'Pedidos' },
  { to: '/contact', label: 'Contacto' },
];

const LEGAL_LINKS = [
  { to: '/terms', key: 'terms' },
  { to: '/privacy', key: 'privacy' },
];

export default function Footer({ brand }) {
  const { t } = useTranslation('common');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex h-7 w-7 items-center justify-center">
                <div className="absolute inset-0 rounded border border-cyan-500/40" />
                <div className="h-2 w-2 rounded-sm bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
              </div>
              <span className="font-mono text-sm font-bold tracking-[0.2em] uppercase text-slate-100">
                {brand}
              </span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-slate-500">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest uppercase text-emerald-400/70">
                Sistemas operativos
              </span>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-xs tracking-wider text-slate-500 transition-colors duration-200 hover:text-cyan-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-slate-800 pt-6 md:flex-row md:items-center">
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
                {t(`footer.${link.key}`)}
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
