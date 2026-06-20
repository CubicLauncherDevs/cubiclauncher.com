---
title: Comment installer un thème | CubicLauncher
---

# Comment installer un thème

Installer un thème dans CubicLauncher est très simple. Suivez ces 3 étapes.

## Étape 1 : Télécharger le thème

Cherchez un thème dans la section [Thèmes](/themes) de la page ou dans le dépôt officiel [CubicLauncher Themes](https://github.com/CubicLauncherDevs/Themes). Téléchargez-le en fichier ZIP.

<div class="my-4 flex justify-center">
	<img src="/docs/htat/step1.png" alt="Bouton de téléchargement" class="rounded-lg border border-neutral-800 max-w-full" />
</div>

## Étape 2 : Décompresser

Extrayez le contenu du ZIP. À l'intérieur, vous trouverez un dossier avec le nom du thème contenant les fichiers du thème.

<div class="my-4 flex justify-center">
	<img src="/docs/htat/step2.png" alt="Fichier ZIP du thème" class="rounded-lg border border-neutral-800 max-w-full" />
</div>

## Étape 3 : Placer le dossier dans `.cubic/themes/`

Déplacez le dossier du thème extrait vers `.cubic/themes/`. Le dossier `.cubic` se trouve dans le répertoire utilisateur selon votre système d'exploitation :

| Système | Chemin |
|---|---|
| **Windows** | `C:\Users\<utilisateur>\.cubic\themes\` |
| **Linux** | `/home/<utilisateur>/.cubic/themes/` |
| **macOS** | `/Users/<utilisateur>/.cubic/themes/` |

La structure devrait ressembler à ceci :

```
.cubic/
└── themes/
    └── Nom:Auteur/
        ├── theme.json
        └── (optionnel) bg.jpg
```

> Si le dossier `.cubic/themes/` n'existe pas, créez-le manuellement.

Une fois placé, ouvrez CubicLauncher, allez dans le sélecteur de thèmes et choisissez celui que vous venez d'installer.

<div class="my-4 flex justify-center">
	<img src="/docs/htat/step3.png" alt="Configurer le thème dans le launcher" class="rounded-lg border border-neutral-800 max-w-full" />
</div>

Et voilà ! Votre thème est installé.
