---
title: How to make themes | CubicLauncher
---

# How to make themes

CubicLauncher allows you to fully customize the interface with themes. Each theme defines colors, fonts, borders and an optional background image.

## Theme structure

User themes go inside `.cubic/themes/`. Each theme is a folder with a `theme.json` and, optionally, a background image:

```
.cubic/
└── themes/
    └── theme1/
        ├── theme.json
        └── bg.jpg
```

> The launcher does **not** load anything outside `.cubic` for security reasons.

## `theme.json` format

The `theme.json` file follows this schema:

```jsonc
{
  "name": "My Theme",
  "author": "YourName",
  "type": "user",
  "bg_image": "bg.jpg",
  "bg_image_blur": "10px",
  "bg_image_opacity": 0.6,
  "variables": { /* ... */ }
}
```

### `theme.json` fields

| Field | Type | Description |
|---|---|---|
| `name` | `string` | **Required.** Visible theme name in the selector. |
| `author` | `string?` | Theme author. |
| `type` | `string?` | Always `"user"`. `builtin` themes come included with the launcher. |
| `bg_image` | `string?` | Background image filename (must be in the same folder). |
| `bg_image_blur` | `string?` | Background blur (e.g. `"10px"`). |
| `bg_image_opacity` | `number?` | Background opacity (0 to 1, e.g. `0.6`). |
| `variables` | `object` | CSS variable map that defines the appearance. |

## Background image

The `bg_image` field references a file inside the theme folder (e.g. `bg.jpg`, `bg.gif`). CubicLauncher:

- **Checks the actual type** by magic number, not the file extension.
- **Does not load images over 25 MB** for safety and efficiency.
- **Only accepts valid image formats** (PNG, JPG, GIF, WEBP, etc.).

If the launcher cannot load the image (corrupted file, invalid format, too heavy), it ignores it and shows no background. In addition to the fields above, the launcher internally manages these CSS variables for the background:

| Variable | Description |
|---|---|
| `--bg-image` | Automatically set when loading the image. |
| `--bg-image-loaded` | Set to `0` while loading and `1` when ready. |

## Available CSS variables

The variables in `theme.json` are applied directly as CSS custom properties. These are the main ones:

### Background colors
| Variable | Description |
|---|---|
| `--bg-main` | Main window background |
| `--bg-sidebar` | Sidebar background |
| `--bg-card` | Card background |
| `--bg-item-active` | Active item background |
| `--bg-overlay` | Overlay/modal background |
| `--bg-input` | Input background |

### Text colors
| Variable | Description |
|---|---|
| `--text-primary` | Primary text |
| `--text-secondary` | Secondary text |
| `--text-muted` | Disabled or subtle text |

### Accent
| Variable | Description |
|---|---|
| `--accent` | Main accent color |
| `--accent-rgb` | Accent in RGB format (for use with `rgba()`) |
| `--accent-hover` | Accent on hover |
| `--accent-text` | Text color on accent background |

### Borders and shadows
| Variable | Description |
|---|---|
| `--border-color` | Border color |
| `--border-radius` | General border radius |
| `--border-radius-sm` | Small border radius |
| `--shadow-sm` | Small shadow |
| `--shadow-md` | Medium shadow |
| `--glow-accent` | Accent color glow |

### States
| Variable | Description |
|---|---|
| `--color-success` | Success color |
| `--color-success-rgb` | Success in RGB |
| `--color-error` | Error color |
| `--color-error-rgb` | Error in RGB |
| `--color-warning` | Warning color |
| `--color-warning-rgb` | Warning in RGB |
| `--color-status-starting` | "Starting" status |
| `--color-status-started` | "Started" status |

### Scrollbar
| Variable | Description |
|---|---|
| `--scrollbar-track` | Scrollbar track background |
| `--scrollbar-thumb` | Scrollbar thumb color |

### Typography
| Variable | Description |
|---|---|
| `--font-family` | Font family |
| `--font-size-base` | Base font size |
| `--font-size-sm` | Small font size |
| `--font-size-lg` | Large font size |

### Icons
| Variable | Description |
|---|---|
| `--icon-filter` | CSS filter for icons |
| `--icon-filter-error` | Filter for error icons |

## Publishing a theme

If you want to share your theme with the community, send a PR to the [official Themes repository](https://github.com/CubicLauncher/Themes).

The repo structure is:

```
src/
└── <your-username>/
    └── <theme-name>/
        ├── showcase.png
        └── Name:Author.zip
```

- **`showcase.png`** — screenshot of the launcher with your theme applied to display in the gallery.
- **`Name:Author.zip`** — zip with the theme directory inside, containing `theme.json` and optionally `bg.EXTENSION`. The zip name follows the `Name:Author.zip` convention.

Accepted image formats for the background: **PNG**, **GIF**, **WEBP**, **JPG**.
