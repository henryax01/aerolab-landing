import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esCommon from './locales/es/common.json';
import esHome from './locales/es/home.json';
import esAbout from './locales/es/about.json';
import esPortfolio from './locales/es/portfolio.json';
import esOrder from './locales/es/order.json';
import esContact from './locales/es/contact.json';
import esAccount from './locales/es/account.json';
import esExperience from './locales/es/experience.json';
import esTerms from './locales/es/terms.json';
import esPrivacy from './locales/es/privacy.json';
import esNotfound from './locales/es/notfound.json';
import esFaq from './locales/es/faq.json';
import esPricing from './locales/es/pricing.json';
import esBlog from './locales/es/blog.json';
import esCases from './locales/es/cases.json';
import esBudget from './locales/es/budget.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enAbout from './locales/en/about.json';
import enPortfolio from './locales/en/portfolio.json';
import enOrder from './locales/en/order.json';
import enContact from './locales/en/contact.json';
import enAccount from './locales/en/account.json';
import enExperience from './locales/en/experience.json';
import enTerms from './locales/en/terms.json';
import enPrivacy from './locales/en/privacy.json';
import enNotfound from './locales/en/notfound.json';
import enFaq from './locales/en/faq.json';
import enPricing from './locales/en/pricing.json';
import enBlog from './locales/en/blog.json';
import enCases from './locales/en/cases.json';
import enBudget from './locales/en/budget.json';

const STORAGE_KEY = 'lp_lang';

i18n.use(initReactI18next).init({
  lng: localStorage.getItem(STORAGE_KEY) || 'es',
  fallbackLng: 'es',
  ns: ['common', 'home', 'about', 'portfolio', 'order', 'contact', 'account', 'experience', 'terms', 'privacy', 'notfound', 'faq', 'pricing', 'blog', 'cases', 'budget'],
  defaultNS: 'common',
  resources: {
    es: {
      common: esCommon,
      home: esHome,
      about: esAbout,
      portfolio: esPortfolio,
      order: esOrder,
      contact: esContact,
      account: esAccount,
      experience: esExperience,
      terms: esTerms,
      privacy: esPrivacy,
      notfound: esNotfound,
      faq: esFaq,
      pricing: esPricing,
      blog: esBlog,
      cases: esCases,
      budget: esBudget,
    },
    en: {
      common: enCommon,
      home: enHome,
      about: enAbout,
      portfolio: enPortfolio,
      order: enOrder,
      contact: enContact,
      account: enAccount,
      experience: enExperience,
      terms: enTerms,
      privacy: enPrivacy,
      notfound: enNotfound,
      faq: enFaq,
      pricing: enPricing,
      blog: enBlog,
      cases: enCases,
      budget: enBudget,
    },
  },
  interpolation: { escapeValue: false },
});

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(STORAGE_KEY, lng);
});

export default i18n;
