import { useTranslation } from 'react-i18next';
import { FaClock } from 'react-icons/fa';
import ScrollReveal from '../../components/common/ScrollReveal.jsx';
import usePageMeta from '../../hooks/usePageMeta.jsx';

export const pageMetadata = {
  path: '/blog',
  label: 'Blog',
  category: 'general',
  minRoleLevel: 0,
  maxRoleLevel: Infinity,
  order: 54,
  locations: [],
  description: 'Blog de Aerolab',
  icon: 'FaNewspaper',
  isSearchable: true,
};

const CATEGORY_COLORS = {
  'Diseño': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Design': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  'Inteligencia artificial': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Artificial intelligence': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Marketing': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  'Desarrollo web': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'Web development': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export default function Blog() {
  const { t } = useTranslation('blog');
  usePageMeta('blog', pageMetadata.path);

  const posts = t('posts', { returnObjects: true }) || [];

  return (
    <div className="bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
      <section className="relative overflow-hidden bg-gradient-to-b from-light-surface to-light-background py-24 text-center dark:from-dark-surface dark:to-dark-background">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-light-accent/40 to-transparent dark:via-dark-accent/40" />
        <div className="mx-auto max-w-3xl px-4">
          <span className="inline-block rounded-full border border-light-accent/20 bg-light-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-light-accent dark:border-dark-accent/20 dark:bg-dark-accent/10 dark:text-dark-accent">
            {t('hero.badge')}
          </span>
          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">{t('hero.title')}</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-light-text-secondary dark:text-dark-text-secondary">
            {t('hero.subtitle')}
          </p>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-light-border to-transparent dark:via-dark-border" />
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <ScrollReveal key={post.slug} delay={index * 60}>
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-light-border bg-light-surface transition-all duration-200 hover:-translate-y-1 hover:border-light-accent hover:shadow-lg dark:border-dark-border dark:bg-dark-surface dark:hover:border-dark-accent">
                  <div className="h-40 w-full bg-gradient-to-br from-light-accent/10 via-light-background to-light-accent/5 dark:from-dark-accent/10 dark:via-dark-background dark:to-dark-accent/5" />
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[post.category] || 'bg-light-accent/10 text-light-accent dark:bg-dark-accent/10 dark:text-dark-accent'}`}>
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-light-text-secondary dark:text-dark-text-secondary">
                        <FaClock aria-hidden="true" className="text-[10px]" />
                        {post.readTime} {t('minRead')}
                      </span>
                    </div>
                    <h2 className="mt-3 text-lg font-bold leading-snug text-light-text-primary transition-colors group-hover:text-light-accent dark:text-dark-text-primary dark:group-hover:text-dark-accent">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-light-text-secondary dark:text-dark-text-secondary">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-light-text-secondary dark:text-dark-text-secondary">{post.date}</span>
                      <span className="text-xs font-semibold text-light-accent dark:text-dark-accent">
                        {t('readMore')} →
                      </span>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
