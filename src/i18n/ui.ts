/* export const languages: Record<string,{ code: string; name: string; }> = {
    es: {
      code: 'es',
      name: 'Español',
    },
    en: {
      code: 'en',
      name: 'English'},
  }; */

export const languages = {
    es: "Español",
    en: "Ingles"
}

export const defaultLang = 'es';
export const showDefaultLang = true;

export const ui = {
  es: {
    'nav.idioma': 'Seleccioná tu país:',
    'nav.inicio': 'Inicio',
    'nav.nosotros': 'Nosotros',
    'nav.que-hacemos': 'Qué Hacemos',
    'nav.sumate': 'Sumate',
    'nav.blog': 'Notas',
    'nav.contacto': 'Contacto',

  },
  en: {
    'nav.idioma': 'Select your country:',
    'nav.inicio': 'Home',
    'nav.nosotros': 'About Us',
    'nav.que-hacemos': 'What We Do',
    'nav.sumate': 'Join Us',
    'nav.blog': 'Blog',
    'nav.contacto': 'Contact',

  },
} as const;

export const routes = {
  es: {
    'inicio': 'inicio',
    'nosotros': 'nosotros',
    'que-hacemos': 'que-hacemos',
    'sumate': 'sumate',
    'blog': 'blog',
    'contacto': 'contacto',
  },
  en: {
    'inicio': 'home',
    'nosotros': 'about-us',
    'que-hacemos': 'what-we-do',
    'sumate': 'join-us',
    'blog': 'blog',
    'contacto': 'contact',

  },
};