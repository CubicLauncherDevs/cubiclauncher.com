---
title: Comment créer des thèmes | CubicLauncher
---

# Comment créer des thèmes

CubicLauncher vous permet de personnaliser entièrement l'interface avec des thèmes. Chaque thème définit les couleurs, polices, bordures et une image de fond optionnelle.

## Structure d'un thème

Les thèmes utilisateur vont dans `.cubic/themes/`. Chaque thème est un dossier avec un `theme.json` et, optionnellement, une image de fond :

```
.cubic/
└── themes/
    └── theme1/
        ├── theme.json
        └── bg.jpg
```

> Le launcher ne **charge** rien en dehors de `.cubic` pour des raisons de sécurité.

## Format du `theme.json`

Le fichier `theme.json` suit ce schéma :

```jsonc
{
  "name": "Mon Thème",
  "author": "VotreNom",
  "type": "user",
  "bg_image": "bg.jpg",
  "bg_image_blur": "10px",
  "bg_image_opacity": 0.6,
  "variables": { /* ... */ }
}
```

### Champs du `theme.json`

| Champ | Type | Description |
|---|---|---|
| `name` | `string` | **Requis.** Nom visible du thème dans le sélecteur. |
| `author` | `string?` | Auteur du thème. |
| `type` | `string?` | Toujours `"user"`. Les thèmes `builtin` sont inclus dans le launcher. |
| `bg_image` | `string?` | Nom du fichier d'image de fond (doit être dans le même dossier). |
| `bg_image_blur` | `string?` | Flou du fond (ex : `"10px"`). |
| `bg_image_opacity` | `number?` | Opacité du fond (0 à 1, ex : `0.6`). |
| `variables` | `object` | Carte des variables CSS qui définissent l'apparence. |

## Image de fond

Le champ `bg_image` référence un fichier dans le dossier du thème (ex : `bg.jpg`, `bg.gif`). CubicLauncher :

- **Vérifie le type réel** par magic number, ne se fie pas à l'extension du fichier.
- **Ne charge pas les images de plus de 25 Mo** pour des raisons de sécurité et d'efficacité.
- **Accepte uniquement les formats d'image valides** (PNG, JPG, GIF, WEBP, etc.).

Si le launcher ne peut pas charger l'image (fichier corrompu, format invalide, trop lourd), il l'ignore et n'affiche pas de fond. En plus des champs ci-dessus, le launcher gère en interne ces variables CSS pour le fond :

| Variable | Description |
|---|---|
| `--bg-image` | Définie automatiquement lors du chargement de l'image. |
| `--bg-image-loaded` | Mise à `0` pendant le chargement et `1` quand elle est prête. |

## Variables CSS disponibles

Les variables dans `theme.json` sont appliquées directement comme propriétés CSS personnalisées. Voici les principales :

### Couleurs de fond
| Variable | Description |
|---|---|
| `--bg-main` | Fond principal de la fenêtre |
| `--bg-sidebar` | Fond de la barre latérale |
| `--bg-card` | Fond des cartes |
| `--bg-item-active` | Fond de l'élément actif |
| `--bg-overlay` | Fond des overlays/modal |
| `--bg-input` | Fond des inputs |

### Couleurs de texte
| Variable | Description |
|---|---|
| `--text-primary` | Texte principal |
| `--text-secondary` | Texte secondaire |
| `--text-muted` | Texte désactivé ou subtil |

### Accent
| Variable | Description |
|---|---|
| `--accent` | Couleur d'accent principale |
| `--accent-rgb` | Accent en format RGB (pour utiliser avec `rgba()`) |
| `--accent-hover` | Accent au survol |
| `--accent-text` | Couleur du texte sur fond d'accent |

### Bordures et ombres
| Variable | Description |
|---|---|
| `--border-color` | Couleur des bordures |
| `--border-radius` | Rayon de bordure général |
| `--border-radius-sm` | Petit rayon de bordure |
| `--shadow-sm` | Petite ombre |
| `--shadow-md` | Ombre moyenne |
| `--glow-accent` | Lueur de la couleur d'accent |

### États
| Variable | Description |
|---|---|
| `--color-success` | Couleur de succès |
| `--color-success-rgb` | Succès en RGB |
| `--color-error` | Couleur d'erreur |
| `--color-error-rgb` | Erreur en RGB |
| `--color-warning` | Couleur d'avertissement |
| `--color-warning-rgb` | Avertissement en RGB |
| `--color-status-starting` | Statut "démarrage" |
| `--color-status-started` | Statut "démarré" |

### Scrollbar
| Variable | Description |
|---|---|
| `--scrollbar-track` | Fond de la barre de défilement |
| `--scrollbar-thumb` | Couleur du curseur de défilement |

### Typographie
| Variable | Description |
|---|---|
| `--font-family` | Famille de police |
| `--font-size-base` | Taille de base |
| `--font-size-sm` | Petite taille |
| `--font-size-lg` | Grande taille |

### Icônes
| Variable | Description |
|---|---|
| `--icon-filter` | Filtre CSS pour les icônes |
| `--icon-filter-error` | Filtre pour les icônes d'erreur |

## Publier un thème

Si vous voulez partager votre thème avec la communauté, envoyez une PR au [dépôt officiel de Thèmes](https://github.com/CubicLauncherDevs/Themes).

La structure du dépôt est :

```
src/
└── <votre-utilisateur>/
    └── <nom-du-thème>/
        ├── showcase.png
        └── Nom:Auteur.zip
```

- **`showcase.png`** — capture du launcher avec votre thème appliqué pour l'afficher dans la galerie.
- **`Nom:Auteur.zip`** — zip avec le répertoire du thème à l'intérieur, contenant `theme.json` et optionnellement `bg.EXTENSION`. Le nom du zip suit la convention `Nom:Auteur.zip`.

Formats d'image acceptés pour le fond : **PNG**, **GIF**, **WEBP**, **JPG**.
