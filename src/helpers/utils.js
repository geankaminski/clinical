export const isMobile = (typeof window.orientation !== 'undefined') ||
  (navigator.userAgent.indexOf('IEMobile') !== -1) ||
  window.innerWidth <= 768;