import { act, renderHook } from '@testing-library/react';
import { beforeAll, describe, expect, it } from 'vitest';
import i18n from '../i18n.js';
import useGlobalSearch from './useGlobalSearch.jsx';

describe('useGlobalSearch', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('es');
  });

  it('no devuelve resultados con la consulta vacía', () => {
    const { result } = renderHook(() => useGlobalSearch(0));

    expect(result.current.results).toHaveLength(0);
  });

  it('encuentra páginas por su nombre', () => {
    const { result } = renderHook(() => useGlobalSearch(0));

    act(() => result.current.setQuery('servicios'));

    expect(result.current.results.some((entry) => entry.type === 'page' && entry.path === '/portfolio')).toBe(true);
  });

  it('encuentra servicios del portafolio por nombre y enlaza al formulario de pedido', () => {
    const { result } = renderHook(() => useGlobalSearch(0));

    act(() => result.current.setQuery('Marketing digital'));

    const match = result.current.results.find((entry) => entry.type === 'service');
    expect(match).toBeDefined();
    expect(match.path).toBe('/order?product=Marketing%20digital');
  });

  it('la búsqueda no distingue mayúsculas/minúsculas ni espacios', () => {
    const { result } = renderHook(() => useGlobalSearch(0));

    act(() => result.current.setQuery('  CONTACTO  '));

    expect(result.current.results.some((entry) => entry.path === '/contact')).toBe(true);
  });
});
