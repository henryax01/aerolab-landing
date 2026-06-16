import { useEffect, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Volver arriba"
      className="fixed bottom-24 right-5 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-light-border bg-light-surface text-light-text-secondary shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:border-light-accent hover:text-light-accent dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:border-dark-accent dark:hover:text-dark-accent"
    >
      <FaArrowUp className="text-sm" aria-hidden="true" />
    </button>
  );
}
