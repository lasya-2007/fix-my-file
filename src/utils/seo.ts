/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SeoOptions {
  title: string;
  description: string;
  path: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Updates document title, meta descriptions, canonical URLs, OpenGraph,
 * Twitter cards, and Schema.org JSON-LD structured data dynamically.
 */
export function updatePageSeo(options: SeoOptions): void {
  const { title, description, path, structuredData } = options;

  // 1. Page Title
  document.title = title;

  // 2. Helper to set or create meta tag by name
  const setMetaByName = (name: string, content: string) => {
    let el = document.querySelector(`meta[name="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Helper to set or create meta tag by property
  const setMetaByProperty = (property: string, content: string) => {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute('property', property);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // 3. Meta description
  setMetaByName('description', description);

  // 4. Canonical URL resolution
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const canonicalUrl = `${origin}${cleanPath === '/' ? '' : cleanPath}`;

  let linkCanonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!linkCanonical) {
    linkCanonical = document.createElement('link');
    linkCanonical.setAttribute('rel', 'canonical');
    document.head.appendChild(linkCanonical);
  }
  linkCanonical.setAttribute('href', canonicalUrl || `${origin}/`);

  // 5. OpenGraph Tags
  setMetaByProperty('og:title', title);
  setMetaByProperty('og:description', description);
  setMetaByProperty('og:url', canonicalUrl || `${origin}/`);
  setMetaByProperty('og:site_name', 'Fix My File');
  setMetaByProperty('og:type', 'website');

  // 6. Twitter Card Tags
  setMetaByName('twitter:card', 'summary_large_image');
  setMetaByName('twitter:title', title);
  setMetaByName('twitter:description', description);

  // 7. Schema.org JSON-LD Structured Data
  // Remove existing dynamic structured data script if present
  const existingScript = document.getElementById('dynamic-page-schema');
  if (existingScript) {
    existingScript.remove();
  }

  if (structuredData) {
    const script = document.createElement('script');
    script.id = 'dynamic-page-schema';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }
}
