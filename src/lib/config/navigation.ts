/**
 * Navigation and Cross-Application Routing Configuration
 * Supports configurable links to external Next.js Landing Page (PUB-001) per Decision 1.
 */

export const externalNavConfig = {
  landingPageUrl: import.meta.env.VITE_LANDING_PAGE_URL || "http://localhost:3000",
  termsUrl: "/terms",
  privacyUrl: "/privacy",
  supportUrl: "/support",
};

export const ROUTES = {
  HOME: "/",
  GUEST_EXPLORER: "/explore",
  PROJECTS: "/projects",
  PROJECT_DETAIL: (id: string) => `/projects/${id}/details`,
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  BUSINESS: "/business",
  PROFILE: "/profile",
  FORBIDDEN: "/forbidden",
} as const;
