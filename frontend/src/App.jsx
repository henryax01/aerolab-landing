import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from './hooks/useAuth.jsx';
import useTheme from './hooks/useTheme.jsx';
import { getNavPages, getRoutablePages } from './pages/pagesConfig.js';
import Header from './components/common/Header.jsx';
import Footer from './components/common/Footer.jsx';
import ChatWidget from './components/common/ChatWidget.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import CookieBanner from './components/common/CookieBanner.jsx';

export default function App() {
  const { t } = useTranslation('common');
  const { roleLevel, token } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navPages = getNavPages(roleLevel);
  const routablePages = getRoutablePages(roleLevel);
  const brand = t('brand');

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-light-background text-light-text-primary dark:bg-dark-background dark:text-dark-text-primary">
        <Header navPages={navPages} theme={theme} onToggleTheme={toggleTheme} brand={brand} roleLevel={roleLevel} token={token} />

        <main className="flex-1">
          <Routes>
            {routablePages.map((page) => (
              <Route key={page.path} path={page.path} element={<page.Component />} />
            ))}
          </Routes>
        </main>

        <Footer brand={brand} />
        <ChatWidget />
        <ScrollToTop />
        <CookieBanner />
      </div>
    </BrowserRouter>
  );
}
