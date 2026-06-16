import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  FaHandshake, FaGem, FaUsers, FaRocket, FaBullseye, FaCode,
  FaLinkedin, FaGithub,
  FaTrophy, FaChartLine, FaHeadset, FaLightbulb, FaHeart, FaCheckCircle,
  FaQuoteLeft, FaMapMarkerAlt, FaClock, FaStar,
} from 'react-icons/fa';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import CountUp from '../../components/common/CountUp.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/about',
  label: 'Nosotros',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 2,
  locations: ['header'],
  description: 'Quiénes somos y qué nos mueve',
  icon: 'FaInfoCircle',
  isSearchable: true,
};

// ── Static data ───────────────────────────────────────────────────────────────
const VALUE_ICONS   = [FaHandshake, FaGem, FaUsers];
const WHY_ICONS     = [FaTrophy, FaHandshake, FaChartLine, FaHeadset, FaUsers, FaCode];
const CULTURE_ICONS = [FaLightbulb, FaHeart, FaCheckCircle];

const TECH_STACK = [
  'React', 'FastAPI', 'Python', 'MongoDB', 'Tailwind CSS',
  'Docker', 'AWS', 'Figma', 'OpenAI API', 'TypeScript', 'PostgreSQL', 'Stripe',
];

const CLIENT_NAMES = ['TechCorp', 'Mariposa Shop', 'Nimbus', 'Grupo Delta', 'StartupX', 'MegaBrand'];

const CERTS = ['Google Partner', 'Meta Business', 'AWS Cloud', 'Stripe Partner'];

const TEAM_SOCIALS = [
  { linkedin: '#', github: '#' },
  { linkedin: '#', github: '#' },
  { linkedin: '#', github: '#' },
];

// ── Avatar ────────────────────────────────────────────────────────────────────
function TeamAvatar({ name }) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-light-accent/20 bg-gradient-to-br from-light-accent/20 to-light-accent/5 text-xl font-black text-light-accent dark:border-dark-accent/20 dark:from-dark-accent/20 dark:to-dark-accent/5 dark:text-dark-accent">
      {initials}
    </div>
  );
}

