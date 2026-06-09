/**
 * Separate admin SPA (`admin-panel` repo), not routes on this site.
 * Set `VITE_ADMIN_PANEL_URL` (no trailing slash), e.g. https://admin.maximally.org
 */

export function getAdminPanelBaseUrl(): string {
  const raw = import.meta.env.VITE_ADMIN_PANEL_URL as string | undefined;
  if (!raw || typeof raw !== 'string') return '';
  return raw.replace(/\/$/, '').trim();
}

/** Mentor management in admin-panel lives at `/mentors`. */
export function getAdminPanelMentorsUrl(): string {
  const base = getAdminPanelBaseUrl();
  return base ? `${base}/mentors` : '';
}
