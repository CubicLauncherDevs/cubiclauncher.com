---
title: Cómo hacer themes | CubicLauncher
---

# Cómo hacer themes

CubicLauncher te permite personalizar completamente la interfaz con temas. Cada tema define colores, fuentes, bordes y una imagen de fondo opcional.

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
  "name": "Mi Tema",
  "author": "TuNombre",
  "type": "user",
  "bg_image": "bg.jpg",
  "bg_image_blur": "10px",
  "bg_image_opacity": 0.6,
  "variables": { /* ... */ }
}
```

### Campos del `theme.json`

| Campo | Tipo | Descripción |
|---|---|---|
| `name` | `string` | **Requerido.** Nombre visible del tema en el selector. |
| `author` | `string?` | Autor del tema. |
| `type` | `string?` | Siempre `"user"`. Los temas `builtin` vienen incluidos en el launcher. |
| `bg_image` | `string?` | Nombre del archivo de imagen de fondo (debe estar en la misma carpeta). |
| `bg_image_blur` | `string?` | Desenfoque del fondo (ej: `"10px"`). |
| `bg_image_opacity` | `number?` | Opacidad del fondo (0 a 1, ej: `0.6`). |
| `variables` | `object` | Mapa de variables CSS que definen la apariencia. |

## Imagen de fondo

El campo `bg_image` referencia un archivo dentro de la carpeta del tema (ej: `bg.jpg`, `bg.gif`). CubicLauncher:

- **Verifica el tipo real** por magic number, no confía en la extensión del archivo.
- **No carga imágenes de más de 25 MB** por seguridad y eficiencia.
- **Solo acepta formatos de imagen válidos** (PNG, JPG, GIF, WEBP, etc.).

Si el launcher no puede cargar la imagen (archivo corrupto, formato no válido, muy pesado), la ignora y no muestra fondo. Además de los campos anteriores, el launcher maneja internamente estas variables CSS para el fondo:

| Variable | Descripción |
|---|---|
| `--bg-image` | Se establece automáticamente al cargar la imagen. |
| `--bg-image-loaded` | Se setea a `0` mientras carga y `1` cuando está lista. |

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

## Publicar un theme

Si querés compartir tu theme con la comunidad, mandate un PR al [repositorio oficial de Themes](https://github.com/CubicLauncher/Themes).

La estructura del repo es:

```
src/
└── <tu-usuario>/
    └── <nombre-del-theme>/
        ├── showcase.png
        └── Nombre:Autor.zip
```

- **`showcase.png`** — captura del launcher con tu theme aplicado para mostrarlo en la galería.
- **`Nombre:Autor.zip`** — zip con el directorio del theme adentro, que contiene `theme.json` y opcionalmente `bg.EXTENSION`. El nombre del zip sigue la convención `Nombre:Autor.zip`.

Formatos de imagen aceptados para el background: **PNG**, **GIF**, **WEBP**, **JPG**.