export default function About() {
  const { t } = useTranslation('about');
  usePageMeta('about', pageMetadata.path);

  const stats         = useMemo(() => t('hero.stats',      { returnObjects: true }) || [], [t]);
  const paragraphs    = useMemo(() => t('story.paragraphs',{ returnObjects: true }) || [], [t]);
  const highlight     = useMemo(() => t('story.highlight', { returnObjects: true }) || {}, [t]);
  const timelineItems = useMemo(() => t('timeline.items',  { returnObjects: true }) || [], [t]);
  const whyItems      = useMemo(() => t('why.items',       { returnObjects: true }) || [], [t]);
  const teamMembers   = useMemo(() => t('team.members',    { returnObjects: true }) || [], [t]);
  const values        = useMemo(() => t('values.items',    { returnObjects: true }) || [], [t]);
  const cultureItems  = useMemo(() => t('culture.items',   { returnObjects: true }) || [], [t]);
  const testimonial   = useMemo(() => ({
    quote:   t('testimonial.quote'),
    name:    t('testimonial.name'),
    company: t('testimonial.company'),
  }), [t]);

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-24 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-4xl px-4">
          <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('hero.badge')}
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">{t('hero.title')}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {t('hero.subtitle')}
          </p>
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 80}>
                <div className="rounded-lg border border-light-border bg-light-surface p-4 transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                  <CountUp value={stat.value} className="block text-2xl font-extrabold text-light-accent dark:text-dark-accent sm:text-3xl" />
                  <p className="mt-1 text-xs text-light-text-secondary dark:text-dark-text-secondary sm:text-sm">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      {/* ── Story ── */}
      <section className="bg-light-surface py-20 dark:bg-dark-surface">
        <div className="mx-auto grid max-w-5xl items-center gap-12 px-4 lg:grid-cols-[1fr_1.2fr]">
          <ScrollReveal>
            <div className="relative">
              <div className="relative w-full overflow-hidden rounded-2xl border border-light-border bg-gradient-to-br from-light-accent/10 via-light-surface to-light-accent/5 shadow-lg dark:border-dark-border dark:from-dark-accent/10 dark:via-dark-surface dark:to-dark-accent/5" style={{ aspectRatio: '4/3' }}>
                <div aria-hidden="true" className="absolute inset-0 opacity-[0.07]">
                  <svg viewBox="0 0 640 480" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="320" cy="240" r="200" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="320" cy="240" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="320" cy="240" r="80"  fill="none" stroke="currentColor" strokeWidth="0.8" />
                    <line x1="0"   y1="240" x2="640" y2="240" stroke="currentColor" strokeWidth="0.6" strokeDasharray="10 5" />
                    <line x1="320" y1="0"   x2="320" y2="480" stroke="currentColor" strokeWidth="0.6" strokeDasharray="10 5" />
                    <line x1="0"   y1="0"   x2="640" y2="480" stroke="currentColor" strokeWidth="0.4" strokeDasharray="6 8" />
                    <line x1="640" y1="0"   x2="0"   y2="480" stroke="currentColor" strokeWidth="0.4" strokeDasharray="6 8" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-light-accent/30 bg-light-accent/10 shadow-lg dark:border-dark-accent/30 dark:bg-dark-accent/10">
                    <FaRocket aria-hidden="true" className="text-4xl text-light-accent dark:text-dark-accent" />
                  </div>
                  <div className="flex gap-4">
                    {[FaCode, FaBullseye, FaUsers].map((Icon, i) => (
                      <div key={i} className="flex h-10 w-10 items-center justify-center rounded-lg border border-light-accent/20 bg-light-surface/80 dark:border-dark-accent/20 dark:bg-dark-surface/80">
                        <Icon aria-hidden="true" className="text-lg text-light-accent/70 dark:text-dark-accent/70" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 hidden rounded-xl border border-light-border bg-light-background p-4 shadow-lg sm:block dark:border-dark-border dark:bg-dark-background">
                <p className="text-3xl font-black text-light-accent dark:text-dark-accent">{highlight.value}</p>
                <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{highlight.label}</p>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
              {t('story.badge')}
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight">{t('story.title')}</h2>
            <div className="mt-5 space-y-4 text-light-text-secondary dark:text-dark-text-secondary">
              {paragraphs.map((p, i) => <p key={i} className="leading-relaxed">{p}</p>)}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 2 — Timeline */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('timeline.title')}</h2>
          </ScrollReveal>
          <div className="relative mt-12">
            <div aria-hidden="true" className="absolute top-5 left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] hidden h-px bg-gradient-to-r from-light-accent/20 via-light-border to-light-accent/20 dark:from-dark-accent/20 dark:via-dark-border dark:to-dark-accent/20 sm:block" />
            <div className="grid gap-10 sm:grid-cols-4">
              {timelineItems.map((item, i) => (
                <ScrollReveal key={item.year} delay={i * 80}>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-light-accent bg-light-background text-xs font-black text-light-accent dark:border-dark-accent dark:bg-dark-background dark:text-dark-accent">
                      {item.year.slice(2)}
                    </div>
                    <p className="mt-1 text-xs font-bold text-light-accent dark:text-dark-accent">{item.year}</p>
                    <h3 className="mt-2 font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{item.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission + Vision ── */}
      <section className="bg-light-surface py-16 dark:bg-dark-surface">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2">
            <ScrollReveal>
              <div className="group h-full rounded-xl border border-light-border bg-light-background p-8 transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-accent/10 dark:bg-dark-accent/10">
                  <FaRocket aria-hidden="true" className="text-2xl text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{t('mission.title')}</h3>
                <p className="mt-2 leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{t('mission.text')}</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="group h-full rounded-xl border border-light-border bg-light-background p-8 transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-light-accent/10 dark:bg-dark-accent/10">
                  <FaBullseye aria-hidden="true" className="text-2xl text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent" />
                </div>
                <h3 className="mt-4 text-xl font-bold">{t('vision.title')}</h3>
                <p className="mt-2 leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{t('vision.text')}</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5 — Why us */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('why.title')}</h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyItems.map((item, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <ScrollReveal key={item.title} delay={i * 60}>
                  <div className="group flex items-start gap-4 rounded-xl border border-light-border bg-light-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-light-accent hover:shadow-md dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-light-accent/10 dark:bg-dark-accent/10">
                      <Icon aria-hidden="true" className="text-lg text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{item.text}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 1 — Team */}
      <section className="bg-light-surface py-20 dark:bg-dark-surface">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('team.title')}</h2>
            <p className="mt-3 text-center text-light-text-secondary dark:text-dark-text-secondary">{t('team.subtitle')}</p>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {teamMembers.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 80}>
                <div className="group flex flex-col items-center rounded-xl border border-light-border bg-light-background p-6 text-center transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                  <TeamAvatar name={member.name} />
                  <h3 className="mt-4 font-bold">{member.name}</h3>
                  <p className="text-sm font-medium text-light-accent dark:text-dark-accent">{member.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{member.bio}</p>
                  <div className="mt-4 flex gap-2">
                    {TEAM_SOCIALS[i] && (
                      <>
                        <a href={TEAM_SOCIALS[i].linkedin} aria-label="LinkedIn"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-light-border text-light-text-secondary transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent">
                          <FaLinkedin aria-hidden="true" className="text-sm" />
                        </a>
                        <a href={TEAM_SOCIALS[i].github} aria-label="GitHub"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-light-border text-light-text-secondary transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent">
                          <FaGithub aria-hidden="true" className="text-sm" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3 — Tech stack */}
      <section className="border-y border-light-border py-12 dark:border-dark-border">
        <div className="mx-auto max-w-4xl px-4">
          <ScrollReveal>
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-light-text-secondary dark:text-dark-text-secondary">
              {t('stack.title')}
            </p>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((tech, i) => (
              <ScrollReveal key={tech} delay={i * 30}>
                <span className="rounded-full border border-light-border bg-light-surface px-4 py-1.5 text-sm font-medium text-light-text-primary transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:hover:border-dark-accent dark:hover:text-dark-accent">
                  {tech}
                </span>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — Testimonial */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4">
          <ScrollReveal>
            <div className="relative rounded-2xl border border-light-border bg-light-surface p-8 shadow-sm dark:border-dark-border dark:bg-dark-surface">
              <FaQuoteLeft aria-hidden="true" className="mb-4 text-3xl text-light-accent/30 dark:text-dark-accent/30" />
              <blockquote className="text-lg font-medium leading-relaxed text-light-text-primary dark:text-dark-text-primary">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-accent/10 text-sm font-black text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent">
                  {testimonial.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-light-text-primary dark:text-dark-text-primary">{testimonial.name}</p>
                  <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{testimonial.company}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} aria-hidden="true" className="text-sm text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4 — Client logos + 8 — Certifications */}
      <section className="bg-light-surface py-16 dark:bg-dark-surface">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal>
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-light-text-secondary dark:text-dark-text-secondary">
              {t('clients.title')}
            </p>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-4">
            {CLIENT_NAMES.map((name, i) => (
              <ScrollReveal key={name} delay={i * 40}>
                <div className="flex h-12 items-center justify-center rounded-lg border border-light-border bg-light-background px-5 text-sm font-bold text-light-text-secondary transition-colors hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:bg-dark-background dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent">
                  {name}
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12">
            <ScrollReveal>
              <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-light-text-secondary dark:text-dark-text-secondary">
                {t('certifications.title')}
              </p>
            </ScrollReveal>
            <div className="flex flex-wrap justify-center gap-3">
              {CERTS.map((cert, i) => (
                <ScrollReveal key={cert} delay={i * 40}>
                  <span className="flex items-center gap-1.5 rounded-full border border-light-accent/30 bg-light-accent/5 px-4 py-1.5 text-xs font-semibold text-light-accent dark:border-dark-accent/30 dark:bg-dark-accent/5 dark:text-dark-accent">
                    <FaCheckCircle aria-hidden="true" className="text-[10px]" />
                    {cert}
                  </span>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 — Culture / ADN */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('culture.title')}</h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {cultureItems.map((item, i) => {
              const Icon = CULTURE_ICONS[i % CULTURE_ICONS.length];
              return (
                <ScrollReveal key={item.title} delay={i * 80}>
                  <div className="group rounded-xl border border-light-border bg-light-surface p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-light-accent/10 dark:bg-dark-accent/10">
                      <Icon aria-hidden="true" className="text-2xl text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{item.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-light-surface py-20 dark:bg-dark-surface">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <h2 className="text-center text-3xl font-black tracking-tight">{t('values.title')}</h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {values.map((value, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
              return (
                <ScrollReveal key={value.title} delay={i * 80}>
                  <div className="group rounded-xl border border-light-border bg-light-background p-8 text-center transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-background dark:hover:border-dark-accent">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-light-accent/10 dark:bg-dark-accent/10">
                      <Icon aria-hidden="true" className="text-2xl text-light-accent transition-transform duration-200 group-hover:scale-110 dark:text-dark-accent" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold">{value.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">{value.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10 — Location card */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <ScrollReveal>
            <div className="flex flex-col items-center gap-6 rounded-xl border border-light-border bg-light-surface p-8 text-center sm:flex-row sm:text-left dark:border-dark-border dark:bg-dark-surface">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-light-accent/10 dark:bg-dark-accent/10">
                <FaMapMarkerAlt aria-hidden="true" className="text-2xl text-light-accent dark:text-dark-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{t('location.title')}</h3>
                <p className="mt-1 font-medium text-light-text-primary dark:text-dark-text-primary">{t('location.city')}</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('location.remote')}</p>
                <div className="mt-2 flex items-center justify-center gap-2 text-xs text-light-text-secondary sm:justify-start dark:text-dark-text-secondary">
                  <FaClock aria-hidden="true" />
                  <span>{t('location.hours')}</span>
                </div>
              </div>
              <Link to="/contact"
                className="shrink-0 rounded-lg border border-light-accent px-5 py-2 text-sm font-semibold text-light-accent transition-colors hover:bg-light-accent/10 dark:border-dark-accent dark:text-dark-accent dark:hover:bg-dark-accent/10">
                {t('location.contactLink')}
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6 — CTA mejorado */}
      <section className="bg-gradient-to-br from-light-accent to-light-accent/80 py-20 text-center dark:from-dark-accent dark:to-dark-accent/80">
        <ScrollReveal>
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-black text-white sm:text-4xl">{t('cta.title')}</h2>
            <p className="mt-3 text-white/80">{t('cta.subtitle')}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/portfolio"
                className="rounded-lg bg-white px-6 py-3 font-semibold text-light-accent shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl dark:text-dark-accent">
                {t('cta.servicesButton')}
              </Link>
              <Link to="/contact"
                className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10">
                {t('cta.contactButton')}
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
