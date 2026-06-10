export interface DocItem {
  name: string;
  slug: string;
}

export interface DocSection {
  title: string;
  items: DocItem[];
}

export const docsStructure: DocSection[] = [
  {
    title: "Comenzando",
    items: [
      { name: "Introducción", slug: "" },
      { name: "Instalación", slug: "install" },
    ],
  },
  {
    title: "Uso",
    items: [
      { name: "Ya, pero como se usa?", slug: "howto" },
      { name: "Que es Java?", slug: "java" },
      { name: "Gestión de Instancias", slug: "instances" },
      { name: "Cuentas", slug: "accounts" },
      { name: "Mods y Recursos", slug: "mods" },
      { name: "Cómo poner un theme", slug: "instalar-tema" },
    ],
  },
  {
    title: "Avanzado",
    items: [
      { name: "Configuración", slug: "config" },
      { name: "Logs y Debugging", slug: "debug" },
    ],
  },
  {
    title: "Guias",
    items: [
      { name: "Soporte Oficial", slug: "soporte" },
      { name: "Arch PKGBUILD", slug: "arch" },
      { name: "Cómo hacer themes", slug: "hacer-themes" },
    ],
  },
  {
    title: "Legal",
    items: [
      { name: "Privacidad", slug: "privacy" },
      { name: "Términos de Uso", slug: "terms" },
      { name: "Licencia", slug: "license" },
    ],
  },
];

export const flatDocs = docsStructure.flatMap((s) => s.items);
