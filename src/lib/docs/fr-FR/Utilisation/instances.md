---
title: Instances | CubicLauncher
---

# Instances

Une **instance** est un répertoire autonome avec sa propre copie de Minecraft, mods, resource packs, captures d'écran et configuration. Chaque instance représente une combinaison spécifique de version Minecraft et de mod loader.

## Structure sur le disque

Les instances se trouvent dans `.cubic/instances/`. Chaque instance est un dossier avec le nom que vous lui avez donné :

```
.cubic/
└── instances/
    └── Mon Instance/
        ├── instance.cub        ← métadonnées de l'instance
        ├── mods/               ← mods (.jar / .jar.disabled)
        ├── resourcepacks/      ← resource packs (.zip)
        ├── screenshots/        ← captures d'écran (.png)
        └── ...                 ← fichiers d'exécution Minecraft
```

Le fichier `instance.cub` stocke les métadonnées en JSON :

```jsonc
{
  "name": "Mon Instance",
  "version": "1.21-fabric",
  "last_played": 1717000000,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "icon": "/images/instances/fabric.png",
  "cover_image": null,
  "min_memory": null,
  "max_memory": null
}
```

## Créer une instance

1. Cliquez sur **"Créer une Instance"** dans la barre latérale.
2. Choisissez un **nom** (maximum 16 caractères ASCII).
3. Sélectionnez une **version** parmi celles téléchargées (si celle que vous voulez n'apparaît pas, téléchargez-la d'abord depuis le bouton de téléchargement).
4. Choisissez une **icône** (Vanilla, Fabric, Forge ou Modrinth).
5. Appuyez sur **Créer**.

> La version détermine le mod loader automatiquement : si l'ID contient `fabric` il est détecté comme Fabric, s'il contient `forge` comme Forge, s'il contient `quilt` comme Quilt, sinon c'est Vanilla.

## La vue d'instance

En sélectionnant une instance, son panneau principal s'ouvre avec :

- **Hero** — bannière avec le nom, l'icône, la version, le loader et le statut actuel
- **Bouton "Jouer"** — lance Minecraft avec cette instance
- **Barre de statut** — affiche le statut en temps réel (Off / Starting / Started / Error)

### Onglet Détails

Affiche les informations générales de l'instance :

- Badges de version et loader (Vanilla, Fabric, Forge, Quilt)
- Chemin sur le disque avec bouton pour ouvrir le dossier
- Accès rapide aux dossiers mods, screenshots et resource packs
- Console en direct avec la sortie de Minecraft (avec autoscroll)
- Bouton **"Forcer la fermeture"** si l'instance est en cours d'exécution

### Onglet Mods

Liste les mods installés avec leur nom, version et un interrupteur pour les activer/désactiver (renomme `.jar` ↔ `.jar.disabled`).

Visible uniquement si l'instance utilise un mod loader (Fabric, Forge ou Quilt).

### Onglet Obtenir des Mods

Recherche intégrée Modrinth. Vous pouvez :

- Rechercher des mods par nom
- Filtrer par catégories et loader
- Ajouter des mods à un panier
- Choisir la version du mod compatible avec votre version de Minecraft
- Télécharger avec résolution des dépendances

Visible uniquement si l'instance utilise un mod loader.

### Onglet Ressources

Gérez les resource packs (`.zip`) de l'instance :

- Uploader de nouveaux packs depuis le système de fichiers
- Supprimer des packs existants

### Onglet Captures

Galerie de captures d'écran prises dans l'instance :

- Aperçu en miniature
- Visualiseur avec lightbox au clic
- Supprimer des captures

## Cycle de vie

```
Off ──► Starting ──► Started ──► Off
 │         │            │
 │         │            │
 └────► Error ◄─────────┘
```

- **Off** — l'instance ne s'exécute pas
- **Starting** — le launcher prépare et lance Minecraft
- **Started** — Minecraft est en cours d'exécution
- **Error** — une erreur est survenue au démarrage (version manquante, Java incorrect, etc.)

## Gérer les instances

Depuis la barre latérale, vous pouvez :

- **Renommer** — changez le nom (renomme aussi le dossier sur le disque)
- **Supprimer** — supprime l'instance et tout son contenu (mods, captures, etc.)
- **Ouvrir le dossier** — accédez directement au répertoire de l'instance

Vous pouvez aussi ouvrir des dossiers spécifiques depuis l'onglet Détails : mods, resource packs, screenshots.

## Télécharger des versions

Utilisez le bouton de téléchargement dans la barre latérale pour ouvrir le **Version Downloader**. Vous pouvez y télécharger :

- **Versions Vanilla** — release et snapshot
- **Versions Alpha/Bêta** — anciennes versions
- **Fabric** — versions avec Fabric Loader

Les versions téléchargées sont stockées dans `.cubic/shared/versions/` et sont partagées entre toutes les instances.

## Mémoire RAM

Vous pouvez configurer la mémoire personnalisée par instance en modifiant `instance.cub`. Si `min_memory` ou `max_memory` ne sont pas définis, les valeurs globales de la configuration sont utilisées.
