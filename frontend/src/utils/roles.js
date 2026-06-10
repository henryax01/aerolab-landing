export const ROLE_LEVELS = {
  customer: 1,
  admin: 6,
};

export function getRoleLevel(role) {
  return ROLE_LEVELS[role] ?? ROLE_LEVELS.customer;
}
