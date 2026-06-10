import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeAll, describe, expect, it } from 'vitest';
import i18n from '../../i18n.js';
import SearchBar from './SearchBar.jsx';

function LocationDisplay() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname}{location.search}</span>;
}

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <SearchBar roleLevel={0} />
      <LocationDisplay />
    </MemoryRouter>,
  );
}

describe('SearchBar', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('es');
  });

  it('muestra resultados al escribir y navega al seleccionar una página', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await user.type(screen.getByLabelText('Buscar en el sitio'), 'servicios');

    const result = await screen.findByText('Servicios');
    await user.click(result);

    expect(screen.getByTestId('location').textContent).toBe('/portfolio');
  });

  it('muestra un mensaje cuando no hay coincidencias', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    await user.type(screen.getByLabelText('Buscar en el sitio'), 'xyznoexiste');

    expect(await screen.findByText(/No se encontraron resultados/i)).toBeInTheDocument();
  });

  it('limpia la búsqueda al presionar el botón de limpiar', async () => {
    const user = userEvent.setup();
    renderWithRouter();

    const input = screen.getByLabelText('Buscar en el sitio');
    await user.type(input, 'contacto');
    await screen.findByLabelText('Limpiar búsqueda');

    await user.click(screen.getByLabelText('Limpiar búsqueda'));

    expect(input).toHaveValue('');
  });
});
