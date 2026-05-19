---
title: Temas | CubicLauncher
---

# Temas

CubicLauncher te permite personalizar completamente la interfaz con temas. Cada tema define colores, fuentes, bordes y una imagen de fondo opcional.

> **Warning:** El schema (`$schema`) referenciado en los ejemplos puede estar desactualizado. Revisá el repositorio oficial de [CubicLauncher Themes](https://github.com/CubicLauncher/Themes) para la versión más reciente.

## Estructura de un tema

Los temas de usuario van dentro de `.cubic/themes/`. Cada tema es una carpeta con un `theme.json` y, opcionalmente, una imagen de fondo:

```
.cubic/
└── themes/
    └── theme1/
        ├── theme.json
        └── bg.jpg
```

> El launcher **no** carga nada que esté fuera de `.cubic` por seguridad.

## Formato del `theme.json`

El archivo `theme.json` sigue este esquema:

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/CubicLauncher/Themes/refs/heads/main/theme-schema.json",
  "name": "Theme1",
  "author": "CubicLauncher",
  "type": "user",
  "font": "font",
  "bg_image": "bg.jpg",
  "variables": { /* ... */ }
}
```

### Campos del `theme.json`

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre visible del tema en el selector. |
| `author` | `string` | Autor del tema. |
| `type` | `string` | Siempre `"user"`. Los temas `builtin` vienen incluidos en el launcher. |
| `font` | `string?` | Ruta a un archivo de fuente dentro de la carpeta del tema. |
| `bg_image` | `string?` | Nombre del archivo de imagen de fondo (debe estar en la misma carpeta). |
| `variables` | `object` | Mapa de variables CSS que definen la apariencia. |

## Imagen de fondo

El campo `bg_image` referencia un archivo dentro de la carpeta del tema (ej: `bg.jpg`, `bg.gif`). CubicLauncher:

- **Verifica el tipo real** por magic number, no confía en la extensión del archivo.
- **No carga imágenes de más de 25 MB** por seguridad y eficiencia.
- **Solo acepta formatos de imagen válidos** (PNG, JPG, GIF, WEBP, etc.).

Las siguientes variables controlan cómo se muestra el fondo:

| Variable | Ejemplo | Descripción |
|---|---|---|
| `--bg-image` | `none` | Se establece automáticamente al cargar la imagen. No la toques. |
| `--bg-image-blur` | `10px` | Desenfoque del fondo. |
| `--bg-image-opacity` | `0.6` | Opacidad del fondo (0 a 1). |

Si el launcher no puede cargar la imagen (archivo corrupto, formato no válido, muy pesado), la ignora y no muestra fondo.

## Variables CSS disponibles

Las variables en `theme.json` se aplican directamente como CSS custom properties. Estas son las principales:

### Colores de fondo
| Variable | Descripción |
|---|---|
| `--bg-main` | Fondo principal de la ventana |
| `--bg-sidebar` | Fondo de la barra lateral |
| `--bg-card` | Fondo de tarjetas |
| `--bg-item-active` | Fondo del elemento activo |
| `--bg-overlay` | Fondo de overlays/modal |
| `--bg-input` | Fondo de inputs |

### Colores de texto
| Variable | Descripción |
|---|---|
| `--text-primary` | Texto principal |
| `--text-secondary` | Texto secundario |
| `--text-muted` | Texto desactivado o sutil |

### Acento
| Variable | Descripción |
|---|---|
| `--accent` | Color de acento principal |
| `--accent-rgb` | Acento en formato RGB (para usar con `rgba()`) |
| `--accent-hover` | Acento al hacer hover |
| `--accent-text` | Color de texto sobre fondo de acento |

### Bordes y sombras
| Variable | Descripción |
|---|---|
| `--border-color` | Color de bordes |
| `--border-radius` | Radio de borde general |
| `--border-radius-sm` | Radio de borde pequeño |
| `--shadow-sm` | Sombra pequeña |
| `--shadow-md` | Sombra mediana |
| `--glow-accent` | Brillo del color de acento |

### Estados
| Variable | Descripción |
|---|---|
| `--color-success` | Color de éxito |
| `--color-success-rgb` | Éxito en RGB |
| `--color-error` | Color de error |
| `--color-error-rgb` | Error en RGB |
| `--color-warning` | Color de advertencia |
| `--color-warning-rgb` | Advertencia en RGB |
| `--color-status-starting` | Estado "iniciando" |
| `--color-status-started` | Estado "iniciado" |

### Scrollbar
| Variable | Descripción |
|---|---|
| `--scrollbar-track` | Fondo de la barra de scroll |
| `--scrollbar-thumb` | Color del indicador de scroll |

### Tipografía
| Variable | Descripción |
|---|---|
| `--font-family` | Familia de fuente |
| `--font-size-base` | Tamaño base |
| `--font-size-sm` | Tamaño pequeño |
| `--font-size-lg` | Tamaño grande |

### Iconos
| Variable | Descripción |
|---|---|
| `--icon-filter` | Filtro CSS para iconos |
| `--icon-filter-error` | Filtro para iconos de error |

## Ejemplo completo

Acá tenés un tema funcional, "Miku":

```json
{
  "$schema": "https://raw.githubusercontent.com/CubicLauncher/Themes/refs/heads/main/theme-schema.json",
  "name": "Azulito lindo xd",
  "author": "CubicLauncher",
  "type": "user",
  "bg_image": "bg.jpg",
  "variables": {
    "--bg-main": "#0a0a0a",
    "--bg-sidebar": "#0d0d0d",
    "--bg-card": "#141414",
    "--bg-item-active": "#1a1a1a",
    "--bg-overlay": "rgba(0,0,0,0.75)",
    "--bg-input": "#111111",
    "--text-primary": "#d8e8f0",
    "--text-secondary": "#6a8a9a",
    "--text-muted": "#485a68",
    "--border-color": "#1c2a38",
    "--border-radius": "5px",
    "--border-radius-sm": "2px",
    "--accent": "#5ab8f5",
    "--accent-rgb": "90,184,245",
    "--accent-hover": "#3a9ad4",
    "--accent-text": "#0a0a0a",
    "--shadow-sm": "0 1px 3px rgba(0,0,0,0.5)",
    "--shadow-md": "0 4px 12px rgba(0,0,0,0.6)",
    "--glow-accent": "0 0 14px rgba(90,184,245,0.25)",
    "--color-success": "#5fb86a",
    "--color-success-rgb": "95,184,106",
    "--color-error": "#e85a5a",
    "--color-error-rgb": "232,90,90",
    "--color-warning": "#e8a840",
    "--color-warning-rgb": "232,168,64",
    "--color-status-starting": "#39b8a5",
    "--color-status-started": "#4ecdc4",
    "--icon-filter": "invert(90%) sepia(10%) hue-rotate(180deg)",
    "--icon-filter-error": "invert(40%) sepia(80%) saturate(5000%) hue-rotate(340deg) brightness(100%) contrast(100%)",
    "--scrollbar-track": "#0a0a0a",
    "--scrollbar-thumb": "#1c2a38",
    "--font-family": "Cantarell, sans-serif",
    "--font-size-base": "14px",
    "--font-size-sm": "12px",
    "--font-size-lg": "16px",
    "--bg-image": "none",
    "--bg-image-blur": "10px",
    "--bg-image-opacity": "0.6"
  }
}
```
