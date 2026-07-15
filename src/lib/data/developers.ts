export interface Developer {
  name: string;
  role: string;
  roleKey: string;
  github: string;
  flag?: string;
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
    name: "ukstoDS",
    role: "Colaborador",
    roleKey: "developers.role7",
    github: "ukstoDS",
  },
];
