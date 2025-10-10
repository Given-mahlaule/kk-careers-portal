/**
 * Navigation utility to handle environment-aware routing
 * between KK Labour Services main site and careers portal
 */

// Detect current environment
export const getEnvironment = () => {
  const hostname = window.location.hostname;
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isGitHubPages = hostname.includes('github.io');
  
  return {
    isLocalhost,
    isGitHubPages,
    isProd: isGitHubPages
  };
};

// Get the appropriate URLs based on environment
export const getUrls = () => {
  const env = getEnvironment();
  
  if (env.isLocalhost) {
    return {
      mainSite: 'http://localhost:5173', // KK Labour Services main site on localhost
      careersPortal: 'http://localhost:5174', // Careers portal on localhost (different port)
      mainSiteBase: 'http://localhost:5173',
      careersPortalBase: 'http://localhost:5174'
    };
  } else {
    return {
      mainSite: 'https://given-mahlaule.github.io/kk-labour-services',
      careersPortal: 'https://given-mahlaule.github.io/kk-careers-portal',
      mainSiteBase: 'https://given-mahlaule.github.io/kk-labour-services',
      careersPortalBase: 'https://given-mahlaule.github.io/kk-careers-portal'
    };
  }
};

// Navigate to main site
export const navigateToMainSite = (path = '') => {
  const urls = getUrls();
  const targetUrl = `${urls.mainSite}${path}`;
  window.location.href = targetUrl;
};

// Navigate to careers portal
export const navigateToCareersPortal = (path = '') => {
  const urls = getUrls();
  const targetUrl = `${urls.careersPortal}${path}`;
  window.location.href = targetUrl;
};

// Navigate to specific section of main site
export const navigateToMainSiteSection = (section) => {
  const urls = getUrls();
  const targetUrl = `${urls.mainSite}/#${section}`;
  window.location.href = targetUrl;
};

// Check if we're currently on the main site
export const isOnMainSite = () => {
  const env = getEnvironment();
  const currentUrl = window.location.href;
  
  if (env.isLocalhost) {
    return currentUrl.includes(':5173'); // Main site port
  } else {
    return currentUrl.includes('kk-labour-services');
  }
};

// Check if we're currently on the careers portal
export const isOnCareersPortal = () => {
  const env = getEnvironment();
  const currentUrl = window.location.href;
  
  if (env.isLocalhost) {
    return currentUrl.includes(':5174'); // Careers portal port
  } else {
    return currentUrl.includes('kk-careers-portal');
  }
};

// Get back button URL (where to go when clicking back)
export const getBackUrl = () => {
  const urls = getUrls();
  
  // If we're on careers portal, back should go to main site
  if (isOnCareersPortal()) {
    return urls.mainSite;
  }
  
  // If we're on main site, back should go to home or previous page
  return urls.mainSite;
};

// Handle careers link click from main site
export const handleCareersClick = (e) => {
  e.preventDefault();
  navigateToCareersPortal();
};

// Handle back button click from careers portal
export const handleBackToMainSite = (e) => {
  e.preventDefault();
  navigateToMainSite();
};