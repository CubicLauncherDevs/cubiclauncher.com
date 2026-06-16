---
title: Instancias | CubicLauncher
---

# Instancias

Una **instancia** es un directorio autocontenido con su propia copia de Minecraft, mods, resource packs, capturas y configuración. Cada instancia representa una combinación específica de versión de Minecraft y mod loader.

## Estructura en disco

Las instancias están dentro de `.cubic/instances/`. Cada instancia es una carpeta con el nombre que le hayas puesto:

```
.cubic/
└── instances/
    └── Mi Instancia/
        ├── instance.cub        ← metadatos de la instancia
        ├── mods/               ← mods (.jar / .jar.disabled)
        ├── resourcepacks/      ← resource packs (.zip)
        ├── screenshots/        ← capturas de pantalla (.png)
        └── ...                 ← archivos de runtime de Minecraft
```

El archivo `instance.cub` guarda los metadatos en JSON:

```jsonc
{
  "name": "Mi Instancia",
  "version": "1.21-fabric",
  "last_played": 1717000000,
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "icon": "/images/instances/fabric.png",
  "cover_image": null,
  "min_memory": null,
  "max_memory": null
}
```

## Crear una instancia

1. Hacé clic en **"Crear Instancia"** en la barra lateral.
2. Elegí un **nombre** (máximo 16 caracteres ASCII).
3. Seleccioná una **versión** de las ya descargadas (si no aparece la que querés, primero descargala desde el botón de descargas).
4. Elegí un **icono** (Vanilla, Fabric, Forge o Modrinth).
5. Presioná **Crear**.

> La versión determina el mod loader automáticamente: si el ID contiene `fabric` se detecta como Fabric, si contiene `forge` como Forge, si contiene `quilt` como Quilt, sino es Vanilla.

## La vista de instancia

Al seleccionar una instancia se abre su panel principal con:

- **Hero** — banner con el nombre, icono, versión, loader y estado actual
- **Botón "Jugar"** — inicia Minecraft con esta instancia
- **Barra de estado** — muestra el estado en tiempo real (Off / Starting / Started / Error)

### Pestaña Detalles

Muestra la información general de la instancia:

- Badges de versión y loader (Vanilla, Fabric, Forge, Quilt)
- Ruta en disco con botón para abrir la carpeta
- Accesos directos a las carpetas de mods, screenshots y resource packs
- Consola en vivo con el output de Minecraft (con autoscroll)
- Botón **"Forzar cierre"** si la instancia está corriendo

### Pestaña Mods

Lista los mods instalados con su nombre, versión y un toggle para activarlos/desactivarlos (renombra `.jar` ↔ `.jar.disabled`).

Solo visible si la instancia usa un mod loader (Fabric, Forge o Quilt).

### Pestaña Obtener Mods

Buscador integrado de Modrinth. Podés:

- Buscar mods por nombre
- Filtrar por categorías y loader
- Agregar mods a una canasta
- Elegir la versión del mod compatible con tu versión de Minecraft
- Descargar con resolución de dependencias

Solo visible si la instancia usa un mod loader.

### Pestaña Recursos

Administrá los resource packs (`.zip`) de la instancia:

- Subir nuevos packs desde el sistema de archivos
- Eliminar packs existentes

### Pestaña Capturas

Galería de capturas de pantalla tomadas dentro de la instancia:

- Vista previa en miniatura
- Visor con lightbox al hacer clic
- Eliminar capturas

## Ciclo de vida

```
Off ──► Starting ──► Started ──► Off
 │         │            │
 │         │            │
 └────► Error ◄─────────┘
```

- **Off** — la instancia no se está ejecutando
- **Starting** — el launcher está preparando y lanzando Minecraft
- **Started** — Minecraft está corriendo
- **Error** — ocurrió un error al iniciar (versión faltante, Java incorrecto, etc.)

## Administrar instancias

Desde la barra lateral podés:

- **Renombrar** — cambiá el nombre (también renombra la carpeta en disco)
- **Eliminar** — borra la instancia y todo su contenido (mods, capturas, etc.)
- **Abrir carpeta** — accedé directamente al directorio de la instancia

También podés abrir carpetas específicas desde la pestaña Detalles: mods, resource packs, screenshots.

## Descargar versiones

Usá el botón de descargas en la barra lateral para abrir el **Version Downloader**. Ahí podés descargar:

- **Versiones Vanilla** — release y snapshot
- **Versiones Alpha/Beta** — versiones antiguas
- **Fabric** — versiones con Fabric Loader

Las versiones descargadas se guardan en `.cubic/shared/versions/` y se comparten entre todas las instancias.

## Memoria RAM

Podés configurar memoria personalizada por instancia editando el `instance.cub`. Si `min_memory` o `max_memory` no están seteados, se usan los valores globales de la configuración.
