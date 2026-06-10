import { describe, expect, it } from 'vitest';
import { ROLE_LEVELS, getRoleLevel } from './roles.js';

describe('getRoleLevel', () => {
  it('devuelve el nivel configurado para roles conocidos', () => {
    expect(getRoleLevel('admin')).toBe(ROLE_LEVELS.admin);
    expect(getRoleLevel('customer')).toBe(ROLE_LEVELS.customer);
  });

  it('usa el nivel de cliente como respaldo para roles desconocidos', () => {
    expect(getRoleLevel('rol-desconocido')).toBe(ROLE_LEVELS.customer);
    expect(getRoleLevel(undefined)).toBe(ROLE_LEVELS.customer);
  });
});
