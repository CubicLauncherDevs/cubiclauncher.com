export interface DocItem {
  name: string;
  nameKey: string;
  slug: string;
}

export interface DocSection {
  title: string;
  titleKey: string;
  items: DocItem[];
}

export const docsStructure: DocSection[] = [
  {
    title: "Comenzando",
    titleKey: "docsStructure.gettingStarted",
    items: [
      { name: "Introducción", nameKey: "docsStructure.introduction", slug: "" },
      { name: "Instalación", nameKey: "docsStructure.installation", slug: "install" },
    ],
  },
  {
    title: "Uso",
    titleKey: "docsStructure.usage",
    items: [
      { name: "Ya, pero como se usa?", nameKey: "docsStructure.howto", slug: "howto" },
      { name: "Que es Java?", nameKey: "docsStructure.whatIsJava", slug: "java" },
      { name: "Gestión de Instancias", nameKey: "docsStructure.instanceManagement", slug: "instances" },
      { name: "Cuentas", nameKey: "docsStructure.accounts", slug: "accounts" },
      { name: "Mods y Recursos", nameKey: "docsStructure.modsAndResources", slug: "mods" },
      { name: "Cómo poner un theme", nameKey: "docsStructure.howToInstallTheme", slug: "instalar-tema" },
    ],
  },
  {
    title: "Avanzado",
    titleKey: "docsStructure.advanced",
    items: [
      { name: "Configuración", nameKey: "docsStructure.configuration", slug: "config" },
      { name: "Logs y Debugging", nameKey: "docsStructure.logsAndDebugging", slug: "debug" },
    ],
  },
  {
    title: "Guias",
    titleKey: "docsStructure.guides",
    items: [
      { name: "Soporte Oficial", nameKey: "docsStructure.officialSupport", slug: "soporte" },
      { name: "Arch PKGBUILD", nameKey: "docsStructure.archPKGBUILD", slug: "arch" },
      { name: "Cómo hacer themes", nameKey: "docsStructure.howToMakeThemes", slug: "hacer-themes" },
    ],
  },
  {
    title: "Legal",
    titleKey: "docsStructure.legal",
    items: [
      { name: "Privacidad", nameKey: "docsStructure.privacy", slug: "privacy" },
      { name: "Términos de Uso", nameKey: "docsStructure.termsOfUse", slug: "terms" },
      { name: "Licencia", nameKey: "docsStructure.license", slug: "license" },
    ],
  },
];

export const flatDocs = docsStructure.flatMap((s) => s.items);

export const localeDocDirs: Record<string, string> = {
  en: 'en-EN',
  es: 'es-ES',
  fr: 'fr-FR',
};

const slugToFileEn: Record<string, string> = {
  '': 'Getting-Started/introduction',
  install: 'Getting-Started/install',
  howto: 'Usage/howto',
  java: 'Usage/java',
  instances: 'Usage/instances',
  accounts: 'Usage/accounts',
  mods: 'Usage/mods',
  'instalar-tema': 'Usage/install-theme',
  config: 'Advanced/config',
  debug: 'Advanced/debug',
  soporte: 'guides/support',
  arch: 'guides/arch',
  'hacer-themes': 'guides/making-themes',
  privacy: 'Legal/privacy',
  terms: 'Legal/terms',
  license: 'Legal/license',
};

const slugToFileEs: Record<string, string> = {
  '': 'Comenzando/introduction',
  install: 'Comenzando/install',
  howto: 'Uso/howto',
  java: 'Uso/java',
  instances: 'Uso/instances',
  accounts: 'Uso/accounts',
  mods: 'Uso/mods',
  'instalar-tema': 'Uso/instalar-tema',
  config: 'Avanzado/config',
  debug: 'Avanzado/debug',
  soporte: 'guias/soporte',
  arch: 'guias/arch',
  'hacer-themes': 'guias/hacer-themes',
  privacy: 'Legal/privacy',
  terms: 'Legal/terms',
  license: 'Legal/license',
};

const slugToFileFr: Record<string, string> = {
  '': 'Pour-commencer/introduction',
  install: 'Pour-commencer/install',
  howto: 'Utilisation/howto',
  java: 'Utilisation/java',
  instances: 'Utilisation/instances',
  accounts: 'Utilisation/accounts',
  mods: 'Utilisation/mods',
  'instalar-tema': 'Utilisation/installer-theme',
  config: 'Avance/config',
  debug: 'Avance/debug',
  soporte: 'guides/support',
  arch: 'guides/arch',
  'hacer-themes': 'guides/creer-themes',
  privacy: 'Legal/privacy',
  terms: 'Legal/terms',
  license: 'Legal/license',
};

export const localeSlugMap: Record<string, Record<string, string>> = {
  en: slugToFileEn,
  es: slugToFileEs,
  fr: slugToFileFr,
};

export function getDocPath(locale: string, slug: string): string {
  const dir = localeDocDirs[locale] || 'es-ES';
  const map = localeSlugMap[locale] || slugToFileEs;
  const file = map[slug] || slug;
  return `${dir}/${file}.md`;
}
