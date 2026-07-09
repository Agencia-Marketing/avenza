import { languages } from './ui';

/** getStaticPaths payload that renders every page once per locale (/es, /en). */
export function langStaticPaths() {
  return languages.map((lang) => ({ params: { lang } }));
}
