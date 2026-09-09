export interface Developer {
  name: string;
  role: string;
  roleKey: string;
  github: string;
  flag?: string;
  suspended?: boolean;
}

export const developers: Developer[] = [
  {
    name: "santiagolxx",
    role: "Fundador & Desarrollador principal",
    roleKey: "developers.role1",
    github: "santiagolxx",
    flag: "Chile",
  },
  {
    name: "staFF6773",
    role: "Cofundador & Desarrollador principal",
    roleKey: "developers.role2",
    github: "staFF6773",
    flag: "Nicaragua",
  },
  {
    name: "Escarabajoz",
    role: "Administrador",
    roleKey: "developers.role9",
    github: "Escarabajoz",
    flag: "RD",
  },
];

export const contributors: Developer[] = [
  {
    name: "4xnl",
    role: "Colaborador",
    roleKey: "developers.role3",
    github: "4xnl",
  },
  {
    name: "1vcbGH",
    role: "Colaborador",
    roleKey: "developers.role4",
    github: "1vcbGH",
  },
  {
    name: "mpg-perto",
    role: "Colaborador",
    roleKey: "developers.role5",
    github: "mpg-perto",
  },
  {
    name: "Edgajuman",
    role: "Colaborador",
    roleKey: "developers.role6",
    github: "Edgajuman",
  },
  {
    name: "kittyhos",
    role: "Colaborador",
    roleKey: "developers.role7",
    github: "kittyhos",
    suspended: true,
  },
  {
    name: "nullked",
    role: "Traductor",
    roleKey: "developers.role8",
    github: "nullked",
  },
  {
    name: "Opepodevs",
    role: "Colaborador",
    roleKey: "developers.role9",
    github: "Opepodevs",
  },
  {
    name: "LainLife",
    role: "Colaborador",
    roleKey: "developers.role10",
    github: "LainLife",
  },
  {
    name: "holman2chila-droid",
    role: "Colaborador",
    roleKey: "developers.role11",
    github: "holman2chila-droid",
  },
  {
    name: "StyleSfx",
    role: "Colaborador",
    roleKey: "developers.role12",
    github: "StyleSfx",
  },
  {
    name: "JuanPG21",
    role: "Colaborador",
    roleKey: "developers.role13",
    github: "JuanPG21",
  },
];
