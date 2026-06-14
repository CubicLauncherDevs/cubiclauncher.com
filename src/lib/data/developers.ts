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
