/**
 * Wall-clock zone for order, kitchen and management times the POS displays.
 * It matches the site-agent `TZ=Europe/Paris` contract, so server-rendered and
 * browser-rendered times agree regardless of the POS container or browser time
 * zone. The standby clock keeps device time to match its local schedule.
 */
export const posTimeZone = 'Europe/Paris';
