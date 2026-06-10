import categoryOrder from './categoryOrder.json';
import navigationLinks from './navigationLinks.json';

const modules = import.meta.glob(['./**/*.jsx', '!./**/*.test.jsx'], { eager: true });

function buildPages() {
  const pages = [];

  for (const [filePath, mod] of Object.entries(modules)) {
    const metadata = mod.pageMetadata;
    const Component = mod.default;
    if (!metadata || !Component) continue;

    pages.push({
      ...metadata,
      Component,
      filePath,
    });
  }

  return pages.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export const pages = buildPages();

export function getNavPages(roleLevel = 0) {
  const orderByPath = new Map(navigationLinks.map((link) => [link.path, link.order]));

  return pages
    .filter((page) => {
      const min = page.minRoleLevel ?? 0;
      const max = page.maxRoleLevel ?? Infinity;
      return roleLevel >= min && roleLevel <= max;
    })
    .filter((page) => page.locations?.includes('header') ?? true)
    .sort((a, b) => (orderByPath.get(a.path) ?? a.order ?? 0) - (orderByPath.get(b.path) ?? b.order ?? 0));
}

export function getRoutablePages(roleLevel = 0) {
  return pages.filter((page) => {
    const min = page.minRoleLevel ?? 0;
    const max = page.maxRoleLevel ?? Infinity;
    return roleLevel >= min && roleLevel <= max;
  });
}

export { categoryOrder, navigationLinks };
