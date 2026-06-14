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
